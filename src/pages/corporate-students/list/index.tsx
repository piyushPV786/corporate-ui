// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import { Box, Card, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/corporateStudents/list/TableHeader'
import { AcademicService, DashboardService } from 'src/service'
import { admissionStatus, applicationStatusColor, status, studentApplicationAllStatus } from 'src/context/common'
import { DataParams } from 'src/service/Dashboard'
import {
  ICorporateStudent,
  ICorporateStudentListType,
  IDynamicObject,
  IFilterOptionsTypes
} from 'src/types/apps/corporatTypes'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { corporateConstant, filterOptionDefaultValues } from 'src/context/corporateData'

// ** Icon Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import CustomTooltip from 'src/components/CustomToolTip'

interface CellType {
  row: ICorporateStudent
}
const userStatusObj: { [key: string]: ThemeColor } = {
  [corporateConstant.Enrolled]: 'warning',
  [corporateConstant.REJECT]: 'error',
  [corporateConstant.reviewPending]: 'warning',
  [corporateConstant['PROG-ADMITTED']]: 'primary'
}

const CorporateStudents = () => {
  const router = useRouter()

  // ** State
  const [corporateStudentList, setCorporateStudentList] = useState<ICorporateStudentListType>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [filterOptions, setFilterOptions] = useState<IFilterOptionsTypes>(filterOptionDefaultValues)
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [filterData, setFilterData] = useState<IDynamicObject>()

  const getCorporateStudentsList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getCorporateStudentsList(params)
    if (response?.statusCode === status.successCode) {
      setCorporateStudentList(response?.data)
    }
    setLoading(false)
  }
  const getFilterOptions = async () => {
    const [projects, programs] = await Promise.all([
      DashboardService?.getProjectList({ pageSize: 100, pageNumber: 1 }),
      AcademicService.getAllProgramList(true)
    ])
    setFilterOptions({
      programs: programs?.data.data || [],
      projects: projects?.data?.data?.data || [],
      status: admissionStatus
    })
  }

  useEffect(() => {
    getFilterOptions()
  }, [])
  useEffect(() => {
    getCorporateStudentsList({
      ...filterData,
      search: value,
      pageSize: pageSize,
      pageNumber: pageNumber
    })
  }, [pageSize, pageNumber, value, filterData])

  const handleFilter = (val: string) => {
    setValue(val)
  }
  const handleSort = (val: IDynamicObject) => {
    setFilterData(val)
  }

  const columns: GridColumns<ICorporateStudent> = [
    {
      field: 'id',
      headerName: '#',
      maxWidth: 50,
      renderCell: params => {
        const serialNum = params.api.getRowIndexRelativeToVisibleRows(params.row.id)

        return pageNumber === 1 ? serialNum + 1 : (pageNumber - 1) * pageSize + (serialNum + 1)
      }
    },
    {
      flex: 0.6,
      minWidth: 100,
      field: 'studentCode',
      headerName: 'Student NO',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.lead?.studentCode ?? '-'}</Typography>
    },
    {
      flex: 0.8,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        const { lead } = row

        return <Typography variant='body2'>{`${lead?.firstName} ${lead?.lastName}`}</Typography>
      }
    },
    {
      flex: 1,
      field: 'email',
      headerName: 'Email & Contact Details',
      renderCell: ({ row }: CellType) => {
        const { email, mobileNumber } = row.lead || {}

        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography noWrap variant='body1'>
                {email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography noWrap variant='caption'>
                {mobileNumber}
              </Typography>
            </Grid>
          </Grid>
        )
      }
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
      flex: 1,
      minWidth: 200,
      field: 'groups',
      headerName: 'Group Details',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title='Group Name'>
              <Typography
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.enrolment?.corporateGroup?.name || '-'}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    },

    {
      flex: 1,
      field: 'course',
      headerName: 'Module or Qualification Name / Type',
      renderCell: ({ row }: CellType) => {
        const { project } = row

        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography noWrap variant='body1'>
                {project?.program ? project?.program : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography noWrap variant='caption'>
                {project?.courseType ? project?.courseType : '-'}
              </Typography>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 1.75,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => (
        <CustomTooltip
          color='error'
          title={
            row.status === status.reject ? (
              <Fragment>
                <Typography color='error' variant='subtitle1'>
                  <b>Reject Reason</b>
                </Typography>
                <Typography color='error' variant='caption'>
                  {row.comments}
                </Typography>
              </Fragment>
            ) : (
              ''
            )
          }
          placement='top'
          arrow
        >
          <Typography>
            <CustomChip
              skin='light'
              size='small'
              label={
                !!corporateConstant[row.status]
                  ? corporateConstant[row.status]
                  : !!studentApplicationAllStatus[row.status]
                    ? studentApplicationAllStatus[row.status]
                    : row.status
              }
              color={userStatusObj[corporateConstant[row.status]] ?? applicationStatusColor[row.status]}
              sx={{ textTransform: 'capitalize' }}
            />
          </Typography>
        </CustomTooltip>
      )
    },
    {
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Tooltip title='View'>
            <Link href={`${corporateConstant.preview}/${row.applicationCode}`} passHref>
              <IconButton color='primary'>
                <EyeOutline />
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography className='page-header'>Corporate Students</Typography>
        <DynamicBreadcrumb asPath={router.asPath} />
        <Card>
          <Fragment>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              studentData={!!corporateStudentList?.data ? corporateStudentList?.data : []}
              handleSort={handleSort}
              filterOptions={filterOptions}
              setSearchValue={setValue}
            />
            <DataGrid
              loading={loading}
              autoHeight
              pagination
              paginationMode='server'
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              rows={!!corporateStudentList?.data ? corporateStudentList?.data : []}
              rowCount={!!corporateStudentList?.count ? corporateStudentList?.count : undefined}
              columns={columns}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              onPageChange={newPage => setPageNumber(newPage + 1)}
              getRowId={row => row.id}
            />
          </Fragment>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CorporateStudents
