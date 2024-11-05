// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { Box, Card, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import { successToast } from 'src/components/Toast'
import { CorporateManagerMessages, status } from 'src/context/common'
import { DashboardService } from 'src/service'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { minTwoDigits, serialNumber } from 'src/utils'
import TableHeader from 'src/views/apps/admission/list/TableHeader'

// ** Third Party Styles Imports
import { DeleteCircleOutline } from 'mdi-material-ui'
import 'react-datepicker/dist/react-datepicker.css'
import CorporateManagerAddDialog from 'src/views/pages/dialog/CorporateManagerAddDialog'

interface CellType {
  row: InvoiceType
}
const initialState = {
  count: 1,
  data: []
}

interface DataParams {
  q: string
  status: any
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

// ** Styled component for the link in the dataTable

const CorporateManager = () => {
  // ** State
  const [value, setQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState(initialState)
  const [loading, setLoading] = useState<boolean>(false)

  const getManagersList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getProjectList(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  const createManager = async (params: any) => {
    const response = await DashboardService?.createProject({ ...params })
    if (response?.status === 201 && response?.data?.data) {
      //   getProjectList({
      //     q: value,
      //     pageSize: pageSize,
      //     pageNumber: pageNumber,
      //     status: ''
      //   })
      successToast(CorporateManagerMessages.add)
    }
  }
  const updateManager = async (params: any, code: string) => {
    const response = await DashboardService?.updateProject({ ...params }, code)
    if (response?.status === status?.successCode && response?.data?.data) {
      //   getProjectList({
      //     q: value,
      //     pageSize: pageSize,
      //     pageNumber: pageNumber,
      //     status: ''
      //   })
      successToast(CorporateManagerMessages.edit)
    }
  }

  useEffect(() => {
    getManagersList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
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
      flex: 0.1,
      field: 'name',
      minWidth: 250,
      headerName: 'Name',
      colSize: 6,
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.name}</Typography>
    },
    {
      flex: 0.25,
      field: 'code',
      minWidth: 150,
      headerName: 'Code',
      colSize: 6
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'corporateName',
      headerName: 'email',
      colSize: 12,
      renderCell: ({ row }: CellType) => row?.corporateEd?.name
    },

    {
      flex: 0.1,
      minWidth: 200,
      field: 'projectManager',
      headerName: 'Mobile Number',
      colSize: 6,
      renderCell: ({ row }: CellType) => row.projectManager
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'program',
      headerName: 'Roles',
      renderCell: ({ row }: CellType) => row?.program
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Grid container gap={1} alignItems='center' justifyContent='center'>
          <Grid item>
            <Tooltip title='Edit'>
              <Box>
                <CorporateManagerAddDialog isEdit managerData={row} actions={{ updateManager }} />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Delete'>
              <Box>
                <IconButton size='small'>
                  <DeleteCircleOutline sx={{ fontSize: 36 }} color='error' />
                </IconButton>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
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
