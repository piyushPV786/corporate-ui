// ** React Imports
import { useEffect, useState } from 'react'

// ** Material Ui Imports
import { Card, CircularProgress, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import { DeleteCircleOutline, EyeCircleOutline } from 'mdi-material-ui'

// ** Custom Components and services
import { DateFormat, getFileUrl, getName } from 'src/utils'
import { messages, status } from 'src/context/common'
import { CommonService, StudentService } from 'src/service'
import { IDocumentListResponseTypes, IUploadDocumentParam } from 'src/types/apps/projectTypes'
import DocumentDialog from 'src/views/pages/dialog/DocumentDialog'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { errorToast, successToast } from 'src/components/Toast'
import axios from 'axios'

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const defaultColumns = [
  {
    flex: 0.5,
    field: 'id',
    headerName: '#',
    renderCell: (index: IIndex) => <Typography>{index.api.getRowIndex(index.row.id) + 1}</Typography>
  },
  {
    flex: 3,
    field: 'name',
    headerName: 'File Name',
    renderCell: ({ row }: GridRenderCellParams) => (
      <Typography
        sx={{
          p: 0,
          whiteSpace: 'normal', // Allow text to wrap
          wordWrap: 'break-word', // Break long words
          overflow: 'visible' // Ensure visibility
        }}
      >
        {row.name}
      </Typography>
    )
  }
]
const isLoadingInitialState = {
  documentAdding: false,
  listLoading: true
}

const Documents = ({ projectCode }: { projectCode: string }) => {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>(isLoadingInitialState)
  const [viewFileLoader, setViewFileLoader] = useState<{ [key: string]: boolean }>()
  const [documentList, setDocumentList] = useState<Array<IDocumentListResponseTypes>>([])
  const [documentTypeList, setDocumentTypeList] = useState<Array<commonListTypes>>([])

  const getDocumentList = async () => {
    const response = await StudentService.getProjectDocuments(projectCode)
    if (response) {
      setDocumentList(response.data)
      setIsLoading(prev => ({ ...prev, listLoading: false }))
      response?.data?.map((item: IDocumentListResponseTypes) =>
        setViewFileLoader(prev => ({ ...prev, [item.code]: false }))
      )
    }
  }
  const getDocumentTypeList = async () => {
    const response = await CommonService.getProjectDocumentTypeList()

    if (response) {
      setDocumentTypeList(response.data)
    }
  }
  useEffect(() => {
    getDocumentList()
    getDocumentTypeList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uploadDocument = async (param: IUploadDocumentParam, docCode: string) => {
    setIsLoading(prev => ({ ...prev, documentAdding: true, listLoading: true }))
    const { file, documentTypeCode, comment } = param
    const response = await StudentService.addProjectDocuments({
      projectCode: projectCode,
      body: {
        documentTypeCode: documentTypeCode,
        fileName: file.name,
        fileType: file.type,
        code: docCode,
        projectCode: projectCode.toString(),
        comment: comment
      }
    })

    if (status.successCodeArr.includes(response?.statusCode)) {
      const isFileUploaded = await axios.put(decodeURIComponent(response.data), param.file)
      if (status.successCodeArr.includes(isFileUploaded?.status)) {
        getDocumentList()
        successToast(messages.uploadDocument)
      } else {
        errorToast(messages.error)
      }
    } else {
      errorToast(messages.error)
    }

    setIsLoading(prev => ({ ...prev, documentAdding: false, listLoading: false }))
  }
  const deleteDocument = async (documentCode: string) => {
    setIsLoading(prev => ({ ...prev, listLoading: true }))
    const response = await StudentService.deleteProjectDocuments(documentCode)
    response?.statusCode === status.successCode
      ? (getDocumentList(), successToast(messages.deleteDocument))
      : errorToast(messages.error)
    setIsLoading(prev => ({ ...prev, listLoading: false }))
  }
  const handleView = (fileName: string, fileCode: string) => {
    setViewFileLoader(prev => ({ ...prev, [fileCode]: true }))

    //Need to change the api in future as it is for studentcode
    getFileUrl(fileName, projectCode, setViewFileLoader, fileCode)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 1,
      field: 'documentTypeCode',
      headerName: 'Document Type',
      renderCell: ({ row }: GridRenderCellParams) => (
        <Typography>{getName(documentTypeList, row.documentTypeCode)}</Typography>
      )
    },
    {
      flex: 1,
      field: 'date',
      headerName: 'Uploaded Date',
      renderCell: ({ row }: GridRenderCellParams) => (
        <Typography>{row?.createdAt ? DateFormat(row?.createdAt) : '-'}</Typography>
      )
    },
    {
      flex: 0.5,
      sortable: false,
      type: 'number',
      field: 'actions',
      headerName: 'Actions',
      className: 'grid-actions',
      renderCell: ({ row }: GridRenderCellParams) => {
        const { fileExtension, code } = row
        const fileName = `${code}.${fileExtension?.split('/')?.pop()?.trim()}`

        return (
          <Grid container p={0} justifyContent='end'>
            <Grid item xs={6} display='flex' justifyContent='center' alignItems='center'>
              <Tooltip title='View'>
                {viewFileLoader && viewFileLoader[row.code] ? (
                  <CircularProgress color='primary' size={20} />
                ) : (
                  <IconButton onClick={() => handleView(fileName, code)}>
                    <EyeCircleOutline fontSize='large' color='primary' />
                  </IconButton>
                )}
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title='Delete'>
                <IconButton onClick={() => deleteDocument(row.code)}>
                  <DeleteCircleOutline fontSize='large' color='error' />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        )
      }
    }
  ]

  return (
    <Card sx={{ p: 5 }}>
      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Typography variant='h5'>Documents</Typography>
        </Grid>
        <Grid item>
          <DocumentDialog
            uploadDocumentApi={uploadDocument}
            documentAdding={isLoading.documentAdding}
            documentTypeList={documentTypeList}
            projectCode={projectCode}
          />
        </Grid>
      </Grid>
      <Grid container my={5} rowSpacing={10}>
        <DataGrid loading={isLoading.listLoading} autoHeight rows={documentList} columns={columns} hideFooter />
      </Grid>
    </Card>
  )
}

export default Documents
