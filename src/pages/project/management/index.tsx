// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { Box, Card, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/admission/list/TableHeader'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { ThemeColor } from 'src/@core/layouts/types'
import { ProjectStatusTypes, projectMessages, status } from 'src/context/common'
import { getFullName, getName, minTwoDigits, serialNumber } from 'src/utils'
import ProjectManagementAddDialog from 'src/views/pages/dialog/ProjectManagementAddDialog'
import { successToast } from 'src/components/Toast'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { AcademicService, CommonService, DashboardService } from 'src/service'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { FolderPlusOutline } from 'mdi-material-ui'
import CustomChip from 'src/@core/components/mui/chip'
import ProjectInformation from 'src/views/pages/dialog/ProjectInformation'

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
interface ICommonListStateType {
  programList: commonListTypes[]
  corporateList: commonListTypes[]
  courseTypeList: commonListTypes[]
  accountManagerList: commonListTypes[]
  projectManagerList: commonListTypes[]
}

interface IProjectStatusType {
  [key: string]: ThemeColor
}
const ProjectStatusObj: IProjectStatusType = {
  [ProjectStatusTypes.Active]: 'success',
  [ProjectStatusTypes.Inactive]: 'error'
}

const getProjectStatus = (status: boolean) => {
  return status ? ProjectStatusTypes.Active : ProjectStatusTypes.Inactive
}

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline'
  }
}))

// ** Styled component for the link in the dataTable

const ProjectManagement = () => {
  // ** State
  const [value, setQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [commonList, setCommonList] = useState<ICommonListStateType>({
    programList: [],
    corporateList: [],
    courseTypeList: [],
    accountManagerList: [],
    projectManagerList: []
  })
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<any>()
  const [projectDetailsOpen, setProjectDetailsOpen] = useState<boolean>(false)

  const handleCloseProjectDetails = () => {
    setProjectDetailsOpen(false)
  }

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
      headerName: 'Project Name',
      colSize: 6,
      renderCell: ({ row }: CellType) => (
        <Box>
          <StyledLink
            onClick={() => {
              setSelectedProjectDetails(row)
              setProjectDetailsOpen(true)
            }}
          >
            {row.name}
          </StyledLink>
        </Box>
      )
    },
    {
      flex: 0.25,
      field: 'code',
      minWidth: 150,
      headerName: 'Project Code',
      colSize: 6
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'corporateName',
      headerName: 'Corporate Name',
      colSize: 12,
      renderCell: ({ row }: CellType) => row?.corporateEd?.name
    },

    {
      flex: 0.1,
      minWidth: 200,
      field: 'projectManager',
      headerName: 'Project Manager',
      colSize: 6,
      renderCell: ({ row }: CellType) => getFullName(commonList.projectManagerList, row?.projectManager)
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'accountManager',
      headerName: 'Account Manager',
      colSize: 6,
      renderCell: ({ row }: CellType) => getFullName(commonList.accountManagerList, row?.accountManager)
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'program',
      headerName: 'Qualification Name',
      renderCell: ({ row }: CellType) => getName(commonList.programList, row?.program)
    },

    {
      flex: 0.1,
      minWidth: 200,
      field: 'courseType',
      headerName: 'Module Type',
      renderCell: ({ row }: CellType) => getName(commonList.courseTypeList, row?.courseType)
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'noOfStudent',
      headerName: 'No of Students',
      renderCell: ({ row }: CellType) => (row.noOfStudent ? row.noOfStudent : '-')
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <CustomChip
          skin='light'
          size='small'
          label={getProjectStatus(row?.isActive)}
          color={ProjectStatusObj[getProjectStatus(row?.isActive)]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Grid container gap={1}>
          <Grid item>
            <Tooltip title='Edit'>
              <Box>
                <ProjectManagementAddDialog
                  isEdit
                  projectData={row}
                  actions={{ updateProject }}
                  commonList={commonList}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Preview'>
              <Box>
                <Link href={`/project/preview/${row.code}`} passHref>
                  <IconButton
                    size='small'
                    color='primary'
                    sx={{ border: theme => `1px solid ${theme.palette.primary.main}` }}
                  >
                    <FolderPlusOutline />
                  </IconButton>
                </Link>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      )
    }
  ]

  const getProgramList = async () => {
    setLoading(true)
    const project = true
    const response = await AcademicService.getAllProgramList(project)
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCommonList(prev => ({ ...prev, programList: response?.data?.data }))
    }
    setLoading(false)
  }
  const getProjectList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getProjectList(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  const getProjectManagerList = async () => {
    const response = await DashboardService.getCorporateProjectManagerList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCommonList(prev => ({ ...prev, projectManagerList: response?.data?.data }))
    }
  }
  const getAccountManagerList = async () => {
    const response = await DashboardService.getCorporateAccountManagerList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCommonList(prev => ({ ...prev, accountManagerList: response?.data?.data }))
    }
  }
  const getCourseTypeList = async () => {
    const response = await CommonService.getCourseTypeList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCommonList(prev => ({ ...prev, courseTypeList: response?.data?.data }))
    }
  }
  const getCorporateList = async () => {
    const params = {
      pageSize: 100,
      pageNumber: 1
    }
    const response = await DashboardService?.getCorporateList(params)
    if (response?.status === 200 && response?.data?.data) {
      setCommonList(prev => ({ ...prev, corporateList: response?.data?.data?.data }))
    }
  }
  const createProject = async (params: any) => {
    const response = await DashboardService?.createProject({ ...params })
    if (response?.status === 201 && response?.data?.data) {
      getProjectList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber,
        status: ''
      })
      successToast(projectMessages.add)
    }
  }
  const updateProject = async (params: any, code: string) => {
    const response = await DashboardService?.updateProject({ ...params }, code)
    if (response?.status === status?.successCode && response?.data?.data) {
      getProjectList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber,
        status: ''
      })
      successToast(projectMessages.edit)
    }
  }

  useEffect(() => {
    getProjectList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
    })
  }, [pageSize, pageNumber, value])

  const handleFilter = (val: string) => {
    setQuery(val)
  }

  useEffect(() => {
    getProgramList()
    getProjectManagerList()
    getAccountManagerList()
    getCourseTypeList()
    getCorporateList()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
        >
          <Box>
            <Typography className='page-header'>Project Management</Typography>

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
              / Project Management List
            </Typography>
          </Box>
          <Box>
            <ProjectManagementAddDialog actions={{ createProject }} commonList={commonList} />
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
          <ProjectInformation
            projectDetailsOpen={projectDetailsOpen}
            handleCloseProjectDetails={handleCloseProjectDetails}
            project={selectedProjectDetails}
            commonList={commonList}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProjectManagement
