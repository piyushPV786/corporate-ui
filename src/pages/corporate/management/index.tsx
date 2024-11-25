/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

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
import { ICorporateDataTypes, InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/admission/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { CommonService, DashboardService } from 'src/service'
import { ProjectStatusTypes, messages, status } from 'src/context/common'
import { useRouter } from 'next/router'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { PencilOutline } from 'mdi-material-ui'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import CorporateInformation from 'src/views/pages/dialog/CorporateInformation'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Autocomplete,
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Stack,
  Switch
} from '@mui/material'
import {
  addressDetails,
  getName,
  getStateList,
  getStateNameWithCountryCode,
  minTwoDigits,
  serialNumber
} from 'src/utils'
import { errorToast, successToast } from 'src/components/Toast'
import { ThemeColor } from 'src/@core/layouts/types'
import Chip from 'src/@core/components/mui/chip'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { AxiosResponse } from 'axios'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { IAddressStateTypes } from 'src/types/apps/admittedStudent'
import RequiredLabel from 'src/components/RequiredLabel'
import AlertBox from 'src/layouts/components/Alert'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import Filter from 'src/components/Filter'
import { IDynamicObject } from 'src/types/apps/corporatTypes'

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

const defaultValues = {
  email: '',
  name: '',
  code: '',
  companyType: '',
  phoneNumber: '',
  country: '',
  state: '',
  city: '',
  address1: '',
  pincode: '',
  address2: '',
  physicalCountry: '',
  physicalState: '',
  physicalCity: '',
  physicalAddress1: '',
  physicalAddress2: '',
  physicalPincode: '',
  isActive: false,
  isSameAddress: false
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('required')
    .matches(/^[A-Za-z0-9]+([ ]?[A-Za-z0-9]+)*$/, 'Name can only contain alphanumeric characters')
    .test('not-only-numbers', 'Name cannot contain only numbers', (value: string | undefined) => {
      return value ? /[a-zA-Z]/.test(value) : false
    }),
  code: yup
    .string()
    .matches(/^[\w@.-]*$/, `Special characters are not allowed in the Company Code`)
    .required('required'),
  email: yup.string().email('Please enter a valid email address').nullable().notRequired(),
  mobileCountryCode: yup.string().notRequired(),
  phoneNumber: yup.string().when('mobileCountryCode', {
    is: (mobileCountryCode: string) => mobileCountryCode !== '',
    then: yup
      .string()
      .test('phoneNumber-validation', 'Mobile number must be a minimum of 6 digits', (value: any, context: any) => {
        const { mobileCountryCode } = context.parent

        if (value && value.trim() === mobileCountryCode.trim()) {
          return true
        }

        return value && value.trim().length >= 6
      }),
    otherwise: yup.string().notRequired()
  }),
  companyType: yup.string().required('required'),
  country: yup.string().required('required'),
  state: yup.string().required('required'),
  city: yup.string().required('reuired'),
  address1: yup.string().required('required'),
  pincode: yup.string().required('required').min(5).max(6),
  physicalCountry: yup.string().required('required'),
  physicalState: yup.string().required('required'),
  physicalCity: yup.string().required('required'),
  physicalAddress1: yup.string().required('required'),
  physicalPincode: yup.string().required('required').min(5).max(6)
})

