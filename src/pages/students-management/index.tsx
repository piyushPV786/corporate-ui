// ** React Imports
import { useState, useMemo } from 'react'

// ** MUI Imports
import { Box, Grid, Card, styled, Tooltip, Backdrop, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRowParams, GridSelectionModel } from '@mui/x-data-grid'

// ** Custom Components Imports
import { Enrolment, IGroupAPITypes } from 'src/context/types'

//API Services
import { DashboardService } from 'src/service'
import { getSelectedEnrollStudent, serialNumber } from 'src/utils'
import StudentManagementDialogue from 'src/views/pages/dialog/manageStudent'
import StudentManagementHook from 'src/views/pages/dialog/manageStudent/customHook'
import FallbackSpinner from 'src/@core/components/spinner'
import StudentListPopup from 'src/views/pages/dialog/StudentListPopup'
import {
  applicationStatusColor,
  status,
  messages,
  EnrollIntakeType,
  enrollGroupStatusTypesColor,
  enrollGroupStatusTypes,
  IEnrollState
} from 'src/context/common'
import Link from 'next/link'
import TableHeaderStudentManagement from './TableHeaderStudentManagement'
import Chip from 'src/@core/components/mui/chip'
import { errorToast, successToast } from 'src/components/Toast'
import { IEnrolGroupTypes, IStudentManagementfilter } from 'src/types/apps/invoiceTypes'
import SideFilterBar from 'src/pages/students-management/sideFilter'
import { TypographyEllipsis } from 'src/styles/style'
import { FullPermission, ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'
import EnrollAndUnenrollStudentList from 'src/views/apps/studentManagement'

interface CellType {
  row: IGroupAPITypes
}

interface DataParams {
  q: string
  pageSize: number
  pageNumber: number
}

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline'
  }
}))

