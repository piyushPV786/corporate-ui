// ** React Imports
import { Ref, useState, forwardRef, ReactElement, Fragment, useEffect } from 'react'
import 'react-phone-input-2/lib/material.css'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Close from 'mdi-material-ui/Close'
import { useForm, Controller, FieldValues } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { PencilOutline } from 'mdi-material-ui'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { Autocomplete, Card, CircularProgress, FormControl, FormHelperText, Tooltip } from '@mui/material'
import { DashboardService } from 'src/service'
import PhoneInput from 'react-phone-input-2'
import {
  mandatorySponsorModeFeilds,
  messages,
  patternForPassport,
  patternForSMARTID,
  status,
  userInformationStatus
} from 'src/context/common'
import EditSponsorDialogCustomHook from 'src/hooks/editDialogCustomHook'
import { commonListTypes } from 'src/types/apps/dataTypes'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { errorToast, successToast } from 'src/components/Toast'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schema = yup.object().shape({
  sponsortype: yup.string().required(userInformationStatus.SponsorType),
  relationshiptype: yup.string().required(userInformationStatus.RelationShipType),
  sponsorname: yup.string().when('relationshiptype', {
    is: (value: string) => value === 'EMPLOYER',
    then: yup.string().required(userInformationStatus.SponsorName),
    otherwise: yup.string()
  }),
  email: yup.string().email().required(userInformationStatus.EmailRequired),
  mobileNumber: yup.string().required(userInformationStatus.MobileNumber),
  address: yup.string().required(userInformationStatus.Address),
  country: yup.string().required(userInformationStatus.CountryNameRequired),
  state: yup.string().required(userInformationStatus.StateNameRequired),
  city: yup
    .string()
    .required(userInformationStatus.CityNameRequired)
    .matches(/^[A-Za-z\s]+$/, userInformationStatus.CityNameInvalid),
  mobileCountryCode: yup.string().required(),
  zipcode: yup
    .string()
    .required(userInformationStatus.ZipcodeRequired)
    .matches(/^\d+$/, userInformationStatus.ZipCodeNumber)
    .min(4)
    .max(6),

  // firstName: yup
  //     .string()
  //     .required(userInformationStatus.FirstNameRequired)
  //     .matches(/^(\S+$)/g, userInformationStatus.FirstNameSpace)
  //     .matches(/^[a-zA-z]*$/, userInformationStatus.FirstNameError),
  firstName: yup.string().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup
      .string()
      .required(userInformationStatus.FirstNameRequired)
      .matches(/^(\S+$)/g, userInformationStatus.FirstNameSpace)
      .matches(/^[a-zA-z]*$/, userInformationStatus.FirstNameError),
    otherwise: yup.string()
  }),
  lastName: yup.string().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup
      .string()
      .required(userInformationStatus.LastNameRequired)
      .matches(/^(\S+$)/g, userInformationStatus.LastNameSpace)
      .matches(/^[a-zA-z]*$/, userInformationStatus.LastNameError),
    otherwise: yup.string()
  }),
  gender: yup.string().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup.string().required(userInformationStatus.Gender),
    otherwise: yup.string()
  }),
  dateOfBirth: yup.date().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup.date().required(userInformationStatus.DateOfBirth),
    otherwise: yup.date().nullable()
  }),
  documentType: yup.string().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup.string().required(userInformationStatus.DocumentType),
    otherwise: yup.string()
  }),
  identificationNumber: yup.string().when('relationshiptype', {
    is: (value: string) => value !== 'EMPLOYER',
    then: yup
      .string()
      .required(userInformationStatus.IdentificationNumber)
      .min(8, userInformationStatus.IdentificationNumbermin)
      .max(13, userInformationStatus.IdentificationNumbermax),
    otherwise: yup.string()
  })
})

interface DialogStudentInfoProps {
  studentdata?: any
  country: commonListTypes[]
  getStudentData: () => void
  isEdit: boolean
  gender: commonListTypes[]
  documentType: commonListTypes[]
  applicationCode: string
}

const EditSponsorDialog = ({
  studentdata,
  getStudentData,
  isEdit,
  gender,
  documentType,
  applicationCode
}: DialogStudentInfoProps) => {
  const defaultValue = {
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: null,
    documentType: '',
    identificationNumber: '',
    sponsortype: '',
    relationshiptype: '',
    sponsorname: '',
    email: '',
    mobileNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: null,
    mobileCountryCode: '27'
  }

  const {
    register: register1,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    watch: watch1,
    setError,
    control,
    formState: { errors: errors2 }
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues: defaultValue,
    resolver: yupResolver(schema)
  })

  const docTypeWatch = watch1('documentType')

  const [show, setShow] = useState<boolean>(false)
  const countryCode = watch1('country')
  const { statesList, masterData, loading } = EditSponsorDialogCustomHook(countryCode)
  const onSubmitt = async (data: any) => {
    reset(data, { keepValues: true })

    const EmployerParams = {
      applicationCode: applicationCode,
      name: data?.sponsorname,
      email: data?.email,
      mobileNumber: data?.mobileNumber,
      mobileCountryCode: data?.mobileCountryCode,
      address: data?.address,
      sponsorModeCode: data?.sponsortype,
      relationshipCode: data?.relationshiptype,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      zipCode: Number(data?.zipcode)
    }

    const params = {
      applicationCode: applicationCode,
      firstName: data?.firstName,
      lastName: data?.lastName,
      dateOfBirth: data?.dateOfBirth,
      gender: data?.gender,
      identificationNumber: data?.identificationNumber,
      identificationDocumentType: data?.documentType,
      passportExpiryDate: data?.passportExpiryDate,
      email: data?.email,
      mobileNumber: data?.mobileNumber,
      mobileCountryCode: data?.mobileCountryCode,
      address: data?.address,
      sponsorModeCode: data?.sponsortype,
      relationshipCode: data?.relationshiptype,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      zipCode: Number(data?.zipcode)
    }

    setShow(false)
    if (isEdit) {
      const response = await DashboardService.updateSponsor(
        watch1('relationshiptype') === 'EMPLOYER' ? EmployerParams : params,
        studentdata?.id
      )
      if (response?.data?.statusCode === status?.successCode) successToast(messages?.sponsorUpdated)
      else errorToast(messages.error)
    } else {
      const Data = await DashboardService.addSponsor(
        watch1('relationshiptype') === 'EMPLOYER' ? EmployerParams : params
      )
      if (Data?.response?.data?.statusCode === status?.successCodeOne) successToast(messages?.sponsorAdded)
      else errorToast(messages.error)

      setTimeout(() => {
        if (Data?.createCreditHistory) errorToast(Data?.createCreditHistory)
      }, 2000)
    }
    reset(defaultValue)
    getStudentData()
  }

  const handleDiscard = () => {
    setShow(false)
    reset(defaultValue)
  }

  const handleOpen = () => {
    setShow(true)
    if (isEdit) {
      reset({
        firstName: studentdata?.firstName ? studentdata?.firstName : '',
        lastName: studentdata?.lastName ? studentdata?.lastName : '',
        gender: studentdata?.gender ? studentdata?.gender : '',
        dateOfBirth: studentdata?.dateOfBirth ? studentdata?.dateOfBirth : undefined,
        documentType: studentdata?.identificationDocumentType ? studentdata?.identificationDocumentType : '',
        identificationNumber: studentdata?.identificationNumber ? studentdata?.identificationNumber : '',
        sponsortype: studentdata?.sponsorModeCode || '',
        relationshiptype: studentdata?.relationshipCode || '',
        sponsorname: studentdata?.name || '',
        email: studentdata?.email || '',
        mobileNumber: studentdata?.mobileNumber.slice(0) || '',
        address: studentdata?.address || '',
        country: studentdata?.country || '',
        state: studentdata?.state || '',
        city: studentdata?.city || '',
        zipcode: Number(studentdata?.zipCode) || 0,
        mobileCountryCode: studentdata?.mobileCountryCode || ''
      })
    } else {
      reset({
        mobileCountryCode: '27'
      })
    }
  }

  useEffect(() => {
    if (statesList?.length > 0)
      setValue('state', statesList.find((state: { code: any }) => state?.code === studentdata?.state)?.code)
  }, [statesList, studentdata?.state, setValue])

  useEffect(() => {
    if (!countryCode) {
      setValue('state', '')
    }
  }, [countryCode])

  const countryCodeContact = (data: any, dialCode: string) => {
    data && setValue(`mobileCountryCode`, dialCode)
  }

  const handleOnBlur = (date: any) => {
    const isDate = !isNaN(new Date(watch1('passportExpiryDate')).getTime())
    if (isDate) {
      const selectedDate = date.toISOString().split('T')[0]
      const currentDate = new Date().toISOString().split('T')[0]

      if (selectedDate < currentDate) {
        setError('passportExpiryDate', {
          type: 'custom',
          message: 'Please Select Valid Expiry Date'
        })
      } else {
        clearErrors('passportExpiryDate')
      }
    } else {
      setError('passportExpiryDate', {
        type: 'custom',
        message: 'Please Select Valid Expiry Date'
      })
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const validateIdNumber = (value: string) => {
    if (docTypeWatch === 'SMARTID') {
      if (!patternForSMARTID.test(value)) {
        setError('identificationNumber', {
          type: 'custom',
          message: userInformationStatus.IdentificationNumberSmart
        })
      }
    }
    if (docTypeWatch === 'PASSPORT') {
      if (!patternForPassport.test(value)) {
        setError('identificationNumber', {
          type: 'custom',
          message: userInformationStatus.IdentificationNumberPassport
        })
      }
    }
  }

  return (
    <Fragment>
      <Box display='flex'>
        <Box>
          {isEdit ? (
            <Tooltip title='Edit User Info'>
              <IconButton
                onClick={handleOpen}
                size='small'
                component='a'
                color='primary'
                sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green', mt: 5 }}
              >
                <PencilOutline />
              </IconButton>
            </Tooltip>
          ) : (
            <Button onClick={handleOpen} variant='outlined'>
              {' '}
              Add Sponsor{' '}
            </Button>
          )}
        </Box>
      </Box>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmitt)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => setShow(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Close />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                {isEdit ? `Edit Sponsor Information` : `Add Sponsor Information`}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  name='sponsortype'
                  control={control}
                  options={masterData?.sponsorModeData?.filter((item: { code: string }) =>
                    mandatorySponsorModeFeilds.includes(item?.code)
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Sponsor Type'
                      helperText={errors2?.sponsortype?.message as string | undefined}
                      error={Boolean(errors2?.sponsortype as any)}
                    />
                  )}
                  disabled={false}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  name='relationshiptype'
                  control={control}
                  options={masterData?.relationData}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Relationship Type'
                      helperText={errors2?.relationshiptype?.message as string | undefined}
                      error={Boolean(errors2?.relationshiptype as any)}
                    />
                  )}
                  disabled={false}
                />
              </Grid>
              {watch1('relationshiptype') !== 'EMPLOYER' ? (
                <>
                  <Grid item sm={4} xs={12}>
                    <Controller
                      name='firstName'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='First Name'
                          fullWidth
                          error={!!errors2?.firstName}
                          helperText={errors2?.firstName?.message as string | undefined}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Controller
                      name='lastName'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Last Name'
                          fullWidth
                          error={!!errors2?.lastName}
                          helperText={errors2?.lastName?.message as string | undefined}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth>
                      <Autocomplete
                        {...register1('gender')}
                        disablePortal
                        options={gender}
                        getOptionLabel={option => option.name}
                        defaultValue={gender.find((i: any) => i.code == watch1('gender'))}
                        onChange={(e: any, value: any) => {
                          setValue('gender', value?.code)
                          clearErrors('gender')
                        }}
                        renderInput={params => {
                          return (
                            <TextField
                              {...params}
                              label='Gender'
                              helperText={errors2?.gender?.message as string | undefined}
                              error={Boolean(errors2?.gender?.message)}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name='dateOfBirth'
                        control={control}
                        render={() => (
                          <>
                            <DatePicker
                              label='Date of Birth(MM/DD/YYYY)'
                              inputFormat='dd/MM/yyyy'
                              value={watch1('dateOfBirth') !== undefined ? watch1('dateOfBirth') : ''}
                              maxDate={new Date()}
                              onChange={value => {
                                if (value) {
                                  clearErrors('dateOfBirth')

                                  setValue('dateOfBirth', value)

                                  const today = new Date()
                                  const birthDate = new Date(value)

                                  // Calculate the age
                                  let age = today.getFullYear() - birthDate.getFullYear()
                                  const monthDiff = today.getMonth() - birthDate.getMonth()
                                  const dayDiff = today.getDate() - birthDate.getDate()

                                  // Adjust age if the birth month and day haven't occurred yet this year
                                  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                                    age--
                                  }

                                  // Set error if the user is under 18
                                  if (age < 18) {
                                    setError('dateOfBirth', {
                                      type: 'custom',
                                      message: userInformationStatus.Underage
                                    })
                                  }
                                  if (birthDate.getFullYear() <= 1950) {
                                    setError('dateOfBirth', {
                                      type: 'custom',
                                      message: 'Year of birth must be greater than 1950.'
                                    })
                                  }
                                }
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  name='dateOfBirth'
                                  error={!!errors2.dateOfBirth}
                                  helperText={errors2?.dateOfBirth?.message as string | undefined}
                                  fullWidth
                                />
                              )}
                            />
                            {/* {errors2.dateOfBirth && watch1('dateOfBirth') == undefined ? (
                                                            <FormHelperText sx={{ color: 'red' }}>{errors2.dateOfBirth?.message as string | undefined}</FormHelperText>
                                                        ) : null} */}
                          </>
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl fullWidth>
                      <Autocomplete
                        {...register1('documentType', { required: 'documentType is required' })}
                        disablePortal
                        options={documentType}
                        getOptionLabel={option => option.name}
                        defaultValue={documentType.find((i: any) => i.code == watch1('documentType'))}
                        onChange={(e: any, value: any) => {
                          setValue('documentType', value?.code)
                          clearErrors('documentType')
                        }}
                        renderInput={params => {
                          return (
                            <TextField
                              {...params}
                              label='Identification Document Type'
                              helperText={errors2?.documentType?.message as string | undefined}
                              error={Boolean(errors2?.documentType?.message)}
                            />
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {watch1('documentType') === 'PASSPORT' && (
                    <Grid item sm={4} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label='PassPort Expiry Date'
                          inputFormat='dd/MM/yyyy'
                          disablePast={tomorrow === new Date()}
                          minDate={tomorrow}
                          value={watch1('passportExpiryDate') !== undefined ? watch1('passportExpiryDate') : null}
                          onChange={value => {
                            !!value && setValue('passportExpiryDate', value)
                            !!value && handleOnBlur(value)
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              name='passportExpiryDate'
                              error={!!errors2.passportExpiryDate}
                              fullWidth
                            />
                          )}
                        />
                        {errors2.passportExpiryDate ? (
                          <FormHelperText sx={{ color: 'red' }}>
                            {errors2.passportExpiryDate?.message as string | undefined}
                          </FormHelperText>
                        ) : null}
                      </LocalizationProvider>
                    </Grid>
                  )}
                  <Grid item sm={4} xs={12}>
                    <Controller
                      name='identificationNumber'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          {...register1('identificationNumber')}
                          name='identificationNumber'
                          fullWidth
                          label='Identification Number'
                          error={!!errors2.identificationNumber}
                          defaultValue={studentdata?.identificationNumber}
                          onChange={e => {
                            field.onChange(e)
                            setValue('identificationNumber', e.target.value)
                          }}
                          onBlur={e => validateIdNumber(e.target.value)}
                          helperText={
                            errors2.identificationNumber &&
                            (errors2.identificationNumber?.message as string | undefined)
                          }
                          inputProps={{ maxLength: 13 }}
                        />
                      )}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item sm={4} xs={12}>
                  <TextField
                    {...register1('sponsorname')}
                    fullWidth
                    label='Sponsor/company Name'
                    placeholder='Sponsor/company Name'
                    error={errors2.sponsorname as boolean | undefined}
                    defaultValue={studentdata?.name}
                    onChange={e => {
                      setValue('sponsorname', e.target.value)
                    }}
                    helperText={errors2.sponsorname && (errors2.sponsorname?.message as string | undefined)}
                  />
                </Grid>
              )}
              <Grid item sm={8} xs={12}>
                <TextField
                  {...register1('email')}
                  fullWidth
                  label='Email'
                  placeholder='Email'
                  error={errors2.email as boolean | undefined}
                  defaultValue={studentdata?.email}
                  onChange={e => {
                    setValue('email', e.target.value)
                  }}
                  helperText={errors2.email && (errors2.email?.message as string | undefined)}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='mobileNumber'
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
                        country={'za'}
                        countryCodeEditable={true}
                        placeholder='Enter Contact Number'
                        specialLabel='Contact Number'
                        value={watch1('mobileNumber')}
                        {...register1('mobileNumber')}
                        onChange={(data, countryData: { dialCode: string }) => {
                          countryCodeContact(data, countryData?.dialCode)
                          setValue('mobileNumber', data)
                          clearErrors('mobileNumber')
                        }}
                        inputStyle={{
                          borderRadius: '4px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                      <FormHelperText error>
                        {errors2.mobileNumber && (errors2.mobileNumber?.message as string | undefined)}
                      </FormHelperText>
                      <input
                        type='hidden'
                        {...register1('mobileCountryCode')}
                        value={field.value || '27'}
                        onChange={() => setValue('mobileCountryCode', field?.value)}
                      />
                    </Box>
                  )}
                />
              </Grid>
              <Card sx={{ m: 3, p: 3, mt: 6 }}>
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                  <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                    Sponsor Address
                  </Typography>
                </Box>
                <Grid container spacing={6}>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      {...register1('address')}
                      fullWidth
                      label='Address'
                      placeholder='Address'
                      error={errors2.address as boolean | undefined}
                      defaultValue={studentdata?.address}
                      onChange={e => {
                        setValue('address', e.target.value)
                      }}
                      helperText={errors2.address && (errors2.address?.message as string | undefined)}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <form autoComplete='off'>
                      <ControlledAutocomplete
                        name='country'
                        control={control}
                        options={masterData?.countryData?.sort((a: { name: number }, b: { name: number }) => {
                          if (a.name < b.name) return -1
                          if (a.name > b.name) return 1

                          return 0
                        })}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Country'
                            helperText={errors2?.country?.message as string | undefined}
                            error={Boolean(errors2?.country as any)}
                          />
                        )}
                        disabled={false}
                      />
                    </form>
                  </Grid>
                  <Grid item sm={4} xs={4}>
                    {!loading && (
                      <>
                        <form autoComplete='off'>
                          <ControlledAutocomplete
                            name='state'
                            control={control}
                            options={statesList}
                            defaultValue={
                              statesList.find((state: { code: any }) => state?.code === studentdata?.state)
                                ? statesList.find((state: { code: any }) => state?.code === studentdata?.state)?.code
                                : ('' as any)
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='State'
                                helperText={errors2?.state?.message as string | undefined}
                                error={Boolean(errors2?.state as any)}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            disabled={false}
                          />
                        </form>
                      </>
                    )}
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    <TextField
                      {...register1('city')}
                      fullWidth
                      label='City'
                      error={errors2.city as boolean | undefined}
                      defaultValue={studentdata?.city}
                      onChange={e => {
                        setValue('city', e.target.value)
                      }}
                      helperText={errors2.city && (errors2.city?.message as string | undefined)}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      {...register1('zipcode')}
                      fullWidth
                      label='Pin Code / Zip Code'
                      error={errors2.zipcode as boolean | undefined}
                      defaultValue={Number(studentdata?.zipCode) || null}
                      onChange={e => {
                        setValue('zipcode', e.target.value)
                      }}
                      helperText={errors2.zipcode && (errors2.zipcode?.message as string | undefined)}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit' disabled={Object.keys(errors2).length !== 0}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default EditSponsorDialog
