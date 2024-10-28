/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/admittedStudent/list/TableHeader'
import { AcademicService, CommonService, DashboardService, StudentService } from 'src/service'
import {
  CreditAffordableDataStatus,
  applicationStatusColor,
  checkPaymentType,
  messages,
  status,
  studentApplicationAllStatus
} from 'src/context/common'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { getSelectedEnrollStudent, minTwoDigits, serialNumber } from 'src/utils'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { commonListTypes } from 'src/types/apps/dataTypes'
import IntakeCourseListDialog from 'src/views/pages/dialog/IntakeCourseListDialog'
import { ThemeColor } from 'src/@core/layouts/types'
import { IAllIntake, InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { errorToast, successToast } from 'src/components/Toast'
import VipTag from 'src/views/apps/VipTag/index'
import { TypographyEllipsis } from 'src/styles/style'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  'ENRL-ACCEPTED': 'primary',
  'APP-FEE-DOC-VER-PEND': 'warning',
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
    affordableRank: string
    creditRisk: string
  }
}

// ** Styled component for the link in the dataTable

const StudentList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [filterData, setFilterData] = useState<IDynamicObject>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [response, setResponse] = useState<any>(initialState)
  const [programList, setProgramList] = useState<commonListTypes[]>([])
  const [allIntake, setAllIntake] = useState<IAllIntake[]>([])
  const [studyModes, setStudyModes] = useState<commonListTypes[]>([])
  const [studentTypes, setStudentTypes] = useState<Array<commonListTypes>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.admittedStudent,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  const getStudentList = async () => {
    setLoading(true)
    const params = {
      search: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      ...filterData
    }
    const response = await DashboardService.getAdmittedStudentList(params)

    if (status.successCodeArr.includes(response?.statusCode) && response?.data) {
      setResponse(response?.data)
    } else {
      errorToast(messages.error)
    }
    setLoading(false)
  }

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  const getStudyModeData = async () => {
    const response = await CommonService.getStudyMode()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudyModes(response.data.data)
    }
  }

  const getAllIntake = async () => {
    const response = await AcademicService.getAllIntakeList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setAllIntake(response?.data?.data)
    }
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }

  useEffect(() => {
    getStudentList()
  }, [pageSize, pageNumber, value, filterData])

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const handleSort = (val: IDynamicObject) => {
    setFilterData(val)
  }
  const unenrollStudent = async () => {
    setLoading(true)
    const enrolledStudents = getSelectedEnrollStudent(selectedRows, response?.data) as Array<IDynamicObject>
    const unenrollStudentCodes: Array<string> = []
    const studentNames: Array<string> = []
    enrolledStudents?.map(item => {
      studentNames.push(`${item?.lead?.firstName} ${item?.lead?.lastName}`)
      unenrollStudentCodes.push(item?.lead?.studentCode)
    })

    const result = await StudentService.unenrollStudent(unenrollStudentCodes)
    if (status.successCodeArr.includes(result?.statusCode)) {
      getStudentList()
      successToast(messages.successUnenrollStudent)
    } else {
      errorToast(messages.error)
    }
    setSelectedRows([])
    setLoading(false)
  }
  useEffect(() => {
    getProgramList()
    getStudyModeData()
    getAllIntake()
    getStudentTypeData()
  }, [])

  const columns = [
    {
      field: 'id',
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {index?.row?.affordableRank ? CreditAffordableDataStatus[index?.row?.affordableRank] : '-'}
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {index?.row?.creditRisk ? CreditAffordableDataStatus[index?.row?.creditRisk] : '-'}
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Box>
            <Tooltip
              title={
                index?.row?.creditRisk === checkPaymentType.affordableValue ||
                index?.row?.creditRisk === checkPaymentType.creditRiskValue
                  ? customTitle
                  : ''
              }
            >
              <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      field: 'applicationCode',
      flex: 0.6,
      headerName: 'STUDENT ID',
      renderCell: ({ row }: CellType) => {
        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {row?.affordableRank ? CreditAffordableDataStatus[row?.affordableRank] : '-'}
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {row?.creditRisk ? CreditAffordableDataStatus[row?.creditRisk] : '-'}
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Box>
            <Tooltip
              title={
                row?.affordableRank === checkPaymentType.affordableValue ||
                row?.creditRisk === checkPaymentType.creditRiskValue
                  ? customTitle
                  : ''
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2'>{`${row?.lead?.studentCode}`}</Typography>
              </Box>
            </Tooltip>
          </Box>
        )
      }
    },

    {
      flex: 0.8,
      field: 'name',
      headerName: 'Student Name',
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName, email } = row?.lead

        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.affordableRank ? CreditAffordableDataStatus[row?.affordableRank] : '-'}</strong>
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.creditRisk ? CreditAffordableDataStatus[row?.creditRisk] : '-'}</strong>
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Box>
            <Tooltip
              title={
                row?.affordableRank === checkPaymentType.affordableValue ||
                row?.creditRisk === checkPaymentType.creditRiskValue
                  ? customTitle
                  : ''
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Grid container display='flex'>
                    <Grid item>
                      <Typography
                        noWrap
                        variant='body2'
                        sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                      >
                        {firstName ? `${firstName} ${lastName}` : '-'}
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
                    {email ? email : '-'}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      minWidth: 160,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }: CellType) => {
        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {row?.affordableRank ? CreditAffordableDataStatus[row?.affordableRank] : '-'}
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                {row?.creditRisk ? CreditAffordableDataStatus[row?.creditRisk] : '-'}
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Box>
            <Tooltip
              title={
                row?.affordableRank === checkPaymentType.affordableValue ||
                row?.creditRisk === checkPaymentType.creditRiskValue
                  ? customTitle
                  : ''
              }
            >
              <Typography variant='body2'>{`+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}`}</Typography>
            </Tooltip>
          </Box>
        )
      }
    },

    {
      field: 'ProgramName',
      flex: 1,
      headerName: 'Qualification Name',
      renderCell: ({ row }: CellType) => {
        const educationDetails = row?.education
        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.affordableRank ? CreditAffordableDataStatus[row?.affordableRank] : '-'}</strong>
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.creditRisk ? CreditAffordableDataStatus[row?.creditRisk] : '-'}</strong>
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Grid container>
            <Grid item xs={12}>
              <Tooltip
                title={
                  row?.affordableRank === checkPaymentType.affordableValue ||
                  row?.creditRisk === checkPaymentType.creditRiskValue
                    ? customTitle
                    : `${educationDetails?.programCode ?? '-'} - ${educationDetails?.programName ?? '-'}`
                }
              >
                <TypographyEllipsis variant='body2'>
                  {educationDetails?.programCode ?? '-'} - {educationDetails?.programName ?? '-'}
                </TypographyEllipsis>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <Tooltip title='Study Type'>
                  <Typography variant='caption'>{row?.education?.studyModeCode ?? '-'} | </Typography>
                </Tooltip>
                <Tooltip title='Student Type'>
                  <Typography variant='caption'>{row?.education?.studentTypeCode ?? '-'}</Typography>
                </Tooltip>
              </Typography>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 1,
      field: 'intakes',
      headerName: 'Intakes',
      renderCell: ({ row }: CellType) =>
        row?.enrolment?.intake?.code ? <IntakeCourseListDialog studentData={row} intakeList={allIntake} /> : '-'
    },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        const customTitle = (
          <Box padding={1} display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.affordableRank ? CreditAffordableDataStatus[row?.affordableRank] : '-'}</strong>
              </Typography>
            </Box>
            <Box paddingLeft={'20px'}>
              <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
              <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                <strong>{row?.creditRisk ? CreditAffordableDataStatus[row?.creditRisk] : '-'}</strong>
              </Typography>
            </Box>
          </Box>
        )

        return (
          <Tooltip
            title={
              row?.affordableRank === checkPaymentType.affordableValue ||
              row?.creditRisk === checkPaymentType.creditRiskValue
                ? customTitle
                : (studentApplicationAllStatus[row?.status] ?? row?.status)
            }
            placement='top'
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomChip
                skin='light'
                size='small'
                label={studentApplicationAllStatus[row?.status] ?? row?.status}
                color={userStatusObj[row?.status] ?? applicationStatusColor[row?.status]}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            </Box>
          </Tooltip>
        )
      }
    },
    {
      minWidth: 70,
      sortable: false,
      field: 'actions',

      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <Link href={`/admitted-student/preview/${row?.lead?.studentCode}/${row?.applicationCode}`} passHref>
                <IconButton size='small' component='a' color='primary' sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <EyeOutline />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
        </Box>
      )
    }
  ]
  const admittedStudentFilterFields = [
    {
      id: 0,
      name: 'studentCode',
      label: 'Student Id'
    },
    {
      id: 1,
      name: 'name',
      label: 'Name'
    },
    {
      id: 2,
      name: 'email',
      label: 'Email'
    },
    {
      id: 3,
      name: 'mobileNumber',
      label: 'Contact Number'
    },
    {
      id: 4,
      name: 'programCode',
      label: 'Select Qualification',
      list: programList
    },
    {
      id: 5,
      name: 'studentTypeCode',
      label: 'Student Type',
      list: studentTypes
    },
    {
      id: 6,
      name: 'studyModeCode',
      label: 'Study Mode',
      list: studyModes
    },
    {
      id: 7,
      name: 'intakeCode',
      label: 'Intakes',
      list: allIntake
    }
  ]
  const admittedStudentFilterDefaultValues = {
    studentCode: '',
    name: '',
    email: '',
    mobileNumber: '',
    programCode: '',
    studyTypeCode: '',
    studyModeCode: '',
    intakeCode: ''
  }

  const getRowClassName = (params: any) => {
    if (
      params?.row?.affordableRank === checkPaymentType.affordableValue ||
      params?.row?.creditRisk === checkPaymentType.creditRiskValue
    ) {
      return 'low-credit'
    } else {
      return ''
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography className='page-header'>Admitted Student</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card
          sx={{
            '& .low-credit': {
              background: '#feebec ',
              borderLeft: '4px solid red'
            },
            '& .low-credit:hover': {
              backgroundColor: '#feebec  !important'
            }
          }}
        >
          <TableHeader
            value={value}
            selectedRows={selectedRows}
            handleFilter={handleFilter}
            studentData={response?.data}
            handleSort={handleSort}
            filterFields={admittedStudentFilterFields}
            unenrollStudent={unenrollStudent}
            filterDefaultValues={admittedStudentFilterDefaultValues}
            setSearchValue={setValue}
            allIntake={allIntake}
            getStudentList={getStudentList}
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
              rows={!!response?.data?.length ? response.data : []}
              rowCount={response?.count}
              columns={columns}
              checkboxSelection={fullPermission}
              getRowClassName={getRowClassName}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onSelectionModelChange={rows => setSelectedRows(rows)}
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
