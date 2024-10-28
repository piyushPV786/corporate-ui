/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRowId } from '@mui/x-data-grid'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { IAgentsType } from 'src/context/types'

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/student/list/TableHeader'
import { UserManagementService } from 'src/service'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'
// import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
// import School from 'mdi-material-ui/School'
// import Transfer from 'mdi-material-ui/Transfer'
// import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import { CommonService, DashboardService } from 'src/service'
import { applicationStatusColor, status, studentApplicationAllStatus } from 'src/context/common'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { useRouter } from 'next/router'
import { minTwoDigits, serialNumber, getName } from 'src/utils'
import VipTag from 'src/views/apps/VipTag'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { styled } from '@mui/material'

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

// ** Styled component for the link in the dataTable

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const AcademicTypography = styled(Typography)(() => ({
  color: 'inherit',
  textTransform: 'uppercase',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  display: 'block',
  fontSize: 'smaller',
  fontWeight: '600'
}))

const StudentList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [agentList, setAgentList] = useState<Array<IAgentsType>>([])
  const [response, setResponse] = useState<any>(initialState)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [qualificationList, setQualificationList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const router = useRouter()

  const getStudentList = async () => {
    setLoading(true)
    setSelectedRows([])
    const params = {
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
    }
    const response = await DashboardService?.getStudentList(params)
    if (response?.data?.statusCode === status.successCode && response?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  const getQualificationList = async () => {
    const response = await CommonService.getHighestQualification()
    if (response?.data?.statusCode === status.successCode) {
      setQualificationList(response?.data?.data)
    }
  }

  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
    }
  }

  useEffect(() => {
    getAgentData()
    getQualificationList()
    getIdentificationType()
  }, [])
  useEffect(() => {
    getStudentList()
  }, [pageSize, pageNumber, value])

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const getAgentData = async () => {
    const response = await UserManagementService.getAgents('Sales')
    if (!!response?.length) {
      setAgentList(response)
    }
  }
  const fullPermission = ModuleFeaturePermission(FeatureCodes.EMS.application, PermissionsCodes.full, moduleKeys.sales)

  const breakWords = (label: string | undefined) => {
    if (!label) return label

    const threshold = 14

    return label
      .split(' ')
      .map(word => {
        if (word && word.length > threshold) {
          return word && word.match(new RegExp('.{1,' + threshold + '}', 'g'))?.join('\n')
        }

        return word
      })
      .join(' ')
  }

  const columns = [
    {
      field: 'id',
      minWidth: 50,
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },

    {
      flex: 0.5,
      minWidth: 120,
      field: 'Application',
      headerName: 'Student ID / Application ID',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography noWrap variant='body2'>
            {row?.lead?.studentCode}
          </Typography>
          <Typography variant='caption'>{row.applicationCode}</Typography>
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
                    {`${row?.lead?.firstName} ${row?.lead?.lastName}`}
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
        return row?.education?.agent ? (
          <Grid container>
            <Grid item xs={12}>
              <Typography
                noWrap
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.education?.agent?.firstName
                  ? `${row?.education?.agent?.firstName} ${row?.education?.agent?.lastName}`
                  : ''}
              </Typography>
            </Grid>

            <Tooltip title={row?.education?.agent?.email}>
              <Grid item>
                <Typography noWrap variant='caption'>
                  {row?.education?.agent?.email}
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
      flex: 0.7,
      minWidth: 150,
      field: 'Identification',
      renderHeader: () => {
        return (
          <Grid>
            <AcademicTypography>{breakWords('IDENTIFICATION NUMBER')}</AcademicTypography>
          </Grid>
        )
      },

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
                    {`${row?.lead?.identificationNumber ? row?.lead?.identificationNumber : '-'}`}
                  </Typography>
                </Grid>
              </Grid>

              <Typography noWrap variant='caption'>
                {`${
                  row?.lead?.identificationDocumentType
                    ? getName(identificationType, row?.lead?.identificationDocumentType)
                    : '-'
                }`}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      minWidth: 200,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{`+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}`}</Typography>
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
        <Tooltip title={studentApplicationAllStatus[row.status] ?? row.status} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomChip
              skin='light'
              size='small'
              label={studentApplicationAllStatus[row.status] ?? row.status}
              color={userStatusObj[row.status] ?? applicationStatusColor[row.status]}
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
              <Link href={`/student/preview/${row.applicationCode}`} passHref>
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
      {/* <Grid item xs={12}>
        <Grid container spacing={6} sx={{ alignItems: 'stretch' }}>
          <Grid item xs={12} md={6}>
            <AnalyticsCongratulations />
          </Grid>
          <Grid item xs={6} md={2}>
            <CardStatisticsVertical
              stats='529'
              color='primary'
              trendNumber='+22%'
              icon={<School />}
              title='Total Enrolled'
              chipText='Last 3 Month'
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <CardStatisticsVertical
              stats='1200'
              color='info'
              trendNumber='+51%'
              icon={<Transfer />}
              title='Total Leads'
              chipText='Last 3 Month'
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <CardStatisticsVertical
              color='info'
              stats='105'
              icon={<CurrencyUsd />}
              trendNumber='+62%'
              chipText='Last One Year'
              title='Pending Payment'
            />
          </Grid>
        </Grid>
      </Grid> */}
      <Grid item xs={12}>
        <Typography className='page-header'>Application</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          <TableHeader
            value={value}
            selectedRows={selectedRows}
            getStudentList={getStudentList}
            handleFilter={handleFilter}
            response={response.data}
            agentList={agentList}
          />
          {response && (
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
              checkboxSelection={fullPermission}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onSelectionModelChange={rows => setSelectedRows(rows)}
              selectionModel={selectedRows}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              onPageChange={newPage => setPageNumber(newPage + 1)}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentList
