import Grid from '@mui/material/Grid'
import 'react-phone-input-2/lib/material.css'
import { DataGrid } from '@mui/x-data-grid'
import DocumentUpload from 'src/views/pages/dialog/DocumentUpload'
import { Box, Typography, Button, Card, Tooltip } from '@mui/material'

import Close from 'mdi-material-ui/Close'
import { Check, FileDocumentMultipleOutline } from 'mdi-material-ui'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomChip from 'src/@core/components/mui/chip'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import IconButton from '@mui/material/IconButton'
import { getFileUrl, getSelectedDocument } from 'src/utils'
import { Dispatch, SetStateAction, useState } from 'react'
import { IdocumentDataType } from 'src/types/apps/invoiceTypes'
import FallbackSpinner from 'src/@core/components/spinner'
import { applicationStatusColor } from 'src/context/common'

interface CellType {
  row: IdocumentDataType
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  approved: 'primary',
  PENDING: 'warning',
  rejected: 'error'
}

interface IUploadDocumentParam {
  file: File
  documentTypeCode: string
  comment: string
}

interface IDocumentDetail {
  addAllProjectStudentDocumentApi: (param: IUploadDocumentParam) => void
  documentData: Array<IdocumentDataType>
  documentDelete: () => void
  documentDownload?: () => void
  setSelectedDocument: Dispatch<SetStateAction<Array<IdocumentDataType>>>
  studentCode: string
  isDownloadable?: boolean
}

export const DocumentDetail = ({
  addAllProjectStudentDocumentApi,
  documentData,
  documentDelete,
  documentDownload,
  setSelectedDocument,
  studentCode,
  isDownloadable
}: IDocumentDetail) => {
  const [selectedRow, setSelectedRow] = useState<Array<string | number>>([])
  const [isPreview, setPreviewDoc] = useState<boolean>(false)

  const columns = [
    {
      field: 'id',
      minWidth: 40,
      headerName: '#',
      renderCell: (index: any) => index.api.getRowIndex(index.row.id) + 1
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 150,
      headerName: ' File Name'
    },
    {
      flex: 0.1,
      field: 'fileExtension',
      minWidth: 100,
      headerName: ' File Type'
    },
    {
      flex: 0.1,
      field: 'comment',
      minWidth: 150,
      headerName: ' COMMENTS'
    },
    {
      flex: 0.1,
      field: 'createdAt',
      minWidth: 180,
      headerName: 'UPLOAD DATE & TIME'
    },

    {
      flex: 0.1,
      field: 'status',
      minWidth: 50,
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status}
            color={userStatusObj[row.status] ?? applicationStatusColor[row.status]}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.1,
      field: 'preview',
      minWidth: 30,
      headerName: 'Preview',
      renderCell: ({ row }: CellType) => {
        const { fileExtension, code, name } = row
        const fileName = !!code ? `${code}.${fileExtension?.split('/')?.pop()?.trim()}` : name

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
            <Tooltip title='View'>
              <IconButton
                disabled={!studentCode}
                size='small'
                component='a'
                sx={{ textDecoration: 'none', mr: 0.5 }}
                onClick={() => {
                  setPreviewDoc(true)
                  setTimeout(() => {
                    setPreviewDoc(false)
                  }, 1500)
                  getFileUrl(fileName, studentCode)
                }}
              >
                <EyeOutline />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <Grid item sx={{ pt: 5 }}>
        <Card sx={{ mt: 4.5, mb: 0, p: 7 }}>
          {isPreview ? (
            <FallbackSpinner />
          ) : (
            <>
              <Grid container display={'flex'} justifyContent={'space-between'}>
                <Grid item>
                  <Box>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                      <FileDocumentMultipleOutline sx={{ mr: 2 }} color='primary' />
                      Documents
                    </Typography>
                  </Box>
                </Grid>

                <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{ mr: 2 }}
                    color='error'
                    startIcon={<Close />}
                    disabled={!selectedRow.length}
                    onClick={documentDelete}
                  >
                    Delete
                  </Button>
                  {isDownloadable ? (
                    <Button
                      sx={{ mr: 2 }}
                      variant='contained'
                      size='small'
                      startIcon={<Check />}
                      onClick={documentDownload}
                      disabled={!studentCode || !selectedRow.length}
                    >
                      Download
                    </Button>
                  ) : null}
                  <Box>
                    <DocumentUpload addAllProjectStudentDocumentApi={addAllProjectStudentDocumentApi} />
                  </Box>
                </Grid>
              </Grid>

              <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <DataGrid
                  autoHeight
                  pagination
                  paginationMode='server'
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  onSelectionModelChange={(newSelectionModel: Array<string | number>) => {
                    setSelectedRow(newSelectionModel)
                    setSelectedDocument(getSelectedDocument(newSelectionModel, documentData))
                  }}
                  selectionModel={selectedRow}
                  rows={documentData ?? []}
                  columns={columns}
                  checkboxSelection
                  disableSelectionOnClick
                  rowsPerPageOptions={[10, 25, 50]}
                  sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                />
              </Grid>
            </>
          )}
        </Card>
      </Grid>
    </>
  )
}
