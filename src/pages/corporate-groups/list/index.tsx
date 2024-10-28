/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/admission/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { AcademicService, DashboardService, StudentService } from 'src/service'
import { messages, status } from 'src/context/common'
import { useRouter } from 'next/router'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { PencilOutline } from 'mdi-material-ui'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { checkResponseIfSuccess, minTwoDigits, serialNumber } from 'src/utils'
import { errorToast, successToast } from 'src/components/Toast'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { Autocomplete } from '@mui/material'
import { TypographyEllipsis } from 'src/styles/style'
import RequiredLabel from 'src/components/RequiredLabel'

interface CellType {
  row: InvoiceType
}
const initialState = {
  statusCode: 1,
  message: '',
  data: []
}

export interface IFormValues {
  id: number
  name: string
  code: string
  companyTypeCode: string
  email: string
  phoneNumber: string
  address1: string
  address2: string
  country: string
  state: string
  pincode: string
}

interface DataParams {
  q: string
  status: string
  pageSize: number
  pageNumber: number
}
interface IRowActionType {
  actionType: 'Edit' | 'Add'
  show: boolean
  data?: InvoiceType | null
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline'
  }
}))

const defaultValues = {
  name: '',
  code: '',
  projectsId: '',
  intake: ''
}

const schema = yup.object().shape({
  name: yup.string().required('Group name is required'),
  code: yup
    .string()
    .matches(/^[\w@.-]*$/, `Code must be without space; you can use dash (-) instead`)
    .required('Group code is required'),
  projectsId: yup
    .object()
    .nullable()
    .required('Project is required')
    .shape({
      id: yup.number().required('Project ID is required'),
      name: yup.string().required('Project name is required')
    }),
  intake: yup
    .object()
    .nullable()
    .required('Intake is required')
    .shape({
      id: yup.number().required('Intake ID is required'),
      name: yup.string().required('Intake name is required')
    })
})

