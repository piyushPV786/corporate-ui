// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import { Backdrop, Card, Grid, Typography } from '@mui/material'
import { DataGrid, GridRowId, GridRowParams } from '@mui/x-data-grid'

// ** Custom Components and Services
import { AcademicService, CommonService, StudentService, UserManagementService } from 'src/service'
import SSASearchForm from 'src/views/apps/ssa/SSASearchForm'
import TableHeader from 'src/views/apps/ssa/TableHeader'
import { ssaFilterFields, ssaColumns } from 'src/views/apps/ssa/ssaUtils'
import Link from 'next/link'

// ** Interfaces
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import {
  ISSACommonListTypes,
  ISsaApiResponseTypes,
  SsaStatus,
  ssaSuccessMessage
} from 'src/views/apps/ssa/sssConstants'

// ** Third Party Library
import { pickBy } from 'lodash'
import { messages, status } from 'src/context/common'
import { errorToast, successToast } from 'src/components/Toast'
import { getSelectedEnrollStudent } from 'src/utils'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'
import FallbackSpinner from 'src/@core/components/spinner'

export interface ISSAQueryParamTypes {
  academic?: string
  program?: string
  studentCode?: string
  name?: string
  email?: string
  mobileNumber?: string
  programCode?: string
  academicYear?: number
  studyTypeCode?: string
  studyModeCode?: string
  assigned?: string
  qualification?: string
  status?: string
}

const SSADashboard = () => {
  const [value, setValue] = useState('')
  const [studentList, setStudentList] = useState<ISsaApiResponseTypes>({ data: [], count: 0 })
  const [searchParams, setSearchParams] = useState<ISSAQueryParamTypes>()
  const [filterData, setFilterData] = useState<IDynamicObject>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [commonList, setCommonList] = useState<ISSACommonListTypes>({
    ssaList: [],
    qualificationStatusList: [],
    studyMode: [],
    studyType: [],
    programs: [],
    academicYear: []
  })

  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.assignStudentSupport,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  const academicRecordsFilterDefaultValues = {
    studentCode: '',
    firstName: '',
    email: '',
    mobileNumber: '',
    studentTypeCode: '',
    studyModeCode: '',
    SsaCode: '',
    status: '',
    SsaStatus: ''
  }

  const getStudentList = async () => {
    setLoading(true)
    if (!!filterData?.mobileNumber) {
      filterData.mobileNumber = filterData.mobileNumber
        ?.split(' ')
        ?.filter((item: string) => item.trim().indexOf('+'))
        ?.join()
    }
    const query = {
      ...searchParams,
      search: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      ...filterData
    }
    const response = await StudentService.getSSAStudentList(query)
    if (Array.isArray(response?.data?.data)) {
      setStudentList(response?.data)
    } else {
      setStudentList({ data: [], count: 0 })
    }
    setLoading(false)
  }

  const getCommonList = async () => {
    const [studyMode, studyType, year, programs, ssaList, qualificationStatusList] = await Promise.all([
      CommonService.getStudyMode(),
      CommonService.getStudentType(),
      CommonService.getYear(),
      AcademicService.getAllProgramList(),
      UserManagementService.getAgents('Operation'),
      CommonService.getStudentStatus()
    ])

    const updateSsaList =
      ssaList &&
      ssaList?.length > 0 &&
      ssaList?.map((data: any) => {
        data['name'] = `${data?.firstName}${data?.lastName}`

        return data
      })

    setCommonList(prev => ({
      ...prev,
      studyMode: Array.isArray(studyMode?.data?.data) ? studyMode?.data?.data : [],
      studyType: Array.isArray(studyType?.data?.data) ? studyType?.data?.data : [],
      academicYear: Array.isArray(year?.data?.data) ? year?.data?.data : [],
      programs: Array.isArray(programs?.data?.data) ? programs?.data?.data : [],
      ssaList: Array.isArray(updateSsaList) ? updateSsaList : [],
      qualificationStatusList: Array.isArray(qualificationStatusList?.data?.data)
        ? qualificationStatusList?.data?.data
        : []
    }))
  }
  const handleSearchQuery = (query: ISSAQueryParamTypes | undefined) => {
    setSearchParams(query)
  }
  const assignSSA = async (SsaCode: string) => {
    const selectedRowsObject: IDynamicObject[] = getSelectedEnrollStudent(selectedRows, studentList?.data)
    const payload = {
      applicationCode: selectedRowsObject.map(item => item.applicationCode),
      SsaCode: SsaCode
    }
    const response = await StudentService.assignSSA(payload)
    if (status.successCodeArr.includes(response?.statusCode)) {
      successToast(ssaSuccessMessage.assignedSuccessfully)
      setSelectedRows([])
    } else {
      errorToast(messages.error)
    }
    getStudentList()
  }

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const handleSort = (val: IDynamicObject) => {
    setFilterData(pickBy(val))
  }
  useEffect(() => {
    getCommonList()
  }, [])
  useEffect(() => {
    searchParams ? getStudentList() : setStudentList({ data: [], count: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, pageSize, pageNumber, value, searchParams])

  return (
    <Fragment>
      <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <FallbackSpinner />
      </Backdrop>
      <Grid container>
        <Grid item xs={12}>
          <Typography className='page-header'>Student Support Administrative Dashboard</Typography>
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
            / SSA Query List
          </Typography>{' '}
        </Grid>

        <Grid item xs={12}>
          <Card>
            <SSASearchForm commonList={commonList} handleSearchQuery={handleSearchQuery} />
          </Card>
        </Grid>
        {!!searchParams ? (
          <Grid item xs={12} marginTop={5}>
            <Card>
              <TableHeader
                value={value}
                handleFilter={handleFilter}
                studentData={studentList?.data ?? []}
                handleSort={handleSort}
                filterFields={ssaFilterFields(commonList)}
                assignSSA={assignSSA}
                filterDefaultValues={academicRecordsFilterDefaultValues}
                selectedRows={selectedRows}
                commonList={commonList}
                setSearchValue={setValue}
              />
              <DataGrid
                loading={false}
                autoHeight
                pagination
                paginationMode='server'
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                rows={studentList?.data ?? []}
                rowCount={studentList?.count}
                columns={ssaColumns(pageSize, pageNumber, commonList)}
                disableSelectionOnClick
                pageSize={Number(pageSize)}
                rowsPerPageOptions={[10, 25, 50]}
                checkboxSelection={fullPermission}
                selectionModel={selectedRows}
                onSelectionModelChange={rows => setSelectedRows(rows)}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                onPageChange={newPage => setPageNumber(newPage + 1)}
                isRowSelectable={(params: GridRowParams) => params?.row?.SsaStatus !== SsaStatus.Assigned}
              />
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Fragment>
  )
}

export default SSADashboard
