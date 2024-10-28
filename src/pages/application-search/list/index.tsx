/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import CustomChip from 'src/@core/components/mui/chip'
import 'react-datepicker/dist/react-datepicker.css'
import { DashboardService } from 'src/service'
import {
  applicationStatusColor,
  status,
  studentApplicationAllStatus,
  studentApplicationSubStatus
} from 'src/context/common'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { useRouter } from 'next/router'
import { minTwoDigits, serialNumber } from 'src/utils'
import VipTag from 'src/views/apps/VipTag'
import TableHeader from 'src/views/apps/admission/list/TableHeader'
import CustomNoRowsOverlay from 'src/components/no-records'

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  enrolled: 'primary',
  'RESUB-APP-FEE-PROOF': 'warning',
  sales: 'info',
  ' APP-FEE-ACCEPTED': 'error'
}

interface CellType {
  row: InvoiceType
}
const initialState = {
  statusCode: 1,
  message: '',
  data: []
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const StudentList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState<any>(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const getApplicationRecords = async () => {
    setLoading(true)

    const params = {
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
    }
    const response = await DashboardService?.getAllApplicationRecord(params)
    if (response?.data?.statusCode === status.successCode && response?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getApplicationRecords()
  }, [pageSize, pageNumber, value])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const columns = [
    {
      field: 'id',
      minWidth: 50,
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index?.row?.id), pageNumber, pageSize))}`}</Box>
      }
    },

    {
      flex: 0.5,
      minWidth: 120,
      field: 'Application',
      headerName: 'Student ID',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{row?.lead?.studentCode ? `${row?.lead?.studentCode}` : '-'}</Typography>
          <Tooltip title='Application No'>
            <Typography variant='caption'>{`${row?.applicationCode}`}</Typography>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0.7,
      minWidth: 300,
      field: 'name',
      headerName: 'Student Name',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid container display='flex'>
                <Grid item>
                  <Typography
                    noWrap
                    variant='body2'
                    sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                  >
                    {row?.lead?.firstName ? `${row?.lead?.firstName} ${row?.lead?.lastName}` : '-'}
                  </Typography>
                </Grid>
                {row?.lead?.student && row?.lead?.student?.VIPType !== null ? (
                  <Grid item ml={2}>
                    <Tooltip title='vip' placement='top'>
                      <Box
                        sx={{
                          backgroundColor: '#1f2b37',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <VipTag VIPType={row?.lead?.student?.VIPType} />
                      </Box>
                    </Tooltip>
                  </Grid>
                ) : null}
              </Grid>
              <Typography noWrap variant='caption'>
                {row?.lead?.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      minWidth: 300,
      field: 'agentName',
      headerName: 'Sales Agent',
      renderCell: ({ row }: CellType) => {
        return row?.agent ? (
          <Grid container>
            <Grid item xs={12}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.agent?.firstName ? `${row?.agent?.firstName} ${row?.agent?.lastName}` : '-'}
              </Typography>
            </Grid>

            <Tooltip title={row?.agent?.emailAddress}>
              <Grid item>
                <Typography noWrap variant='caption'>
                  {row?.agent?.emailAddress}
                </Typography>
              </Grid>
            </Tooltip>
          </Grid>
        ) : (
          '-'
        )
      }
    },
    {
      minWidth: 200,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {row?.lead?.mobileCountryCode ? `+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}` : '-'}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 300,
      field: 'courseName',
      headerName: 'Qualification Details',
      renderCell: ({ row }: CellType) => (
        <Grid container>
          <Tooltip title={`${row?.education?.programCode || '_'} - ${row?.education?.programName || '_'}`}>
            <Grid xs={12} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row?.education?.programCode || '_'} - {row?.education?.programName || '_'}
            </Grid>
          </Tooltip>
          <Tooltip title='Study Mode'>
            <Typography variant='caption'>{row?.education?.studyModeCode}</Typography>
          </Tooltip>
        </Grid>
      )
    },
    {
      flex: 0.8,
      minWidth: 230,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={
            !!row?.subStatus
              ? `${studentApplicationAllStatus[row.status]}-${studentApplicationSubStatus[row?.subStatus] ?? row?.subStatus}`
              : studentApplicationAllStatus[row.status]
          }
          placement='top'
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomChip
              skin='light'
              size='small'
              label={studentApplicationAllStatus[row?.status] ?? row?.status}
              color={userStatusObj[row?.status] ?? applicationStatusColor[row?.status]}
              sx={{
                textTransform: 'capitalize',
                '& .MuiChip-label': {
                  lineHeight: '18px'
                }
              }}
            />
          </Box>
        </Tooltip>
      )
    },
    {
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <Link href={`/application-search/preview/${row?.applicationCode}`} passHref>
                <IconButton color='primary' size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <EyeOutline />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography className='page-header'>Application Search</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} />
          {response?.count > 0 ? (
            <DataGrid
              loading={loading}
              autoHeight
              pagination
              paginationMode='server'
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              disableSelectionOnClick
              rows={response?.data}
              rowCount={response?.count}
              columns={columns}
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              onPageChange={newPage => setPageNumber(newPage + 1)}
            />
          ) : (
            <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <CustomNoRowsOverlay />
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentList
