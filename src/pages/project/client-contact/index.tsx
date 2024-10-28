import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import DialogClientContact from 'src/views/pages/dialog/DialogClientContact'

import { DataGrid } from '@mui/x-data-grid'
import DeleteClientContact from 'src/views/pages/dialog/DeleteClientContact'
import { IClientContact } from 'src/types/apps/invoiceTypes'
import { DashboardService } from 'src/service'
import { useEffect, useState } from 'react'
import { clientcontactMessages } from 'src/context/common'
import { successToast } from 'src/components/Toast'
import { status } from 'src/context/common'
import { Typography } from '@mui/material'

interface CellType {
  row: IClientContact
}

const initialState = {
  statusCode: 1,
  message: '',
  data: []
}

interface IResponseTypes {
  statusCode: number
  message: string
  data: Array<IClientContact>
  count?: number
}

interface DataParams {
  pageSize: number
  pageNumber: number
  projectCode: string
}

interface propsType {
  code: string
}

const ContactDetailsList = ({ code }: propsType) => {
  const projectCode: string = code

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState<IResponseTypes>(initialState)
  const [loading, setLoading] = useState<boolean>(false)

  const handleEdit = async (params: IClientContact, id?: number) => {
    setLoading(true)
    const payload = {
      ...params
    }
    const response = await DashboardService?.editClientContact(payload, id)

    if (response?.status === status.successCode) {
      getClientContactList({
        pageSize: pageSize,
        pageNumber: pageNumber,
        projectCode: projectCode
      })
      successToast(clientcontactMessages.edit)
    }
    setLoading(false)
  }

  const deleteClientContact = async (id?: number) => {
    const response = await DashboardService?.deleteClientContact(id)
    if (response?.status === 200) {
      getClientContactList({
        pageSize: pageSize,
        pageNumber: pageNumber,
        projectCode: projectCode
      })
      successToast(clientcontactMessages.delete)
    }
  }

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      headerName: '#',
      renderCell: (index: any) => index.api.getRowIndex(index.row.id) + 1
    },
    {
      flex: 0.25,
      field: 'name',
      minWidth: 40,
      headerName: 'Name',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2 }}>{row.title}</Typography>
          <Typography sx={{ mr: 1 }}>{row.firstName}</Typography>
          <Typography>{row.lastName}</Typography>
        </Box>
      )
    },
    {
      flex: 0.25,
      field: 'mobile',
      minWidth: 50,
      headerName: 'Mobile',
      renderCell: ({ row }: CellType) => <Typography>{`+${row.mobileCountryCode} ${row.mobileNumber}`}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 40,
      field: 'telephone',
      headerName: 'Telephone',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{`+${row.telephoneCountryCode} ${row.telephoneNumber}`}</Typography>
        </Box>
      )
    },
    {
      flex: 0.25,
      field: 'email',
      minWidth: 40,
      headerName: 'Email'
    },
    {
      flex: 0.25,
      minWidth: 40,
      field: 'department',
      headerName: 'Department'
    },
    {
      flex: 0.25,
      minWidth: 40,
      field: 'designation',
      headerName: 'Designation'
    },
    {
      flex: 0.25,
      minWidth: 40,
      field: 'relationshipOwner',
      headerName: 'Relationship Owner'
    },
    {
      flex: 0.25,
      minWidth: 40,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DialogClientContact title='Edit' data={row} handleEdit={handleEdit} />
          <DeleteClientContact row={row} deleteClientContact={deleteClientContact} />
        </Box>
      )
    }
  ]

  const getClientContactList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getClientContactList(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const createClientContact = async (params: IClientContact) => {
    setLoading(true)
    const payload = {
      ...params,
      projectCode: projectCode
    }
    const response = await DashboardService?.createClientContact(payload)

    if (response?.status === status.successCodeOne) {
      getClientContactList({
        pageSize: pageSize,
        pageNumber: pageNumber,
        projectCode: projectCode
      })
      successToast(clientcontactMessages.add)
    }
    setLoading(false)
  }
  useEffect(() => {
    getClientContactList({
      pageSize: pageSize,
      pageNumber: pageNumber,
      projectCode: projectCode
    })
  }, [pageSize, pageNumber])

  return (
    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Card sx={{ p: 5 }}>
          <Grid
            item
            xs={12}
            sx={{
              pb: 3,
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant='h5'>Client- Contact Details</Typography>
            </Box>
            <DialogClientContact title='Add' createClientContact={createClientContact} />
          </Grid>
          <DataGrid
            loading={loading}
            autoHeight
            pagination
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={response?.data}
            rowCount={response?.count}
            columns={columns}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: ' bold' }
            }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}
export default ContactDetailsList
