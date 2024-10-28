// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Tooltip
} from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { userInformationStatus } from 'src/context/common'
import AlertBox from 'src/layouts/components/Alert'
import { PencilOutline, StarBox } from 'mdi-material-ui'
import { LightBackground, ProgramNameField } from 'src/styles/style'
import { DashboardService, StudentService } from 'src/service'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schema = yup.object().shape({
  firstname: yup
    .string()
    .required(userInformationStatus.FirstNameRequired)
    .matches(/^[a-zA-Z]/, 'First character must be a letter')
    .matches(/[a-zA-Z]$/, 'Last character must be a letter')
    .matches(/^[a-zA-Z\s_-]*$/, 'Allowed special characters are space, underscore, and hyphen only')
    .matches(/^(?!.*\d).*$/, userInformationStatus.FirstNameError)
    .trim(),
  middleName: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[a-zA-Z]/, 'First character must be a letter')
    .matches(/[a-zA-Z]$/, 'Last character must be a letter')
    .matches(/^[a-zA-Z\s_-]*$/, userInformationStatus.MiddleNameError)
    .matches(/^(?!.*\d).*$/, userInformationStatus.MiddleNameError),
  lastname: yup
    .string()
    .matches(/^[a-zA-Z]/, 'First character must be a letter')
    .matches(/[a-zA-Z]$/, 'Last character must be a letter')
    .matches(/^[a-zA-Z\s_-]*$/, 'Allowed special characters are space, underscore, and hyphen only')
    .matches(/^(?!.*\d).*$/, userInformationStatus.LastNameError)
    .trim(),
  email: yup.string().email().required(userInformationStatus.EmailRequired),
  mobileNumber: yup
    .string()
    .matches(/^\d+$/, userInformationStatus.MobileNumberMatch)
    .required(userInformationStatus.MobileNumber)
    .min(6, userInformationStatus.MobileNumberMin)
    .max(12, userInformationStatus.MobileNumberMax),
  nationalityStatus: yup.string().required(userInformationStatus.Nationality),
  gender: yup.string().required(userInformationStatus.Gender),
  dateOfBirth: yup.date().required(userInformationStatus.DateOfBirth),
  race: yup.string().required(userInformationStatus.Race),
  language: yup.string().required(userInformationStatus.Language),
  nationality: yup.string().required(userInformationStatus.Nationality),
  documentType: yup.string().required(userInformationStatus.DocumentType),
  identificationNumber: yup.string().required(userInformationStatus.IdentificationNumber)
})

const defaultValues = {
  firstname: '',
  middleName: '',
  lastname: '',
  email: '',
  mobileNumber: '',
  nationalityStatus: '',
  gender: '',
  dateOfBirth: '',
  race: '',
  language: '',
  permanentResident: '',
  nationality: '',
  documentType: '',
  identificationNumber: '',
  passportExpiryDate: null
}

