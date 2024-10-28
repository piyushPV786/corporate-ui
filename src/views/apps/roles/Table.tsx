// ** React Imports
import { useState } from 'react'

// ** MUI Imports

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import IconButton from '@mui/material/IconButton'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Imports for view/ download file
import { DocumentType, documentStatusArray, allRoles, documentStatus, documentTypeCode } from 'src/context/common'
import { DateFormat, getFileUrl, getName } from 'src/utils'
import { IFileTypePayload, commonListTypes, documentTypes, IUpldateDocRow } from 'src/types/apps/dataTypes'
import { CircularProgress, Tooltip } from '@mui/material'
import ChangeFileType from 'src/views/pages/dialog/ChangeFileType'
import OverrideDocuments from 'src/views/pages/dialog/OverrideDocuments'
import { IUploadDocumentParam } from 'src/types/apps/projectTypes'
import CommentBoxDialog from 'src/views/pages/dialog/CommentBoxDIalog'
import { documentType } from 'src/types/apps/invoiceTypes'

interface UserStatusType {
  [key: string]: ThemeColor
}

interface IUserListTypes {
  data: Array<documentTypes>
  onSelectionModelChange: (newSelectionModel: Array<string | number>) => void
  selectedDocument: Array<string | number>
  role: string
  selectCriteria?: string
  updateDocumentFileType?: (params: IFileTypePayload, documentTypeCode: string) => Promise<void> | undefined
  documentTypeList?: commonListTypes[] | undefined
  studentCode: string
  reUploadDocument?: (param: IUploadDocumentParam, oldFile: IUpldateDocRow) => Promise<void> | undefined
  fullPermission?: boolean
}
const userStatusObj: UserStatusType = {
  approved: 'primary',
  pending: 'warning',
  rejected: 'error'
}
const UserList = ({
  data,
  onSelectionModelChange,
  selectedDocument,
  role,
  updateDocumentFileType,
  documentTypeList,
  studentCode,
  reUploadDocument,
  fullPermission
}: IUserListTypes) => {
  const [pageSize, setPageSize] = useState<number>(10)
  const currentDocumentStatus = documentStatusArray[role]
  const [viewFileLoader, setViewFileLoader] = useState<{ [key: string]: boolean }>()

  const handleView = (fileName: string, fileCode: string) => {
    setViewFileLoader(prev => ({ ...prev, [fileCode]: true }))
    getFileUrl(fileName, studentCode, setViewFileLoader, fileCode)
  }

  const columns = [
    {
      flex: 0.15,
      maxWidth: 62,
      headerName: '#',
      field: 'id',
      renderCell: (index: any) => index.api.getRowIndex(index.row.id) + 1
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'fullName',
      headerName: 'File Name',
      renderCell: ({ row }: any) => {
        const { name } = row

        return (
          <Tooltip title={name} describeChild placement='top-start'>
            <Typography variant='body2' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 200,
      headerName: 'File Type',
      renderCell: ({ row }: any) => {
        const FileType = getName(
          documentTypeList,
          row?.documentTypeCode === documentTypeCode?.TermsAndConditions
            ? documentTypeCode?.TermsAndConditionsCode
            : row?.documentTypeCode
        )

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {FileType ? (FileType === DocumentType?.AffordableRank ? documentStatus?.AffordableRank : FileType) : '-'}
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'Preview',
      headerName: 'Preview',
      renderCell: ({ row }: any) => {
        const { fileExtension, code, name } = row
        const fileName = fileExtension ? `${code}${fileExtension}` : name

        return (
          <Box width='100%' display='flex' justifyContent='center' alignItems='center'>
            {viewFileLoader && viewFileLoader[row.code] ? (
              <CircularProgress color='primary' size={20} />
            ) : (
              <Tooltip placement='top' arrow disableInteractive title='View'>
                <IconButton onClick={() => handleView(fileName, code)} size='small' color='primary'>
                  <EyeOutline />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'comment',
      headerName: 'Comments',
      renderCell: ({ row, value }: { row: documentType; value: string }) => {
        const Comment = row?.status !== DocumentType?.FinanceVerified ? value : ''

        return <CommentBoxDialog comment={Comment} />
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      maxWidth: 200,
      headerName: 'Last Updated',
      field: 'currentPlan',
      renderCell: ({ row }: { row: documentType }) => {
        return (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {DateFormat(row.createdAt)}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: any) => {
        return (
          <Tooltip placement='top' arrow disableInteractive title={!!row.comment ? row.comment : ''}>
            <Box>
              <CustomChip
                skin={'filled' as any}
                size='small'
                label={row?.status?.replace('APPROVED', 'VERIFIED')}
                color={userStatusObj[row.status.toLowerCase()]}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Tooltip>
        )
      }
    }
  ]

  if (role !== allRoles.application && fullPermission) {
    columns?.push({
      flex: 0.15,
      minWidth: 180,
      headerName: 'Action',
      field: 'action',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChangeFileType
              row={row}
              updateDocumentFileType={updateDocumentFileType}
              documentTypeList={documentTypeList}
            />
            {role === allRoles.enrolment && reUploadDocument !== undefined ? (
              <OverrideDocuments row={row} reUploadDocument={reUploadDocument} documentTypeList={documentTypeList} />
            ) : null}
          </Box>
        )
      }
    })
  }

  const checkDisableDocument = (params: any) => {
    if (role === allRoles.admission) {
      return (
        !currentDocumentStatus.includes(params?.row?.status) &&
        params?.row?.documentTypeCode !== DocumentType.AcceptanceLetter &&
        params?.row?.documentTypeCode !== DocumentType.BursaryLetter &&
        params?.row?.documentTypeCode !== DocumentType.PaymentProof &&
        params?.row?.documentTypeCode !== DocumentType.TermsAndConditions &&
        params?.row?.documentTypeCode !== DocumentType.Quote &&
        params?.row?.documentTypeCode !== DocumentType.Study_Flexi_Agreement &&
        params?.row?.documentTypeCode !== DocumentType.Study_Flexi_Calculation
      )
    } else if (role === allRoles.enrolment) {
      return (
        !currentDocumentStatus.includes(params?.row?.status) &&
        params?.row?.documentTypeCode !== DocumentType.AcceptanceLetter &&
        params?.row?.documentTypeCode !== DocumentType.Quote
      )
    } else {
      return (
        params?.row?.documentTypeCode === DocumentType.PaymentProof &&
        !currentDocumentStatus.includes(params?.row?.status)
      )
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            onSelectionModelChange={onSelectionModelChange}
            selectionModel={selectedDocument}
            rows={data}
            columns={columns as any}
            checkboxSelection={fullPermission}
            disableSelectionOnClick
            pageSize={pageSize}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            isRowSelectable={(params: GridRowParams) => checkDisableDocument(params)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