const StudentManagement = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)
  const [response, setResponse] = useState<any>({ data: [], count: 0 })
  const [studentData, setStudentData] = useState<any>()
  const [selectedRow, setSelectedRow] = useState<GridSelectionModel>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [value, setValue] = useState<string>('')
  const [openFilterSidebar, setOpenFilterSidebar] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [conformationOpen, setConformationOpen] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(false)
  const [filterData, setFilterData] = useState<IStudentManagementfilter>({
    groupCode: '',
    groupName: '',
    programName: '',
    academicYear: '',
    intakeName: '',
    status: ''
  })
  const [EnrolledStudent, setEnrolledStudent] = useState<IEnrollState>({
    show: false,
    response: {
      count: { total: 0, enrolled: 0, notEnrolled: 0 },
      enrolled: [],
      notEnrolled: []
    }
  })
  const [loading, setLoading] = useState<boolean>(false)
  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.studentManagement,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  const { programLists, intakeLists, academicyear, groups } = StudentManagementHook()
  const handleCloseConfirmationPopup = () => {
    setConformationOpen(!conformationOpen)
  }

  const handleFilter = (val: string) => {
    setValue(val)
    if (pageNumber > 1) {
      setPageNumber(1)
    }
  }

  const getStudentGroupList = async () => {
    setIsLoading(true)
    const params: DataParams = {
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber
    }
    const response = await DashboardService.getStudentGroupList(params, filterData)
    if (response?.data?.data && response?.data?.data?.data?.length > 0) {
      const data = await response?.data?.data?.data?.map((item: CellType, index: number) => ({
        itemNumber: serialNumber(index, pageNumber, pageSize),
        ...item
      }))
      setResponse({ data: data, count: response?.data?.data?.count })
    } else {
      setResponse({ data: [], count: 0 })
    }
    setIsLoading(false)
  }

  const getStudentList = async (params: any) => {
    setLoader(true)
    const response = await DashboardService.getStudentListbyintake(params)
    setStudentData(response?.data?.data)
    setLoader(false)
  }

  useMemo(() => {
    getStudentGroupList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber, value, filterData])
  const handleClose = () => {
    setEnrolledStudent(prev => ({ ...prev, show: false }))
  }
  const editEnrollStudent = async () => {
    setLoading(true)

    const enrolledStudents = getSelectedEnrollStudent(selectedRow, response?.data)

    const enrolGroups: Array<IEnrolGroupTypes> = []
    const groupName: Array<string | null> = []
    enrolledStudents?.map(item => {
      groupName.push(item?.group?.name)
      enrolGroups.push({
        intakeCode: item?.intakeCode,
        groupCode: item?.groupCode,
        studentCodes: item?.enrolment?.map((student: Enrolment) => student?.studentCode)
      })
    })

    const result = await DashboardService.editEnrollStudent(enrolGroups)
    if (result?.status === status.successCode) {
      setEnrolledStudent(prev => ({ ...prev, show: true, response: result?.data?.data }))
    } else {
      errorToast(messages.error)
    }

    setTimeout(() => {
      getStudentGroupList()
    }, 5000)
    setSelectedRow([])
    setLoading(false)
  }

  const handleSidebarClose = () => {
    setOpenFilterSidebar(!openFilterSidebar)
  }

  const enrollIntake = () => {
    editEnrollStudent()
  }

  const columns = [
    {
      field: 'id',
      maxWidth: 70,
      headerName: 'S.No',
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{`${row?.itemNumber?.toString().padStart(2, '0')}`}</Typography>
      }
    },
    {
      flex: 1,
      field: 'name',
      headerName: 'Group Details',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title='Group Name'>
              <Typography
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.group?.name || '-'}
              </Typography>
            </Tooltip>
            <Tooltip title='Group Code'>
              <Typography variant='caption'>{row?.groupCode}</Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    },

    {
      flex: 1,
      field: 'programName',
      headerName: 'Qualification Details',
      renderCell: ({ row }: CellType) => {
        return (
          <Grid container>
            <Grid item xs={12}>
              <Tooltip title={`${row?.programCode || '_'} - ${row?.program?.name || '_'}`}>
                <TypographyEllipsis variant='body2'>
                  {row?.programCode || '_'} - {row?.program?.name}
                </TypographyEllipsis>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title='Academic Year'>
                <Typography variant='caption'> {row?.academicYear}</Typography>
              </Tooltip>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 1,
      field: 'intakes',
      headerName: 'Intakes',
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={row?.intake?.length > 0 ? row?.intake?.map(intake => intake?.name)?.join(',') : '-'}
          placement='top'
        >
          <TypographyEllipsis sx={{ height: 'auto', textWrap: 'wrap' }} variant='body2'>
            {row?.intake?.length > 0 ? row?.intake?.map(intake => intake?.name)?.join(',') : '-'}
          </TypographyEllipsis>
        </Tooltip>
      )
    },

    {
      flex: 0.5,
      field: 'studentCount',
      headerName: 'No. of Students',
      renderCell: ({ row }: CellType) => (
        <Box>
          <StyledLink
            onClick={() => {
              setConformationOpen(!conformationOpen)
              setSelectedRows(row)
              getStudentList({ pageNumber: 1, pageSize: 10, q: '', intakeCode: row?.intakeCode })
            }}
          >
            {row?.studentCount}
          </StyledLink>
        </Box>
      )
    },
    {
      flex: 1,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <Tooltip title={enrollGroupStatusTypes[row?.status] ?? row?.status} placement='top'>
          <Box>
            <Chip
              skin='light'
              label={enrollGroupStatusTypes[row?.status] ?? row?.status}
              size='small'
              color={enrollGroupStatusTypesColor[row?.status] ?? applicationStatusColor[row?.status] ?? 'secondary'}
            />
          </Box>
        </Tooltip>
      )
    }
  ]

  if (fullPermission) {
    columns.push({
      flex: 0.5,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex' }}>
          {
            <StudentManagementDialogue
              programLists={programLists}
              years={academicyear}
              groups={groups}
              edit={true}
              individualStudentData={row}
              getStudentGroupList={getStudentGroupList}
            />
          }
        </Box>
      )
    })
  }

  const searchFilter = async (payload: IStudentManagementfilter) => {
    setFilterData(payload)
    setOpenFilterSidebar(false)
  }

  const clearFilter = () => {
    setFilterData({
      groupCode: '',
      groupName: '',
      programName: '',
      academicYear: '',
      intakeName: '',
      status: ''
    })
    successToast(`Filters Cleared Successfully.`)
  }

  return (
    <Grid container>
      <Grid container className='title-section' sx={{ my: '.5rem' }} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
        <Grid item xs={6}>
          <Typography className='page-header' gutterBottom>
            Student Management
          </Typography>

          <Typography
            className='breadcrumb-section'
            sx={{
              '& .breadcrumb': {
                color: theme => theme.palette.primary.main,
                cursor: 'pointer'
              }
            }}
          >
            <Link href='/enrolment'>
              <span className='breadcrumb'>Dashboard</span>
            </Link>{' '}
            / Student Management List
          </Typography>
        </Grid>
        <EnrollAndUnenrollStudentList EnrolledStudent={EnrolledStudent} handleClose={handleClose} />
        <FullPermission featureCode={FeatureCodes.EMS.studentManagement}>
          <Grid item xs={6}>
            <Box display='flex' justifyContent='flex-end'>
              <StudentManagementDialogue
                programLists={programLists}
                years={academicyear}
                groups={groups}
                edit={false}
                getStudentGroupList={getStudentGroupList}
              />
            </Box>
          </Grid>
        </FullPermission>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <StudentListPopup
            conformationOpen={conformationOpen}
            handleCloseConfirmationPopup={handleCloseConfirmationPopup}
            selectedRows={selectedRows}
            response={studentData}
            getStudentList={getStudentList}
            loader={loader}
            value={value}
          />
          <SideFilterBar
            programList={programLists}
            intakeLists={intakeLists}
            years={academicyear}
            getStudentGroupList={getStudentGroupList}
            openFilterSidebar={openFilterSidebar}
            handleSidebarClose={handleSidebarClose}
            searchFilter={searchFilter}
            setSearchValue={setValue}
          />
          <TableHeaderStudentManagement
            value={value}
            intakeLists={intakeLists}
            handleFilter={handleFilter}
            openFilterSideBar={() => setOpenFilterSidebar(!openFilterSidebar)}
            filterData={filterData}
            selectedRow={selectedRow}
            clearFilter={clearFilter}
            enrollIntake={enrollIntake}
          />
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='primary' />
          </Backdrop>
          {response ? (
            <DataGrid
              loading={isLoading}
              autoHeight
              pagination
              paginationMode='server'
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              rows={response?.data}
              columns={columns}
              rowCount={response?.count}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection={fullPermission}
              onSelectionModelChange={newRowSelectionModel => setSelectedRow(newRowSelectionModel)}
              selectionModel={selectedRow}
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: ' bold' }
              }}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              onPageChange={newPage => setPageNumber(newPage + 1)}
              isRowSelectable={(params: GridRowParams) => params?.row?.status !== EnrollIntakeType.enrolled || true}
            />
          ) : (
            <FallbackSpinner />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentManagement
