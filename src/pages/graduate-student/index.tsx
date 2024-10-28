import {
  Grid,
  Card,
  Button,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  FormControl,
  Tooltip
} from '@mui/material'
import { useState, useEffect } from 'react'

import TableHeaderStudentList from './TableHeaderGraduate'
import CustomChip from 'src/@core/components/mui/chip'
import { Controller, useForm } from 'react-hook-form'
import { AcademicService } from 'src/service'
import { DataGrid, GridRowId } from '@mui/x-data-grid'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import StudentManagementHook from 'src/views/pages/dialog/manageStudent/customHook'
import { IRecords, IRecordsType } from 'src/types/apps/dataTypes'
import { applicationStatusColor, studentApplicationAllStatus } from 'src/context/common'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

interface CellType {
  row: IRecords
}

const columns = [
  {
    flex: 0.1,
    minWidth: 50,
    field: 'id',
    headerName: 'S.No',
    renderCell: (index: any) => index.api.getRowIndex(index.row.id) + 1
  },
  {
    flex: 0.145,
    minWidth: 140,
    field: 'studentCode',
    headerName: 'Student ID',
    renderCell: ({ row }: CellType) => <Typography>{row?.lead?.studentCode ? row?.lead?.studentCode : '-'}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 240,
    field: 'studentName',
    headerName: 'Student Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2'>
              {row?.lead?.firstName ? `${row?.lead?.firstName} ${row?.lead?.lastName}` : '-'}
            </Typography>
            <Typography noWrap variant='caption'>
              {row?.lead?.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.17,
    minWidth: 150,
    field: 'contact',
    headerName: 'Contact',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>
        {row?.lead?.mobileNumber ? `${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}` : '-'}
      </Typography>
    )
  },
  {
    flex: 0.18,
    minWidth: 150,
    field: 'identificationNumber',
    headerName: 'National Id',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{row?.lead?.identificationNumber ? row?.lead?.identificationNumber : '-'}</Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 180,
    field: 'graduation_status',
    headerName: 'Qualification Status',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{row?.graduation_status ? row?.graduation_status : '-'}</Typography>
    )
  },
  {
    flex: 0.17,
    minWidth: 110,
    field: 'cum_laude',
    headerName: 'Cum Laude',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.cum_laude ? 'Yes' : 'No'}</Typography>
  },
  {
    flex: 0.17,
    minWidth: 180,
    field: 'total',
    headerName: 'Final Total %',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.total ? row?.total : '-'}</Typography>
  },
  {
    flex: 0.17,
    minWidth: 84,
    field: 'graduation_symbol',
    headerName: 'Symbol',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2'>{row?.graduation_symbol ? row?.graduation_symbol : '-'}</Typography>
    )
  },
  {
    flex: 0.17,
    minWidth: 210,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <Tooltip title={studentApplicationAllStatus[row.status] ?? row.status} placement='top'>
          <Box>
            <CustomChip
              skin='light'
              size='small'
              label={studentApplicationAllStatus[row.status] ?? row.status}
              color={applicationStatusColor[row.status] ?? applicationStatusColor[row.status]}
              sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
          </Box>
        </Tooltip>
      )
    }
  }
]

const GraduateStudent = () => {
  const {
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [records, setRecords] = useState<IRecordsType[]>([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const { programLists, academicyear } = StudentManagementHook()
  const programCode = watch('programName')
  const programYear = watch('academicYear')

  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.graduateStudent,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  const search = async () => {
    setLoading(true)

    const params = {
      programCode: programCode,
      academicYear: programYear,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
    const response = await AcademicService.getGraduationRecords(params)

    if (response && response?.length > 0) {
      setRecords(response)
    } else {
      setRecords([])
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  const onSubmit = () => {
    search()
  }

  return (
    <Grid item xs={12}>
      <Typography className='page-header'>Graduate Student</Typography>
      <Typography
        className='breadcrumb-section'
        sx={{
          '& .breadcrumb': {
            color: '#008554'
          }
        }}
      >
        <span className='breadcrumb'>Dashboard</span> / Graduate Students
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Grid md={12} container padding={7}>
            <Grid sm={12} columnGap={6} sx={{ display: 'flex' }}>
              <Grid item sm={4} lg={4} xl={3}>
                <FormControl fullWidth error={!!errors.academicYear}>
                  <Controller
                    name='academicYear'
                    control={control}
                    rules={{
                      required: 'Academic year is required'
                    }}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        {...field}
                        options={academicyear}
                        key={field.value}
                        onChange={(e, data) => field.onChange(data !== 0 ? data : '')}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Academic Year'
                            error={!!fieldState?.error}
                            helperText={fieldState?.error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid sm={8} lg={8} xl={8} item>
                <FormControl fullWidth error={!!errors.programName}>
                  <ControlledAutocomplete
                    name='programName'
                    control={control}
                    rules={{
                      required: 'Qualification Name is required'
                    }}
                    options={programLists}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Qualification Name'
                        error={!!errors?.programName}
                        helperText={errors?.programName?.message as string | undefined}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid sm={12} columnGap={3} sx={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
              <Grid>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setValue('academicYear', null)
                    setValue('programName', null)
                    setRecords([])
                  }}
                >
                  Clear Search
                </Button>
              </Grid>
              <Grid>
                <Button variant='contained' type='submit'>
                  Get List
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        {records && (
          <Card sx={{ marginTop: 5 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <TableHeaderStudentList
                  data={records}
                  selectedRows={selectedRows}
                  programName={watch('programName')}
                  academicYear={watch('academicYear')}
                />
                <DataGrid
                  loading={loading}
                  autoHeight
                  pagination
                  paginationMode='client'
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  rows={records as []}
                  columns={columns}
                  checkboxSelection={fullPermission}
                  disableSelectionOnClick
                  pageSize={Number(pageSize)}
                  rowsPerPageOptions={[10, 25, 50]}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: ' bold' }
                  }}
                  onSelectionModelChange={rows => setSelectedRows(rows)}
                  onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                  onPageChange={newPage => setPageNumber(newPage + 1)}
                />
              </Box>
            )}
          </Card>
        )}
      </form>
    </Grid>
  )
}
export default GraduateStudent
