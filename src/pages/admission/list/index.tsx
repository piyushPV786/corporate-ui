/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, SetStateAction, useMemo } from 'react'

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
import { IAllIntake } from 'src/types/apps/invoiceTypes'

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/admission/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import { AcademicService, CommonService, DashboardService } from 'src/service'
import { admissionStatus, applicationStatusColor, status, studentApplicationAllStatus } from 'src/context/common'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { getName, minTwoDigits, serialNumber } from 'src/utils'
import { useRouter } from 'next/router'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import VipTag from 'src/views/apps/VipTag/index'
import { TypographyEllipsis } from 'src/styles/style'
import { IprogramDataTypes } from 'src/context/types'
import Filter from 'src/components/Filter'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { styled } from '@mui/material'

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  'ENRL-ACCEPTED': 'primary',
  'APP-FEE-DOC-VER-PEND': 'warning',
  sales: 'info',
  'APP-FEE-ACCEPTED': 'error'
}

interface CellType {
  row: any
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

const StudentList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [response, setResponse] = useState<any>(initialState)
  const [studentTypes, setStudentTypes] = useState<Array<commonListTypes>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [programData, setProgramData] = useState<Array<IprogramDataTypes>>([])
  const [filterData, setFilterData] = useState<IDynamicObject>()
  const [allIntake, setAllIntake] = useState<IAllIntake[]>([])
  const [studyModes, setStudyModes] = useState<commonListTypes[]>([])
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])

  const router = useRouter()
  const getStudentList = async () => {
    setLoading(true)
    const params = {
      search: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      ...filterData,
      status:
        filterData?.status && filterData?.subStatus
          ? `${filterData?.status}-${filterData?.subStatus}`
          : filterData?.status || filterData?.subStatus,
      subStatus: filterData?.status && filterData?.subStatus ? '' : filterData?.subStatus
    }
    const response = await DashboardService?.getAdmissionList(params)
    if (response?.data?.statusCode === status.successCode && response?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.data?.statusCode === status?.successCode && !!response?.data?.data?.length) {
      setProgramData(response?.data?.data)
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
  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
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

  useEffect(() => {
    getProgramList()
    getStudyModeData()
    getAllIntake()
    getIdentificationType()
  }, [])

  useMemo(() => {
    getStudentList()
    getStudentTypeData()
    getProgramList()
  }, [pageSize, pageNumber, value])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleSort = (val: IDynamicObject) => {
    setFilterData(val)
  }
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
      list: programData
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
    },
    {
      id: 6,
      name: 'status',
      label: 'Status',
      list: admissionStatus
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
    intakeCode: '',
    status: '',
    studentTypeCode: ''
  }

  const columns = [
    {
      field: 'id',
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      },
      type: 'string'
    },
    {
      flex: 0.5,
      minWidth: 120,
      field: 'studentCode',
      headerName: 'Student NO',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{row?.lead?.studentCode}</Typography>
          <Tooltip title='Application ID'>
            <Typography variant='caption'>{`${row?.applicationCode}`}</Typography>
          </Tooltip>
        </Box>
      ),
      type: 'string'
    },
    {
      flex: 1,
      minWidth: 200,
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
              <Tooltip title='Student Email'>
                <Typography noWrap variant='caption'>
                  {row?.lead?.email ?? '-'}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      },
      type: 'string'
    },
    {
      flex: 1,
      minWidth: 200,
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
                  : '-'}
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
      },
      type: 'string'
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
      },
      type: 'string'
    },
    {
      flex: 0.5,
      minWidth: 180,
      field: 'studyModeCode',
      headerName: 'Study Mode',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{getName(studyModes, row?.education?.studyModeCode)}</Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 180,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {row?.lead?.mobileCountryCode ? `+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}` : '-'}
        </Typography>
      ),
      type: 'string'
    },
    {
      flex: 0.5,
      minWidth: 150,
      field: 'studentType',
      headerName: 'Student Type',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{getName(studentTypes, row?.education?.studentTypeCode)}</Typography>
      ),
      type: 'string'
    },
    {
      flex: 1,
      minWidth: 310,
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
        </Grid>
      ),
      type: 'string'
    },
    {
      flex: 1,
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
              sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
          </Box>
        </Tooltip>
      ),
      type: 'string'
    },
    {
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <Link href={`/admission/preview/${row.applicationCode}`} passHref>
                <IconButton size='small' component='a' color='primary' sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <EyeOutline />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
        </Box>
      ),
      type: 'string'
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography className='page-header'>Admission</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          <Grid container display='flex' justifyContent='space-between'>
            <Grid item xs={6}>
              <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='flex-end'>
              <Box sx={{ p: 5 }}>
                <Filter
                  studentData={response?.data}
                  handleSort={handleSort}
                  fields={admittedStudentFilterFields}
                  filterDefaultValues={admittedStudentFilterDefaultValues}
                  setSearchValue={setValue}
                  allIntake={allIntake}
                  getStudentList={getStudentList}
                />
              </Box>
            </Grid>
          </Grid>
          <DataGrid
            loading={loading}
            autoHeight
            pagination
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={response.data}
            rowCount={response?.count}
            columns={columns}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onSelectionModelChange={(rows: SetStateAction<GridRowId[]>) => setSelectedRows(rows)}
            onPageSizeChange={(newPageSize: SetStateAction<number>) => setPageSize(newPageSize)}
            onPageChange={(newPage: number) => setPageNumber(newPage + 1)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentList
