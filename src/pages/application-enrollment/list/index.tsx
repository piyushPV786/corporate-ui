/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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
import { useRouter } from 'next/router'
import { styled } from '@mui/material'

// ** Custom Components Imports
//import { DateType } from 'src/types/forms/reactDatepickerTypes'
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/enrolment/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { AcademicService, CommonService, DashboardService, UserManagementService } from 'src/service'
import {
  applicationStatusColor,
  status,
  studentApplicationAllStatus,
  studentApplicationSubStatus
} from 'src/context/common'
import { getName, minTwoDigits, serialNumber } from 'src/utils'
import { commonListTypes } from 'src/types/apps/dataTypes'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { IAgentsType } from 'src/context/types'
import VipTag from 'src/views/apps/VipTag'
import { TypographyEllipsis } from 'src/styles/style'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  'ENRL-ACCEPTED': 'primary',
  pending: 'warning',
  sales: 'info',
  finance: 'error'
}

interface CellType {
  row: InvoiceType
}

interface IResponseTypes {
  count: number
  data: InvoiceType[]
}

const initialState = {
  count: 0,
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
const AcademicTypography = styled(Typography)(() => ({
  color: 'inherit',
  textTransform: 'uppercase',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  display: 'block',
  fontSize: 'smaller',
  fontWeight: '600'
}))

// ** Styled component for the link in the dataTable

const EnrolmentList = () => {
  // ** State
  //   const clipboard = useClipboard()
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [agentList, setAgentList] = useState<Array<IAgentsType>>([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [response, setResponse] = useState<IResponseTypes>(initialState)
  const [programData, setProgramData] = useState<Array<commonListTypes>>([])
  const [studentTypes, setStudentTypes] = useState<Array<commonListTypes>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])

  const router = useRouter()

  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.applicationEnrollment,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  const getEnrolmentList = async () => {
    setLoading(true)
    const params = {
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
    }
    const response = await DashboardService?.getEnrolmentList(params)
    if (response?.data?.statusCode === status?.successCode && response?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.data?.statusCode === status?.successCode && !!response?.data?.data?.length) {
      setProgramData(response?.data?.data)
    }
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }

  const getAgentData = async () => {
    const response = await UserManagementService.getAgents('Sales')

    if (!!response?.length) {
      setAgentList(response)
    }
  }
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
  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
    }
  }

  useEffect(() => {
    getEnrolmentList()
    getProgramList()
    getIdentificationType()
  }, [pageSize, pageNumber, value])
  useEffect(() => {
    getStudentTypeData()
    getAgentData()
  }, [])

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
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },
    {
      flex: 0.3,
      minWidth: 120,
      field: 'Enrolment',
      headerName: 'Student NO',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{row?.lead?.studentCode ? `${row?.lead?.studentCode}` : '-'}</Typography>
          <Tooltip title='Application No'>
            <Typography variant='caption'>{`${row.applicationCode}`}</Typography>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0.5,
      minWidth: 250,
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
                    <Tooltip title={row?.lead?.student?.VIPType} placement='top'>
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
              <Tooltip title='Student email'>
                <Typography variant='caption'>{row?.lead?.email}</Typography>
              </Tooltip>
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

            <Tooltip title={row?.agent?.email}>
              <Grid item>
                <Typography noWrap variant='caption'>
                  {row?.agent?.email ?? '-'}
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
      minWidth: 190,
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
          <Grid item xs={12}>
            <Tooltip
              title={
                <Box key={row?.education?.programCode}>
                  {row?.education?.programCode} - {getName(programData, row?.education?.programCode)}
                </Box>
              }
            >
              <TypographyEllipsis variant='body2'>
                {row?.education?.programCode} - {getName(programData, row?.education?.programCode)}
              </TypographyEllipsis>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Tooltip title='Student Type'>
              <Typography variant='caption'>{getName(studentTypes, row?.education?.studentTypeCode)}</Typography>
            </Tooltip>
          </Grid>
        </Grid>
      )
    },
    {
      flex: 0.6,
      minWidth: 230,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={
              !!row?.subStatus
                ? `${studentApplicationAllStatus[row.status]}-${studentApplicationSubStatus[row?.subStatus] ?? row?.subStatus}`
                : studentApplicationAllStatus[row.status]
            }
            placement='top'
          >
            <Box>
              <CustomChip
                skin='light'
                size='small'
                label={studentApplicationAllStatus[row.status] ?? row.status}
                color={userStatusObj[row.status] ?? applicationStatusColor[row.status]}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      minWidth: 60,
      maxWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <Link href={`/application-enrollment/preview/${row.applicationCode}`} passHref>
                <IconButton size='small' color='primary' component='a' sx={{ textDecoration: 'none' }}>
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
        <Typography className='page-header'>Application Enrollment</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          {!!response && (
            <Fragment>
              <TableHeader
                value={value}
                response={response.data}
                agentList={agentList}
                getEnrolmentList={getEnrolmentList}
                selectedRows={selectedRows}
                handleFilter={handleFilter}
              />
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
            </Fragment>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default EnrolmentList
