// ** React Imports
import { useState, useMemo } from 'react'

// ** MUI Imports
import { Box, Grid, Card, styled, Tooltip, Backdrop, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRowParams, GridSelectionModel } from '@mui/x-data-grid'

// ** Custom Components Imports
import { ICorporateGroupAPITypes } from 'src/context/types'

//API Services
import { DashboardService } from 'src/service'
import { getSelectedEnrollStudent, serialNumber } from 'src/utils'
import StudentManagementHook from 'src/views/pages/dialog/manageStudent/customHook'
import FallbackSpinner from 'src/@core/components/spinner'
import {
  applicationStatusColor,
  status,
  messages,
  EnrollIntakeType,
  enrollGroupStatusTypesColor,
  enrollGroupStatusTypes,
  IEnrollCorporateState
} from 'src/context/common'
import Link from 'next/link'
import Chip from 'src/@core/components/mui/chip'
import { errorToast, successToast } from 'src/components/Toast'
import {
  IEnrollCorporateGroupTypes,
  IEnrollCorporateGroupTypesPayload,
  IStudentManagementfilter
} from 'src/types/apps/invoiceTypes'
import SideFilterBar from 'src/pages/students-management/sideFilter'
import { TypographyEllipsis } from 'src/styles/style'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'
import TableHeaderCorporateStudentManagement from './TableHeaderCorporateStudentManagement'
import EnrollAndUnenrollCorporateStudentList from 'src/views/apps/corporateStudentManagement'
import CorporateStudentListPopup from 'src/views/pages/dialog/CorporateStudentListPopup'

interface CellType {
  row: ICorporateGroupAPITypes
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

const CorporateStudentManagement = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)
  const [response, setResponse] = useState<any>({ data: [], count: 0 })
  const [selectedRow, setSelectedRow] = useState<GridSelectionModel>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [value, setValue] = useState<string>('')
  const [openFilterSidebar, setOpenFilterSidebar] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [studentData, setStudentData] = useState<any>()
  const [selectedCorporateGroup, setSelectedCorporateGroup] = useState<any>()
  const [studentListOpen, setStudentListOpen] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(false)
  const [filterData, setFilterData] = useState<IStudentManagementfilter>({
    groupCode: '',
    groupName: '',
    programName: '',
    academicYear: '',
    intakeName: '',
    status: ''
  })
  const [EnrolledStudent, setEnrolledStudent] = useState<IEnrollCorporateState>({
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

  const { programLists, intakeLists, academicyear } = StudentManagementHook()

  const handleCloseConfirmationPopup = () => {
    setStudentListOpen(false)
    setSelectedCorporateGroup(null)
    setStudentData(null)
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
    const response = await DashboardService.getCorporateStudentGroupList(params, filterData)
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
    if (selectedCorporateGroup) {
      setLoader(true)
      const response = await DashboardService.getCorporateStudentListByGroup(selectedCorporateGroup?.id, params)
      setStudentData(response?.data?.data)
      setLoader(false)
    }
  }

  const handleStudentCountClick = (group: any) => {
    setStudentListOpen(true)
    setSelectedCorporateGroup(group)
    getStudentList({ pageNumber: 1, pageSize: 10 })
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
    const enrollGroups = getSelectedEnrollStudent(selectedRow, response?.data)

    const enrollCorporateGroups: Array<IEnrollCorporateGroupTypes> = enrollGroups.map(group => ({
      groupCode: group.code
    }))
    const payload: IEnrollCorporateGroupTypesPayload = { corporateGroups: enrollCorporateGroups }

    const result = await DashboardService.enrollCorporateStudent(payload)

    if (result?.status === status.successCode) {
      setEnrolledStudent(prev => ({ ...prev, show: true, response: result?.data?.data }))
    } else {
      errorToast(messages.error)
    }

    getStudentGroupList()
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
                {row?.name || '-'}
              </Typography>
            </Tooltip>
            <Tooltip title='Group Code'>
              <Typography variant='caption'>{row?.code}</Typography>
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
              <Tooltip title={`${row?.intake?.program?.code || '_'} - ${row?.intake?.program?.name || '_'}`}>
                <TypographyEllipsis variant='body2'>
                  {row?.intake?.program?.code || '_'} - {row?.intake?.program?.name}
                </TypographyEllipsis>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title='Academic Year'>
                <Typography variant='caption'> {row?.intake?.academicYearOfStudy}</Typography>
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
        <Tooltip title={row?.intake?.name ?? '-'} placement='top'>
          <TypographyEllipsis sx={{ height: 'auto', textWrap: 'wrap' }} variant='body2'>
            {row?.intake?.name ?? '-'}
          </TypographyEllipsis>
        </Tooltip>
      )
    },
    {
      flex: 1,
      field: 'projectName',
      headerName: 'Project Name / Code',
      renderCell: ({ row }: CellType) => {
        const { project } = row

        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography noWrap variant='body1'>
                {project?.name ? project.name : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography noWrap variant='caption'>
                {project?.code ? project.code : '-'}
              </Typography>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 0.5,
      field: 'studentCount',
      headerName: 'No. of Students',
      renderCell: ({ row }: CellType) => (
        <Box>
          <StyledLink
            onClick={() => {
              handleStudentCountClick(row)
            }}
          >
            {row?.enrolment?.length ?? '-'}
          </StyledLink>
        </Box>
      )
    },
    {
      flex: 1.25,
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
            Corporate Student Management
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
            / Corporate Student Management List
          </Typography>
        </Grid>
        <EnrollAndUnenrollCorporateStudentList EnrolledStudent={EnrolledStudent} handleClose={handleClose} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CorporateStudentListPopup
            conformationOpen={studentListOpen}
            handleCloseConfirmationPopup={handleCloseConfirmationPopup}
            selectedCorporateGroup={selectedCorporateGroup}
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
          <TableHeaderCorporateStudentManagement
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

export default CorporateStudentManagement
