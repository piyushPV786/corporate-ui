// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { Box, Card, Grid, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import { successToast } from 'src/components/Toast'
import { CorporateManagerMessages, status } from 'src/context/common'
import { DashboardService } from 'src/service'
import { minTwoDigits, serialNumber } from 'src/utils'
import TableHeader from 'src/views/apps/admission/list/TableHeader'
import { ICorporateManagerTypes } from 'src/types/apps/corporatTypes'
import CorporateManagerAddDialog from 'src/views/pages/dialog/CorporateManagerAddDialog'
import DeleteCorporateManager from 'src/views/pages/dialog/DeleteCorporateManagerDialog'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

interface CellType {
  row: ICorporateManagerTypes
}
const initialState = {
  count: 1,
  data: []
}

interface DataParams {
  q: string
  pageSize: number
  pageNumber: number
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const CorporateManager = () => {
  const [value, setQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState(initialState)
  const [loading, setLoading] = useState<boolean>(false)

  const getManagersList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getCorporateManagerList(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  const createManager = async (params: any) => {
    const response:any = await DashboardService?.createCorporateManager(params)
    if (response?.status === 201 && response?.data?.data) {
      getManagersList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber
      })
      successToast(CorporateManagerMessages.add)

      return null
    }
    else{
      return response
    }
   
  }
  const updateManager = async (params: any, code: string) => {
    const response = await DashboardService?.updateCorporateManager(params, code)
    if (response?.status === status?.successCode && response?.data?.data) {
      getManagersList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber
      })
      successToast(CorporateManagerMessages.edit)
      
      return null
    }
    else{
      return response
    }
  }

  const deleteManager = async (code: string) => {
    const response = await DashboardService?.deleteCorporateManager(code)
    if (response?.status === 200) {
      getManagersList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber
      })
      successToast(CorporateManagerMessages.delete)
    }
  }

  useEffect(() => {
    getManagersList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber
    })
  }, [pageSize, pageNumber, value])

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 60,
      headerName: '#',
      renderCell: (index: IIndex) =>
        minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))
    },
    {
      flex: 0.25,
      field: 'name',
      minWidth: 150,
      headerName: 'Name',
      colSize: 6,
      renderCell: ({ row }: CellType) => (
        <Tooltip title={`${row.firstName ?? ''} ${row.middleName ?? ''} ${row.lastName ?? ''}`} placement='top'>
          <Typography variant='body2' className='ellipsis-text'>
            {row.firstName} {row.middleName} {row.lastName}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 0.2,
      field: 'code',
      minWidth: 100,
      headerName: 'Code',
      colSize: 6
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'email',
      headerName: 'email',
      colSize: 12,
      renderCell: ({ row }: CellType) => (
        <Tooltip title={row.email ?? ''} placement='top'>
          <Typography variant='body2' className='ellipsis-text'>
            {row.email}
          </Typography>
        </Tooltip>
      )
    },

    {
      flex: 0.25,
      minWidth: 150,
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      colSize: 6,
      renderCell: ({ row }: CellType) => (
        <Tooltip title={`+${row.mobileCountryCode ?? ''} ${row.mobileNumber ?? ''}`} placement='top'>
          <Typography variant='body2' className='ellipsis-text'>
            +{row.mobileCountryCode} {row.mobileNumber}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'roles',
      headerName: 'Roles',
      renderCell: ({ row }: CellType) => {
        const roles = row.roles?.map(role => role.name).join(', ')

        return (
          <Tooltip title={roles} placement='top'>
            <Typography variant='body2' className='ellipsis-text'>
              {roles}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CorporateManagerAddDialog isEdit managerData={row} actions={{ updateManager }} />
          <DeleteCorporateManager row={row} deleteCorporateManager={deleteManager} />
        </Box>
      )
    }
  ]

  const handleFilter = (val: string) => {
    setQuery(val)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
        >
          <Box>
            <Typography className='page-header'>Corporate Manager</Typography>

            <Typography
              variant='h6'
              pb={2}
              sx={{
                '& .breadcrumb': {
                  color: theme => theme.palette.primary.main,
                  cursor: 'pointer'
                }
              }}
            >
              <Link href='/enrolment'>
                <span className='breadcrumb'>Dashboard </span>
              </Link>
              / Project and Account Managers list
            </Typography>
          </Box>
          <Box>
            <CorporateManagerAddDialog actions={{ createManager }} />
          </Box>
        </Grid>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} />
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
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CorporateManager
