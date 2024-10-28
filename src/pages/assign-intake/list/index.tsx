import { Card, Grid, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { successToast } from 'src/components/Toast'
import { AddStudentMessages, callFunctionOn, status } from 'src/context/common'
import { AcademicService, CommonService, DashboardService } from 'src/service'
import {
  IAllIntake,
  ICommonData,
  IIntakeData,
  IIntakeLists,
  IProgramList,
  IUpComingIntake,
  intakePrams,
  searchFilter
} from 'src/types/apps/invoiceTypes'
import { checkResponseIfSuccess } from 'src/utils'
import AssignChangeIntakeModal from 'src/views/apps/assignIntake/AssignChangeIntakeModal'
import { columns } from 'src/views/apps/assignIntake/list'
import TableHeader from 'src/views/apps/assignIntake/list/TableHeader'
import FilterSideBar from 'src/views/apps/assignIntake/list/filterSidebar'

const StudentLists = () => {
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<IIntakeData>()
  const [showAssignChangeDialogue, setShowAssignChangeDialogue] = useState<boolean>(false)
  const [openFilterSidebar, setOpenFilterSidebar] = useState<boolean>(false)
  const [intakeLists, setIntakeLists] = useState<IIntakeLists>({ count: 0, data: [] })
  const [allIntake, setAllIntake] = useState<IAllIntake[]>([])
  const [commonData, setCommonData] = useState<ICommonData>({
    interestedPrograms: null,
    academicYears: null,
    studyType: null,
    studyMode: null,
    intakeList: null
  })
  const [programList, setProgramList] = useState<IProgramList[]>([])

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  const getAllIntake = async () => {
    const response = await AcademicService.getAllIntakeList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setAllIntake(response?.data?.data)
    }
  }

  const [filterData, setFilterData] = useState<searchFilter>({
    name: '',
    contact: '',
    email: '',
    studentId: '',
    academicYear: '',
    intakeName: '',
    interestedProgram: '',
    status: '',
    studentType: '',
    studyMode: ''
  })

  const [intakeProgramLists, setIntakeProgramLists] = useState<IUpComingIntake[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const getIntakeLists = async () => {
    setLoading(true)
    const params: intakePrams = {
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      reqFrom: AddStudentMessages.reqFromAssignIntake
    }
    const filterParams: searchFilter = filterData
    const intakeLists = checkResponseIfSuccess(await DashboardService.getIntakeList(params, filterParams))
    setIntakeLists(intakeLists)
    setLoading(false)
  }

  const getIntakeProgramLists = async (programCode: string, studyModeCode: string) => {
    const intakeProgramLists = checkResponseIfSuccess(
      await AcademicService.getIntakeProgramLists(programCode, studyModeCode)
    )
    setIntakeProgramLists(intakeProgramLists)
  }

  const getCommonData = async () => {
    const academicYears = checkResponseIfSuccess(await CommonService.getYear())
    const studyType = checkResponseIfSuccess(await CommonService.getStudentType())
    const studyMode = checkResponseIfSuccess(await CommonService.getStudyMode())
    const intakeList = checkResponseIfSuccess(await AcademicService.getAllIntakeList())

    setCommonData({ ...commonData, academicYears, studyType, studyMode, intakeList })
  }

  useEffect(() => {
    getIntakeLists()

    getAllIntake()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageNumber, value, filterData])

  useEffect(() => {
    if (!intakeLists) {
      getIntakeLists()
    }
    getCommonData()
    getProgramList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedRows?.education) {
      const education = selectedRows?.education
      education && getIntakeProgramLists(education?.programCode, education?.studyModeCode)
    }
  }, [selectedRows])

  const setOpenDialogue = (row?: IIntakeData) => {
    setSelectedRows(row)
    setShowAssignChangeDialogue(!showAssignChangeDialogue)
  }

  const handleSidebarClose = () => {
    setOpenFilterSidebar(!openFilterSidebar)
  }

  const assignIntake = async (intakeDetail: any) => {
    setShowAssignChangeDialogue(false)
    setLoading(true)
    const params = {
      intakeCode: intakeDetail?.code,
      intakeAcademicYear: intakeDetail?.academicYearOfStudy
    }
    const result = await DashboardService.assignIntake(params, selectedRows?.applicationCode)
    getIntakeLists()
    if (result?.status === status?.successCode && selectedRows?.intakeCode) {
      successToast(AddStudentMessages?.intakeSaveMessage)
    } else if (result?.status === status?.successCode) {
      successToast(`Intake Assign to ${selectedRows?.lead?.firstName} ${selectedRows?.lead?.lastName} Successfully`)
    }
  }

  const searchFilter = async (payload: searchFilter, calledBy: string) => {
    setFilterData(payload)
    calledBy === callFunctionOn?.onSubmit && setOpenFilterSidebar(false)
  }

  const clearFilter = () => {
    setFilterData({
      name: '',
      contact: '',
      email: '',
      studentId: '',
      academicYear: '',
      intakeName: '',
      interestedProgram: '',
      status: '',
      studentType: '',
      studyMode: ''
    })
    successToast(`Filters Cleared Successfully.`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {selectedRows && (
          <AssignChangeIntakeModal
            showAssignChangeDialogue={showAssignChangeDialogue}
            setShowAssignChangeDialogue={setOpenDialogue}
            selectedRows={selectedRows}
            intakeProgramLists={intakeProgramLists}
            assignIntake={assignIntake}
            programList={programList}
          />
        )}
        <Typography className='page-header'>Assign Intake</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          <FilterSideBar
            programList={programList}
            openFilterSidebar={openFilterSidebar}
            handleSidebarClose={handleSidebarClose}
            commonData={commonData}
            searchFilter={searchFilter}
            setSearchValue={setValue}
            filterData={filterData}
          />
          <TableHeader
            value={value}
            handleFilter={val => setValue(val)}
            openFilterSideBar={() => setOpenFilterSidebar(!openFilterSidebar)}
            filterData={filterData}
            clearFilter={clearFilter}
            commonData={commonData}
            programList={programList}
          />

          <DataGrid
            loading={loading}
            autoHeight
            pagination
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={intakeLists?.data?.length > 0 ? intakeLists?.data : []}
            rowCount={+intakeLists?.count}
            columns={columns(setOpenDialogue, programList, allIntake, pageNumber, pageSize)}
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

export default StudentLists