const DialogUserInfo = ({
  studentdata,
  userDetailUpdate,
  setViPStudent,
  gender,
  race,
  language,
  nationality,
  nationalityStatus,
  documentType,
  enrolment
}: any) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm()

  const {
    register: register1,
    handleSubmit: handle2submit,
    control: userControl,
    setValue,
    reset,
    watch: watch1,
    setError,
    clearErrors,
    formState: { errors: errors2 }
  } = useForm<FieldValues>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const handleDiscard = () => {
    setShow(false)
    reset(defaultValues)
  }
  const studentLeadData = studentdata?.application?.lead

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const handleOpen = () => {
    reset({
      firstname: studentLeadData?.firstName ? studentLeadData?.firstName : '',
      middleName: studentLeadData?.middleName ? studentLeadData?.middleName : null,
      lastname: studentLeadData?.lastName ? studentLeadData?.lastName : '',
      email: studentLeadData?.email ? studentLeadData?.email : '',
      mobileNumber: studentLeadData?.mobileNumber ? studentLeadData?.mobileNumber : '',
      nationalityStatus: studentLeadData?.nationalityStatus ? studentLeadData?.nationalityStatus : '',
      gender: studentLeadData?.gender ? studentLeadData?.gender : '',
      dateOfBirth: studentLeadData?.dateOfBirth ? studentLeadData?.dateOfBirth : undefined,
      race: studentLeadData?.race ? studentLeadData?.race : '',
      language: studentLeadData?.language ? studentLeadData?.language : '',
      permanentResident: studentLeadData?.permenantResident ? studentLeadData?.permenantResident : '',
      nationality: studentLeadData?.nationality ? studentLeadData?.nationality : '',
      documentType: studentLeadData?.identificationDocumentType ? studentLeadData?.identificationDocumentType : '',
      identificationNumber: studentLeadData?.identificationNumber ? studentLeadData?.identificationNumber : '',
      passportExpiryDate: studentLeadData?.passportExpiryDate ? studentLeadData?.passportExpiryDate : null
    })
    setShow(true)
  }

  const onVipUserSubmit = async (data: FieldValues) => {
    reset({}, { keepValues: true })
    setViPStudent(data)
    setVip(false)
  }
  const checkDuplicateEmail = async (email: string) => {
    const result = await StudentService.checkDuplicateEmail(studentdata?.application?.applicationCode, email)

    if (result?.data && email != studentLeadData?.email) {
      setError('email', {
        type: 'manual',
        message: result?.data?.message
      })

      return false
    } else {
      clearErrors('email')

      return true
    }
  }
  const onPersonalInfoSubmit = async (data: FieldValues) => {
    reset(data, { keepValues: true })

    if (
      (await checkDuplicateEmail(data.email)) &&
      (await checkDuplicateMobile(data.mobileNumber, studentdata?.application?.lead?.mobileCountryCode))
    ) {
      const params = {
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        mobileNumber: data.mobileNumber,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
        language: data.language,
        race: data.race,
        nationalityStatus: data.nationalityStatus,
        identificationNumber: data.identificationNumber,
        identificationDocumentType: data.documentType,
        passportExpiryDate: data?.passportExpiryDate
      }

      setShow(false)
      await userDetailUpdate(params, studentdata?.application?.applicationCode)
      reset(defaultValues)
    }
  }

  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [vipShow, setVip] = useState<boolean>(false)
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

  useEffect(() => {
    if (watch1('documentType') === 'PASSPORT' && !watch1('passportExpiryDate')) {
      setError('passportExpiryDate', {
        type: 'custom',
        message: 'Please Select Valid Expiry Date'
      })
    } else {
      clearErrors('passportExpiryDate')
    }
  }, [watch1('documentType')])

  const checkDuplicateMobile = async (mobileNumber: string, mobileCountryCode: string) => {
    const result = await DashboardService.reggieCheckDuplicateMobile(mobileNumber, mobileCountryCode)

    if (result?.data?.existingRecord && mobileNumber != studentLeadData?.mobileNumber) {
      setError('mobileNumber', {
        type: 'manual',
        message: 'Provided mobile number already exists'
      })

      return false
    } else {
      clearErrors('mobileNumber')

      return true
    }
  }

  const handleMobileNumberChange = (e: any) => {
    const mobileNumber = e?.target?.value
    setValue('mobileNumber', mobileNumber)
    clearErrors('mobileNumber')
  }

  const handleMobileNumberBlur = (e: any) => {
    const mobileNumber = e?.target?.value
    const countryCode = studentdata?.application?.lead?.mobileCountryCode

    clearErrors('mobileNumber')

    let isValid = true
    let errorMessage = ''

    if (countryCode === '91') {
      // Check if number starts with '0'
      if (mobileNumber.startsWith('0')) {
        setError('mobileNumber', {
          type: 'manual',
          message: 'Please remove prefix "0" from the number'
        })

        return
      }

      // Check if more than 10 digits are entered
      if (mobileNumber?.length > 10) {
        setError('mobileNumber', {
          type: 'manual',
          message: 'Please enter a valid phone number'
        })

        return
      }

      isValid = /^[1-9]\d{9}$/.test(mobileNumber)
      errorMessage = 'Please enter a valid phone number'
    } else {
      // Default validation for other countries (at least 4 digits)
      isValid = /^\d{4,}$/.test(mobileNumber)
      errorMessage = 'Please enter a valid phone number'
    }

    if (!isValid) {
      setError('mobileNumber', {
        type: 'manual',
        message: errorMessage
      })
    } else {
      clearErrors('mobileNumber')
    }

    if (isValid) {
      checkDuplicateMobile(mobileNumber, countryCode)
    }
  }

  return (
    <Grid>
      <Box display='flex'>
        {enrolment === 'enrolment' && (
          <Button sx={{ mr: 2 }} size='small' startIcon={<StarBox />} variant='outlined' onClick={() => setVip(true)}>
            Set Vip User
          </Button>
        )}

        <Tooltip title='Edit User Info'>
          <Box>
            <IconButton
              onClick={handleOpen}
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

      <Dialog
        fullWidth
        open={vipShow}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && setVip(false)
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onVipUserSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => setVip(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Close />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Set VIP User
              </Typography>
            </Box>
            <Grid>
              <ProgramNameField container spacing={7} mt={5} mb={8} ml={0} pb={8}>
                <Grid item xs={4} display='grid'>
                  <label>Student ID</label>
                  <Typography color={theme => theme.palette.common.white}>
                    {studentdata?.application?.lead?.studentCode}
                  </Typography>
                </Grid>
                <Grid item xs={4} display='grid'>
                  <label>Student Name</label>
                  <Typography
                    color={theme => theme.palette.common.white}
                  >{`${studentdata?.application?.lead?.firstName} ${studentdata?.application?.lead?.lastName}`}</Typography>
                </Grid>
                <Grid item xs={4} display='grid'>
                  <label>Qualification Name</label>
                  <Typography color={theme => theme.palette.common.white}>
                    {studentdata?.application?.education?.programName}
                  </Typography>
                </Grid>
              </ProgramNameField>
            </Grid>
            <Grid container justifyContent={'space-between'}>
              <Grid item sm={5} xs={5}>
                <TextField
                  {...register('VIPComment', { required: 'Reason is required' })}
                  fullWidth
                  defaultValue={studentdata?.admission?.VIPComment}
                  label='Achievement history of the VIP Student '
                  error={!!errors.VIPComment}
                />
                {errors.VIPComment && (
                  <FormHelperText id='component-error-text'>
                    {errors.VIPComment?.message as string | undefined}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item sm={5} xs={5}>
                <Controller
                  name='VIPType'
                  control={control}
                  rules={{
                    required: 'VIPType is required'
                  }}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Change Status</FormLabel>
                      <RadioGroup {...field} row defaultValue={field.value}>
                        <FormControlLabel value='VIP' control={<Radio />} label='VIP' />
                        <FormControlLabel value='VVIP' control={<Radio />} label='VVIP' />
                        <FormControlLabel value='Prestige' control={<Radio />} label='Prestige' />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                <FormHelperText sx={{ color: 'red' }}>
                  {errors.VIPType && (errors.VIPType?.message as string | undefined)}
                </FormHelperText>
              </Grid>
            </Grid>

            {undefined !== watch('VIPComment') ? (
              <AlertBox
                sx={{ mb: 6 }}
                color='warning'
                variant={'filled ' as any}
                header='Unsaved Changes'
                message='You have made changes. Do you want to save or cancel them?'
                severity='warning'
              ></AlertBox>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={() => setVip(false)}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setShow(false)
          }
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handle2submit(onPersonalInfoSubmit)}>
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
                Edit Personal Information
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='firstname'
                  control={userControl}
                  defaultValue={studentdata?.application?.lead?.firstName}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='First Name'
                      placeholder='Jordan'
                      error={!!fieldState.error}
                      onChange={e => {
                        const regex = /^[a-zA-Z]*$/ // Allows letters and spaces
                        if (regex.test(e.target.value)) {
                          field.onChange(e) // Only allow valid characters
                        }
                      }}
                      helperText={fieldState?.error?.message as string | undefined}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <Controller
                  name='middleName'
                  control={userControl}
                  defaultValue={studentdata?.application?.lead?.middleName}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Middle Name (Optional)'
                      placeholder='William'
                      onChange={e => {
                        const regex = /^[a-zA-Z]*$/ // Allows letters and spaces
                        if (regex.test(e.target.value)) {
                          field.onChange(e) // Only allow valid characters
                        }
                      }}
                      onBlur={event => field.onChange(!!event.target.value ? event.target.value : null)}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='lastname'
                  control={userControl}
                  defaultValue={studentdata?.application?.lead?.lastName}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Last Name'
                      placeholder='Stevenson'
                      onChange={e => {
                        const regex = /^[a-zA-Z]*$/ // Allows letters and spaces
                        if (regex.test(e.target.value)) {
                          field.onChange(e) // Only allow valid characters
                        }
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register1('email')}
                  fullWidth
                  label='Email'
                  placeholder='johnDoe@email.com'
                  error={!!errors2.email}
                  defaultValue={studentdata?.application?.lead?.email}
                  onChange={e => {
                    setValue('email', e.target.value)
                    clearErrors('email')
                  }}
                  onBlur={e => checkDuplicateEmail(e.target.value)}
                  helperText={errors2.email && (errors2.email?.message as string | undefined)}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register1('mobileNumber')}
                  fullWidth
                  label='Contact Number'
                  error={!!errors2.mobileNumber}
                  defaultValue={studentdata?.application?.lead?.mobileNumber}
                  onChange={handleMobileNumberChange}
                  onBlur={handleMobileNumberBlur}
                  helperText={errors2?.mobileNumber && (errors2?.mobileNumber?.message as string | undefined)}
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
                  <DatePicker
                    label='Date of Birth(MM/DD/YYYY)'
                    inputFormat='dd/MM/yyyy'
                    value={watch1('dateOfBirth') !== undefined ? watch1('dateOfBirth') : ''}
                    onChange={value => !!value && setValue('dateOfBirth', value)}
                    maxDate={new Date()}
                    renderInput={params => (
                      <TextField
                        {...params}
                        name='dateOfBirth'
                        error={!!errors2.dateOfBirth && watch1('dateOfBirth') == undefined}
                        fullWidth
                      />
                    )}
                  />
                  {errors2.dateOfBirth && watch1('dateOfBirth') == undefined ? (
                    <FormHelperText sx={{ color: 'red' }}>
                      {errors2.dateOfBirth?.message as string | undefined}
                    </FormHelperText>
                  ) : null}
                </LocalizationProvider>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register1('race')}
                    disablePortal
                    options={race}
                    getOptionLabel={option => option.name}
                    defaultValue={race.find((i: any) => i.code == watch1('race'))}
                    onChange={(e: any, value: any) => {
                      setValue('race', value?.code)
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Race'
                          helperText={errors2?.race?.message as string | undefined}
                          error={Boolean(errors2?.race?.message)}
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register1('language')}
                    options={language}
                    disablePortal
                    getOptionLabel={option => option.name}
                    defaultValue={language.find((i: any) => i.code == watch1('language'))}
                    onChange={(e: any, value: any) => {
                      setValue('language', value?.code)
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Home Language'
                          helperText={errors2?.language?.message as string | undefined}
                          error={Boolean(errors2?.language?.message)}
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LightBackground>
                  <Grid item xs={12} display='flex'>
                    <Grid item xs={2} sx={{ mt: 4 }}>
                      <label style={{ fontWeight: ' 600', fontSize: 'smaller' }}> Nationality Status</label>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          {...register1('nationalityStatus')}
                          disablePortal
                          options={nationalityStatus}
                          getOptionLabel={option => option.name}
                          defaultValue={nationalityStatus.find((i: any) => i.code == watch1('nationalityStatus'))}
                          onChange={(e: any, value: any) => {
                            setValue('nationalityStatus', value?.code)
                            value?.code === 'SA' ? setValue('nationality', 'SA') : null
                          }}
                          renderInput={params => {
                            return (
                              <TextField
                                {...params}
                                helperText={errors2?.nationalityStatus?.message as string | undefined}
                                error={Boolean(errors2?.nationalityStatus?.message)}
                              />
                            )
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={6} sx={{ mt: 2 }}>
                    {watch1('nationalityStatus') === 'PRSA' ? (
                      <Grid item sm={4} xs={12}>
                        <TextField
                          {...register1('permanentResident')}
                          fullWidth
                          label='Permanent Resident'
                          value={'South Africa'}
                          disabled
                          error={!!errors2.permanentResident}
                          helperText={
                            !!errors2.permanentResident && (errors2.permanentResident?.message as string | undefined)
                          }
                        />
                      </Grid>
                    ) : null}
                    <Grid item sm={4} xs={12}>
                      <ControlledAutocomplete
                        control={userControl}
                        name='nationality'
                        options={nationality ?? []}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Nationality'
                            helperText={errors2?.nationality?.message as string | undefined}
                            error={Boolean(errors2?.nationality?.message)}
                          />
                        )}
                        disabled={watch1('nationalityStatus') === 'SA'}
                      />
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
                      <TextField
                        {...register1('identificationNumber')}
                        fullWidth
                        label='Identification Number'
                        error={!!errors2.identificationNumber}
                        defaultValue={studentdata?.application?.lead?.identificationNumber}
                        onChange={e => {
                          setValue('identificationNumber', e.target.value)
                        }}
                        helperText={
                          errors2.identificationNumber && (errors2.identificationNumber?.message as string | undefined)
                        }
                      />
                    </Grid>
                  </Grid>
                </LightBackground>
              </Grid>
            </Grid>

            {(studentdata && !!watch1() && studentdata?.application?.lead?.firstName !== watch1('firstname')) ||
            studentdata?.application?.lead?.lastName !== watch1('lastname') ||
            studentdata?.application?.lead?.email !== watch1('email') ||
            studentdata?.application?.lead?.gender !== watch1('gender') ||
            studentdata?.application?.lead?.dateOfBirth !== watch1('dateOfBirth') ||
            studentdata?.application?.lead?.mobileNumber !== watch1('mobileNumber') ||
            studentdata?.application?.lead?.race !== watch1('race') ||
            studentdata?.application?.lead?.language !== watch1('language') ||
            studentdata?.application?.lead?.nationality !== watch1('nationality') ||
            studentdata?.application?.lead?.identificationNumber !== watch1('identificationNumber') ||
            studentdata?.application?.lead?.nationalityStatus !== watch1('nationalityStatus') ||
            studentdata?.application?.lead?.identificationDocumentType !== watch1('documentType') ||
            studentdata?.application?.lead?.passportExpiryDate !== watch1('passportExpiryDate') ? (
              <AlertBox
                sx={{ mb: 6 }}
                color='warning'
                variant={'filled ' as any}
                header='Unsaved Changes'
                message='You have made changes. Do you want to save or cancel them?'
                severity='warning'
              ></AlertBox>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleDiscard}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ mr: 2 }}
              type='submit'
              disabled={
                (!!errors2?.email as boolean | undefined) ||
                (errors2.passportExpiryDate as boolean | undefined) ||
                (errors2.mobileNumber as boolean | undefined)
              }
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default DialogUserInfo