const StudentList = () => {
  // ** State
  const [value, setQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [response, setResponse] = useState<any>(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<IRowActionType>({ show: false, data: null, actionType: 'Add' })
  const [conformationOpen, setConformationOpen] = useState<boolean>(false)
  const [allProjects, setProjectAll] = useState<Array<commonListTypes>>([])
  const [allIntake, setAllIntake] = useState<Array<commonListTypes>>([])

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm<any>({
    defaultValues: defaultValues,
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  })

  const formValue = watch()
  const router = useRouter()
  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 30,
      maxWidth: 40,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 250,
      headerName: 'Group Name',
      renderCell: ({ row }: any) => (
        <Box>
          <StyledLink
            onClick={() => {
              setConformationOpen(!conformationOpen)
              setSelectedRows(row)
            }}
          >
            {row.name}
          </StyledLink>
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'code',
      minWidth: 90,
      headerName: 'Group Code'
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'project',
      headerName: 'Project Id',
      renderCell: ({ row }: any) => {
        return <Box>{row?.project?.name}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 280,
      field: 'intake',
      headerName: 'Intake Name',
      renderCell: ({ row }: any) => {
        return (
          <Box>
            <Tooltip title={row?.intake?.name}>
              <TypographyEllipsis>{row?.intake?.name}</TypographyEllipsis>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'studentCout',
      headerName: 'No of Students',
      renderCell: ({ row }: any) => {
        return <Box>{row?.studentCout ? row?.studentCout : '-'}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <Box>
              <IconButton
                onClick={() => handleRowClick(row)}
                size='small'
                component='a'
                color='primary'
                sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
              >
                <PencilOutline />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleRowClick = async (row: any) => {
    await getIntakeProgramLists(row?.project?.program, row?.project?.studyMode)
    reset({
      name: row?.name,
      code: row?.code,
      projectsId: allProjects?.find(item => item?.code === row?.project?.code),
      intake: allIntake?.find(item => item?.code === row?.intake?.code)
    })
    setOpenEdit({ show: true, actionType: 'Edit', data: row })
  }

  const getCorporateList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getCorporateGroupList(params)
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const getProjectList = async () => {
    const response = await StudentService.getProjectAll()
    if (response?.statusCode === status.successCode && !!response?.data) {
      setProjectAll(response?.data)
    }
  }

  useEffect(() => {
    getProjectList()
  }, [])
  useEffect(() => {
    getCorporateList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: ''
    })
  }, [pageSize, pageNumber, value])
  const handleModalOpenClose = () => {
    setOpenEdit(prevState => ({ ...prevState, show: !prevState?.show }))
    reset(defaultValues)
  }

  const handleFilter = (val: string) => {
    setQuery(val)
  }

  const getIntakeProgramLists = async (programCode: string, studyModeCode: string) => {
    const intakeProgramLists = checkResponseIfSuccess(
      await AcademicService.getIntakeProgramLists(programCode, studyModeCode)
    )
    setAllIntake(intakeProgramLists)
  }

  useMemo(() => {
    formValue?.projectsId && getIntakeProgramLists(formValue?.projectsId?.program, formValue?.projectsId?.studyMode)
  }, [formValue?.projectsId])

  const { show, actionType } = { ...openEdit }

  const onSubmit = async (data: any) => {
    const payload = {
      name: data?.name,
      code: data?.code,
      intakeCode: data?.intake?.code,
      projectCode: data?.projectsId?.code
    }

    let res
    if (openEdit?.actionType === 'Add') {
      res = await DashboardService?.addCorporateGroup(payload)
    } else {
      res = await DashboardService?.updateCorporateGroup(openEdit?.data?.id, payload)
    }
    if (res?.data?.statusCode === status?.successCodeOne || res?.data?.statusCode === status?.successCode) {
      getCorporateList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber,
        status: ''
      })

      successToast(
        `${payload.name} ${openEdit?.actionType === 'Add' ? messages.corporateAdded : messages.corporateEdited}`
      )
      handleModalOpenClose()
    } else {
      errorToast(messages.error)
    }
    setOpenEdit(prevState => ({ ...prevState, show: false, data: null, actionType: 'Add' }))
    reset({}, { keepValues: true })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Corporate Group Management</Typography>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <DynamicBreadcrumb asPath={router.asPath} />
          <Button
            sx={{ mr: 2 }}
            variant='contained'
            size='small'
            onClick={() => {
              reset()
              setOpenEdit(prevState => ({ ...prevState, show: !prevState?.show, data: null, actionType: 'Add' }))
            }}
          >
            Add Corporate Group
          </Button>
        </Grid>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
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
            onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>

        <Dialog fullWidth maxWidth='md' open={show}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ justifyContent: 'center', textAlign: 'center' }}>
              <Typography variant='h4'>{actionType} Corporate Group</Typography>
            </DialogTitle>

            <DialogContent>
              <Grid container mt={2} spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    {...register('name')}
                    fullWidth
                    onChange={(e: any) => {
                      setValue(e.target.name, e.target.value)
                    }}
                    label={<RequiredLabel label='Group Name' />}
                    defaultValue={formValue?.name}
                    helperText={errors?.name?.message as string | undefined}
                    error={errors.name as any}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name='code'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled={openEdit?.actionType !== 'Add'}
                        fullWidth
                        label={<RequiredLabel label='Group Code' />}
                        error={!!errors.code}
                        helperText={errors?.code?.message as string | undefined}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name='projectsId'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={allProjects ?? []}
                        getOptionLabel={option => (option ? `${option?.name}-(${option?.code})` : '')}
                        onChange={(event, data) => {
                          field.onChange(data) // Set the selected project object
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<RequiredLabel label='Projects' />}
                            error={!!errors?.projectsId}
                            helperText={errors?.projectsId?.message as string | undefined}
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name='intake'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={allIntake ?? []}
                        getOptionLabel={option => (option ? option?.name : '')}
                        onChange={(event, data) => {
                          field.onChange(data) // Set the selected intake object
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<RequiredLabel label='Intake' />}
                            error={!!errors?.intake}
                            helperText={errors?.intake?.message as string | undefined}
                            fullWidth
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', marginTop: 3 }}>
              <Button variant='outlined' color='secondary' onClick={handleModalOpenClose}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' sx={{ mr: 1 }}>
                {openEdit?.actionType !== 'Add' ? 'Save' : 'Add Corporate Group'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default StudentList