const StudentList = () => {
  // ** State
  const [value, setQuery] = useState<string>('')
  const [filterData, setFilterData] = useState<IDynamicObject>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [response, setResponse] = useState<any>(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<IRowActionType>({ show: false, data: null, actionType: 'Add' })
  const [conformationOpen, setConformationOpen] = useState<boolean>(false)
  const [corporateFormData, setCorporateFormData] = useState(defaultValues)
  const [companyTypes, setCompanyTypes] = useState<Array<commonListTypes>>()
  const [country, setCountry] = useState<Array<commonListTypes>>([])
  const [states, setStates] = useState<IAddressStateTypes[] | []>([])
  const [postalStates, setPostalStates] = useState<IAddressStateTypes[] | []>([])
  const [allStates, setAllStates] = useState<IAddressStateTypes[] | []>([])
  const [filterCountry, setFilterCountry] = useState<string>('')
  const [loadingForm, setLoadingForm] = useState<boolean>(false)

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<any>({
    defaultValues: corporateFormData,
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  })
  const countryWatch = watch('country')
  const physicalCountryWatch = watch('physicalCountry')

  const getCountryLists = async () => {
    const response = await CommonService.getCountryLists()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setCountry(response.data.data)
    }
  }

  const getAllStateList = async () => {
    const response = await CommonService.getStatesByCountry()
    if (response?.statusCode === status.successCode && response?.data?.length) {
      setAllStates(response.data)
    }
  }

  const fetchStates = async (
    countryCode: string,
    setStates: React.Dispatch<React.SetStateAction<IAddressStateTypes[]>>
  ) => {
    setLoadingForm(true)
    if (countryCode) {
      const fetchedStates = await getStateList(countryCode)
      const FormattedData = fetchedStates.map((region: any) => {
        region['code'] = region['isoCode'] || region['code']
        delete region['isoCode']

        return region
      })
      setStates(FormattedData)
    } else {
      setStates([])
    }
    setLoadingForm(false)
  }

  useEffect(() => {
    if (countryWatch) {
      fetchStates(countryWatch, setStates)
    }
  }, [countryWatch])

  useEffect(() => {
    if (filterCountry) {
      fetchStates(filterCountry, setStates)
    }
  }, [filterCountry])

  useEffect(() => {
    if (physicalCountryWatch) {
      fetchStates(physicalCountryWatch, setPostalStates)
    }
  }, [physicalCountryWatch])

  const checkDuplicateCorporateCode = async (code: string, id?: number) => {
    const response = await DashboardService?.checkDuplicateCorporateCode(code, id)
    response?.message && setError('code', { type: 'custom', message: response?.message })

    return response?.message
  }

  const statusList = [
    {
      name: ProjectStatusTypes.Active,
      code: 'true'
    },
    {
      name: ProjectStatusTypes.Inactive,
      code: 'false'
    }
  ]

  const filterFields = [
    {
      id: 0,
      name: 'name',
      label: 'Company Name'
    },
    {
      id: 1,
      name: 'code',
      label: 'Code'
    },
    {
      id: 2,
      name: 'companyType',
      label: 'Company Type',
      list: companyTypes
    },
    {
      id: 3,
      name: 'country',
      label: 'Country',
      list: country as any
    },
    {
      id: 4,
      name: 'state',
      label: 'State / Province',
      list: states as any
    },
    {
      id: 5,
      name: 'pincode',
      label: 'Pincode'
    },
    {
      id: 6,
      name: 'isActive',
      label: 'Status',
      list: statusList
    }
  ]

  const defaultFilterFields = {
    name: '',
    code: '',
    companyType: '',
    country: '',
    state: '',
    pincode: '',
    projectCount: '',
    studentCount: '',
    status: ''
  }

  const handleSort = (val: IDynamicObject) => {
    setFilterData(val)
  }
  const formValue = watch()
  const router = useRouter()
  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 60,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 250,
      headerName: 'Company Name',
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
      flex: 0.25,
      field: 'code',
      minWidth: 150,
      headerName: 'code'
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'companyType',
      headerName: 'Company Type',
      renderCell: ({ row }: any) => {
        return <Box>{getName(companyTypes, row?.companyType)}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'country',
      headerName: 'Country',
      renderCell: ({ row }: any) => {
        const addressCountry = addressDetails(row?.corporateAddress, 'country')

        return <Box>{addressCountry && addressCountry !== '-' ? getName(country, addressCountry) : '-'}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'state',
      headerName: 'Province/ State',
      renderCell: ({ row }: any) => {
        const addressState = addressDetails(row?.corporateAddress, 'state')
        const addressCountry = addressDetails(row?.corporateAddress, 'country')
        return (
          <Box>
            {addressState && addressState !== '-'
              ? getStateNameWithCountryCode(allStates, addressState, addressCountry)
              : '-'}{' '}
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'pincode',
      headerName: 'Pin or Zip Code',
      renderCell: ({ row }: any) => {
        return <Box>{addressDetails(row?.corporateAddress, 'pincode')}</Box>
      }
    },

    {
      flex: 0.1,
      minWidth: 200,
      field: 'projectCount',
      headerName: 'No of Projects',
      renderCell: ({ row }: any) => {
        return <Box>{row?.projectCount ? row?.projectCount : '-'}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'studentCount',
      headerName: 'No of Students',
      renderCell: ({ row }: any) => {
        return <Box>{row?.studentCount ? row?.studentCount : '-'}</Box>
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            skin='light'
            size='small'
            label={getProjectStatus(row?.isActive)}
            color={ProjectStatusObj[getProjectStatus(row?.isActive)]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
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
  const handleRowClick = (row: any) => {
    setOpenEdit({ show: true, actionType: 'Edit', data: row })
    setFormData(row)
  }
  const setFormData = (data: ICorporateDataTypes) => {
    const residential = data?.corporateAddress?.find(item => item.addressType === 'RESIDENTIAL') ?? defaultValues
    const postal = data?.corporateAddress?.find(item => item.addressType === 'POSTAL') ?? defaultValues
    const rowValues = {
      email: data.email,
      name: data.name,
      code: data.code,
      companyType: data.companyType,
      phoneNumber: data.phoneNumber,
      country: residential.country,
      state: residential.state,
      city: residential.city,
      address1: residential.address1,
      pincode: residential.pincode,
      address2: residential.address2,
      physicalCountry: postal.country,
      physicalState: postal.state,
      physicalCity: postal.city,
      physicalAddress1: postal.address1,
      physicalAddress2: postal.address2,
      physicalPincode: postal.pincode,
      isActive: data.isActive,
      isSameAddress: data.isSameAddress
    }
    setCorporateFormData(rowValues)
    reset(rowValues)
  }

  const getCorporateList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getCorporateList(params)
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const getCompanyTypeList = async () => {
    const response = await CommonService.companyType()
    if (response?.statusCode === status.successCode && !!response?.data) {
      setCompanyTypes(response?.data)
    }
  }

  useEffect(() => {
    register('isActive')
    getCompanyTypeList()
    getCountryLists()
    getAllStateList()
  }, [])
  useEffect(() => {
    getCorporateList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: '',
      ...filterData
    })
  }, [pageSize, pageNumber, value, filterData])
  const handleModalOpenClose = () => {
    setOpenEdit(prevState => ({ ...prevState, show: !prevState?.show }))
    reset(defaultValues)
  }

  const handleFilter = (val: string) => {
    setQuery(val)
  }

  const handleCloseConfirmationPopup = () => {
    setConformationOpen(!conformationOpen)
  }
  const { show, actionType } = { ...openEdit }

  const onSubmit = async (data: any) => {
    setLoadingForm(true)
    reset({}, { keepValues: true })
    const duplicateName =
      actionType === 'Add'
        ? await checkDuplicateCorporateCode(data?.code)
        : await checkDuplicateCorporateCode(data?.code, openEdit?.data?.id)

    if (duplicateName === undefined) {
      const { name, code, companyType, email, mobileCountryCode, phoneNumber, isSameAddress, isActive } = data

      let res: AxiosResponse | undefined
      const {
        address1 = '',
        address2 = '',
        country = '',
        state = '',
        city = '',
        pincode = '',
        ...postalAddress
      } = { ...data }

      const postalAddr = {
        address1: postalAddress?.physicalAddress1,
        address2: postalAddress?.physicalAddress2,
        country: postalAddress?.physicalCountry,
        state: postalAddress?.physicalState,
        city: postalAddress?.physicalCity,
        pincode: postalAddress?.physicalPincode,
        addressType: 'POSTAL'
      }
      const address = [
        { address1, address2, country, state, city, pincode, addressType: 'RESIDENTIAL' },
        {
          ...postalAddr,
          addressType: 'POSTAL'
        }
      ]

      const payload = { name, code, companyType, email, phoneNumber, isSameAddress, isActive, address }

      if (openEdit?.actionType === 'Add') {
        const isNotValidPhoneNumber = phoneNumber === mobileCountryCode
        if (isNotValidPhoneNumber) {
          delete payload.phoneNumber
        }
        res = await DashboardService?.addCorporate(payload)
      } else {
        res = await DashboardService?.updateCorporate(code, payload)
      }
      if (res?.data?.statusCode === status?.successCodeOne || res?.data?.statusCode === status?.successCode) {
        getCorporateList({
          q: value,
          pageSize: pageSize,
          pageNumber: pageNumber,
          status: ''
        })
        setOpenEdit(prevState => ({ ...prevState, show: false, data: null, actionType: 'Add' }))
        successToast(`${openEdit?.actionType === 'Add' ? messages.corporateAdded : messages.corporateEdited}`)
      } else {
        errorToast(messages.error)
        setError('code', { type: 'custom', message: response?.message })
      }
    }
    setLoadingForm(false)
  }

  const countryCodeContact = (data: any, dialCode: string) => {
    data && setValue(`mobileCountryCode`, dialCode)
  }

  const handlePhysicalAddress = (event: any) => {
    setLoadingForm(true)
    const isSameAddress = event.target.checked

    if (isSameAddress) {
      const currentCountry = watch('country')
      const currentState = watch('state')
      const currentCity = watch('city')

      setValue('physicalCountry', currentCountry, { shouldDirty: true, shouldValidate: true })
      setValue('physicalState', currentState, { shouldDirty: true, shouldValidate: true })
      setValue('physicalCity', currentCity, { shouldDirty: true, shouldValidate: true })
      setValue('physicalAddress1', watch('address1'), { shouldDirty: true, shouldValidate: true })
      setValue('physicalAddress2', watch('address2'), { shouldDirty: true, shouldValidate: true })
      setValue('physicalPincode', watch('pincode'), { shouldDirty: true, shouldValidate: true })
    }

    setValue('isSameAddress', isSameAddress)
    setLoadingForm(false)
  }

  const isChange = () => {
    return (
      watch('name') !== corporateFormData?.name ||
      watch('companyType') !== corporateFormData?.companyType ||
      watch('email') !== corporateFormData?.email ||
      watch('phoneNumber') !== corporateFormData?.phoneNumber ||
      watch('address1') !== corporateFormData?.address1 ||
      watch('address2') !== corporateFormData?.address2 ||
      watch('country') !== corporateFormData?.country ||
      watch('state') !== corporateFormData?.state ||
      watch('city') !== corporateFormData?.city ||
      watch('pincode') !== corporateFormData?.pincode ||
      watch('physicalAddress1') !== corporateFormData?.physicalAddress1 ||
      watch('physicalAddress2') !== corporateFormData?.physicalAddress2 ||
      watch('physicalCountry') !== corporateFormData?.physicalCountry ||
      watch('physicalState') !== corporateFormData?.physicalState ||
      watch('physicalCity') !== corporateFormData?.physicalCity ||
      watch('physicalPincode') !== corporateFormData?.physicalPincode ||
      watch('isActive') !== corporateFormData?.isActive
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Corporate Management</Typography>
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
            Add Corporate
          </Button>
        </Grid>
        <Card>
          <CorporateInformation
            conformationOpen={conformationOpen}
            handleCloseConfirmationPopup={handleCloseConfirmationPopup}
            selectedRows={selectedRows}
            countryList={country}
            statesList={allStates}
          />
          <Grid container display='flex' justifyContent='space-between'>
            <Grid item xs={6}>
              <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='flex-end'>
              <Box sx={{ p: 5 }}>
                <Filter
                  studentData={response?.data}
                  handleSort={handleSort}
                  fields={filterFields}
                  filterDefaultValues={defaultFilterFields}
                  setSearchValue={setQuery}
                  setFilterCountry={setFilterCountry}
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
            onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>

        <Dialog
          maxWidth='md'
          open={show}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleCloseConfirmationPopup
            }
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ justifyContent: 'center', textAlign: 'center' }}>
              <Typography variant='h4'>{actionType} Corporate</Typography>
            </DialogTitle>

            <DialogContent>
              <Grid container mt={2} spacing={4}>
                <Grid item xs={4}>
                  <Controller
                    control={control}
                    name='code'
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled={openEdit?.actionType !== 'Add'}
                        fullWidth
                        onBlur={() => checkDuplicateCorporateCode(field.value)}
                        label={<RequiredLabel label='Company Code' />}
                        error={!!errors.code}
                        helperText={errors?.code?.message as string | undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    {...register('name')}
                    fullWidth
                    onChange={(e: any) => {
                      setValue(e.target.name, e.target.value)
                    }}
                    label={<RequiredLabel label='Company Name' />}
                    defaultValue={formValue?.name}
                    helperText={errors?.name?.message as string | undefined}
                    error={errors.name as any}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ControlledAutocomplete
                    control={control}
                    name='companyType'
                    options={companyTypes ?? []}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={<RequiredLabel label='Company Type' />}
                        helperText={errors?.companyType?.message as string | undefined}
                        error={errors.companyType as any}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    {...register('email')}
                    type='email'
                    onChange={(e: any) => {
                      setValue(e.target.name, e.target.value)
                    }}
                    label='Email (Optional)'
                    defaultValue={formValue?.email}
                    helperText={errors?.email?.message as string | undefined}
                    error={errors.email as any as any}
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <TextField
                    fullWidth
                    {...register('phoneNumber')}
                    onChange={(e: any) => {
                      if (+e.target.value < 0) e.target.value = 0
                      setValue(e.target.name, e.target.value)
                    }}
                    type='number'
                    label='Contact Number (Optional)'
                    defaultValue={formValue?.phoneNumber}
                  />
                </Grid> */}
                <Grid item xs={6}>
                  <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field }) => (
                      <Box
                        sx={{
                          '& .country-list': { top: '-40px' },
                          '& .form-control:focus': {
                            borderColor: theme => theme.palette.primary.main,
                            boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}`
                          },
                          '& input.form-control': { color: theme => `rgb(${theme.palette.customColors.main})` }
                        }}
                      >
                        <PhoneInput
                          {...field}
                          countryCodeEditable={false}
                          placeholder='Enter Contact Number'
                          specialLabel='Contact Number (Optional)'
                          value={watch('phoneNumber') || '+27'}
                          {...register('phoneNumber')}
                          onChange={(data, countryData: { dialCode: string }) => {
                            countryCodeContact(data, countryData?.dialCode)
                            data && setValue('phoneNumber', data)
                            clearErrors('phoneNumber')
                          }}
                          inputStyle={{
                            borderRadius: '4px',
                            background: 'none',
                            width: '100%'
                          }}
                        />
                        <FormHelperText error>
                          {errors.phoneNumber && (errors.phoneNumber?.message as string | undefined)}
                        </FormHelperText>
                        <input
                          type='hidden'
                          {...register('mobileCountryCode')}
                          value={field.value || ''}
                          onChange={() => setValue('mobileCountryCode', field?.value)}
                        />
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container sx={{ justifyContent: 'center', pt: 4 }}>
                    <Typography variant='h5'>Contact Information</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} ml={5}>
                  <Grid
                    container
                    spacing={4}
                    sx={{
                      background: theme => theme.palette.grey[100],
                      borderRadius: 2,
                      pl: 3,
                      pb: 5,
                      pr: 5,
                      boxShadow: '1px 6px 6px 0px #b5b3b3fc'
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h6'>Physical Address</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...register('address1')}
                        fullWidth
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        label={<RequiredLabel label='Address Line 1' />}
                        defaultValue={formValue?.address1}
                        helperText={errors?.address1 && (errors?.address1?.message as string | undefined)}
                        error={errors.address1 as any}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        {...register('address2')}
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        label='Address Line 2 (Optional)'
                        defaultValue={formValue?.address2}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name='country'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={country ?? []}
                            value={country?.find(item => (item as any)?.code === field?.value)}
                            getOptionLabel={option => option?.name || ''}
                            onChange={(event, data) => {
                              field.onChange(data?.code)
                              watch('country') == undefined && setValue('country', '')
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label={<RequiredLabel label='Country' />}
                                error={!!errors?.country}
                                helperText={errors?.country?.message as string | undefined}
                                fullWidth
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name='state'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={states ?? []}
                            getOptionLabel={option => option?.name || ''}
                            value={
                              states.length > 0 ? states.find((item: any) => item?.code === field?.value) || null : null
                            }
                            onChange={(event, data: any) => {
                              field.onChange(data?.code)
                              watch('state') == undefined && setValue('state', '')
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label={<RequiredLabel label='Province / State' />}
                                error={!!errors?.state}
                                helperText={errors?.state?.message as string | undefined}
                                fullWidth
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        {...register('city')}
                        fullWidth
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        type='string'
                        label={<RequiredLabel label='City' />}
                        defaultValue={formValue?.city}
                        helperText={errors?.city && (errors?.city?.message as string | undefined)}
                        error={errors.city as any}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        {...register('pincode')}
                        fullWidth
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        type='number'
                        label={<RequiredLabel label='Pin / Zip Code' />}
                        defaultValue={formValue?.pincode}
                        helperText={errors?.pincode && (errors?.pincode?.message as string | undefined)}
                        error={errors.pincode as any}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  sx={{
                    marginTop: 5,
                    ml: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Checkbox
                    checked={formValue?.isSameAddress}
                    onChange={handlePhysicalAddress}
                    defaultChecked={false}
                    size='small'
                  />
                  Select if same with Physical Address
                </Grid>
                <Grid item xs={12} ml={5}>
                  <Grid
                    container
                    spacing={4}
                    sx={{
                      background: theme => theme.palette.grey[100],
                      borderRadius: 2,
                      pl: 3,
                      pb: 5,
                      pr: 5,
                      boxShadow: '1px 6px 6px 0px #b5b3b3fc'
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h6'>Postal Address</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...register('physicalAddress1')}
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        fullWidth
                        disabled={formValue?.isSameAddress}
                        label={<RequiredLabel label='Address Line 1' />}
                        value={formValue?.physicalAddress1}
                        defaultValue={formValue?.physicalAddress1}
                        helperText={
                          errors?.physicalAddress1 && (errors?.physicalAddress1?.message as string | undefined)
                        }
                        error={errors.physicalAddress1 as any}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...register('physicalAddress2')}
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        fullWidth
                        disabled={formValue?.isSameAddress}
                        label='Address Line 2 (Optional)'
                        value={formValue?.physicalAddress2}
                        defaultValue={formValue?.physicalAddress2}
                        helperText={
                          errors?.physicalAddress2 && (errors?.physicalAddress2?.message as string | undefined)
                        }
                        error={errors.physicalAddress2 as any}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name='physicalCountry'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={country ?? []}
                            disabled={formValue?.isSameAddress}
                            value={country?.find(item => (item as any)?.code === field?.value)}
                            getOptionLabel={(option: any) => option?.name || ''}
                            onChange={(event, data: any) => {
                              field.onChange(data?.code)
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label={<RequiredLabel label='Country' />}
                                error={!!errors?.physicalCountry}
                                helperText={errors?.physicalCountry?.message as string | undefined}
                                fullWidth
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name='physicalState'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={postalStates ?? []}
                            disabled={formValue?.isSameAddress}
                            value={
                              postalStates.length > 0
                                ? postalStates.find((item: any) => item?.code === field?.value) || null
                                : null
                            }
                            getOptionLabel={(option: any) => option?.name || ''}
                            onChange={(event, data: any) => {
                              field.onChange(data?.code)
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label={<RequiredLabel label='State' />}
                                error={!!errors?.physicalState}
                                helperText={errors?.physicalState?.message as string | undefined}
                                fullWidth
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        {...register('physicalCity')}
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        fullWidth
                        disabled={formValue?.isSameAddress}
                        label={<RequiredLabel label='City' />}
                        value={formValue?.physicalCity}
                        defaultValue={formValue?.physicalCity}
                        helperText={errors?.physicalCity && (errors?.physicalCity?.message as string | undefined)}
                        error={errors.physicalCity as any}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        {...register('physicalPincode')}
                        onChange={(e: any) => {
                          setValue(e.target.name, e.target.value)
                        }}
                        fullWidth
                        disabled={formValue?.isSameAddress}
                        type='number'
                        label={<RequiredLabel label='Pin / Zip Code' />}
                        value={formValue?.physicalPincode}
                        defaultValue={formValue?.physicalPincode}
                        helperText={errors?.physicalPincode && (errors?.physicalPincode?.message as string | undefined)}
                        error={errors.physicalPincode as any}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={5}>
                  <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                    <Typography>In active</Typography>
                    <FormControlLabel
                      label=''
                      control={
                        <Switch
                          onChange={e => {
                            const checked = e?.target?.checked
                            setValue('isActive', checked, { shouldDirty: true })
                          }}
                          checked={formValue?.isActive}
                        />
                      }
                    />
                    <Typography>Active</Typography>
                  </Stack>
                </Grid>
                {loadingForm && (
                  <Backdrop
                    open={loadingForm}
                    sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }}
                  >
                    <CircularProgress color='inherit' />
                  </Backdrop>
                )}
              </Grid>
              <Grid container display='flex' justifyContent='center'>
                <Grid item xs={7.3}>
                  {formValue && isChange() && openEdit?.actionType !== 'Add' ? (
                    <AlertBox
                      sx={{ mb: 6 }}
                      color='warning'
                      variant={'filled ' as any}
                      header='Unsaved Changes'
                      message='You have made changes. Do you want to save or discard them?'
                      severity='warning'
                    />
                  ) : null}
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', marginTop: 3 }}>
              <Button variant='outlined' color='secondary' onClick={handleModalOpenClose}>
                {openEdit?.actionType !== 'Add' ? 'discard' : 'cancel'}
              </Button>
              <Button type='submit' variant='contained' sx={{ mr: 1 }}>
                {openEdit?.actionType !== 'Add' ? 'Save' : 'Add Corporate'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default StudentList
