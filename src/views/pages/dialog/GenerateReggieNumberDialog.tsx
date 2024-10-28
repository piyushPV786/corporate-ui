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
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import styles from './GenerateReggieNumber.module.css'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Autocomplete, FormControl, FormHelperText } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { patternForPassport, patternForSMARTID, userInformationStatus } from 'src/context/common'
import { LightBackground } from 'src/styles/style'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import { IAllProgramApiTypes, StudentReggieParams, commonListTypes } from 'src/types/apps/dataTypes'
import { DashboardService } from 'src/service'
import { getName, isValidDate } from 'src/utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface IPropsGenerateReggieNumber {
  userDetailUpdate: (data: StudentReggieParams) => Promise<void>
  nationality: commonListTypes[]
  documentType: commonListTypes[]
  feeMode: commonListTypes[]
  programList: IAllProgramApiTypes[]
  feeDetails: any
  getFeeDetailsByProgramCode: (programCode: string) => Promise<void>
  setFeeDetails: any
  genderDetails: any
  raceDetails: any
  languageDetails: any
}

const schema = yup.object().shape({
  firstName: yup
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
    .matches(/^[a-zA-Z\s_-]*$/, userInformationStatus.MiddleNameError)
    .trim(),
  lastName: yup
    .string()
    .required(userInformationStatus.LastNameRequired)
    .matches(/^[a-zA-Z]/, 'First character must be a letter')
    .matches(/[a-zA-Z]$/, 'Last character must be a letter')
    .matches(/^[a-zA-Z\s_-]*$/, 'Allowed special characters are space, underscore, and hyphen only')
    .matches(/^(?!.*\d).*$/, userInformationStatus.LastNameError)
    .trim(),
  email: yup.string().email().required(userInformationStatus.EmailRequired),
  mobileNumber: yup.string().required(userInformationStatus.MobileNumber),
  leadSource: yup.string(),
  startDate: yup.mixed().test('isValidDate', 'Invalid date', function (value) {
    return !value || !isNaN(value.getTime())
  }),
  paymentMode: yup.string().required(userInformationStatus.PaymentMode),
  nationality: yup.string().required(userInformationStatus.Nationality),
  documentType: yup.string().required(userInformationStatus.DocumentType),
  identificationNumber: yup
    .string()
    .max(13, userInformationStatus.IdentificationMax)
    .required(userInformationStatus.IdentificationNumber)
    .matches(/^[a-zA-Z0-9]+$/, userInformationStatus.IdentificationType)
    .test(
      'is-valid-id',
      'Identification number must be 13 digits and contain only numbers for SMARTID.',
      function (value) {
        const { documentType } = this.parent
        if (documentType === 'SMARTID') {
          if (typeof value === 'string' && /^\d{13}$/.test(value)) {
            return true
          } else {
            return false // Return false if value is not a string or doesn't match the pattern
          }
        }

        return true
      }
    ),
  mobileCountryCode: yup.string().required(),
  program: yup.string().required(userInformationStatus.program),
  studyMode: yup.string().required(userInformationStatus.studyMode),
  gender: yup.string().required(userInformationStatus.Gender),
  dateOfBirth: yup
    .date()
    .typeError(userInformationStatus.DateOfBirth)
    .required(userInformationStatus.DateOfBirth)
    .test({
      name: 'dateOfBirth',
      test: value => {
        return isValidDate(value)
      },
      message: userInformationStatus.InvalidDateOfBirth
    }),
  language: yup.string().required(userInformationStatus.Language),
  race: yup.string().required(userInformationStatus.Race)
})

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  leadSource: '',
  startDate: '',
  mobileNumber: '',
  paymentMode: '',
  nationality: '',
  documentType: '',
  identificationNumber: '',
  mobileCountryCode: '27',
  program: '',
  studyMode: '',
  gender: '',
  dateOfBirth: null,
  language: '',
  race: ''
}

const GenerateReggieNumberDialog = ({
  userDetailUpdate,
  nationality,
  documentType,
  programList,
  feeMode,
  feeDetails,
  getFeeDetailsByProgramCode,
  setFeeDetails,
  genderDetails,
  raceDetails,
  languageDetails
}: IPropsGenerateReggieNumber) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const docType = watch('documentType')

  const handleDiscard = () => {
    setShow(false)
    reset(defaultValues)
    setFeeDetails([])
  }

  const handleOpen = () => {
    setShow(true)
  }

  const checkDuplicateEmail = async (email: string) => {
    const result = await DashboardService.reggieCheckDuplicateEmail(email)

    if (result?.data?.existingRecord) {
      setError('email', {
        type: 'manual',
        message: 'Provided email address already exists'
      })

      return false
    } else {
      clearErrors('email')

      return true
    }
  }

  const checkDuplicateMobile = async (mobileNumber: string, mobileCountryCode: string) => {
    const result = await DashboardService.reggieCheckDuplicateMobile(mobileNumber, mobileCountryCode)

    if (result?.data?.existingRecord) {
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

  const onPersonalInfoSubmit = async (
    data: any & {
      startDate: string
      documentType: string
      program: string
      studyMode: string
      language: string
      race: string
    }
  ) => {
    reset(data, { keepValues: true })
    const mobileCheck = data?.mobileNumber.slice(data?.mobileCountryCode?.length, data?.mobileNumber?.length)

    if (
      (await checkDuplicateEmail(data?.email)) &&
      (await checkDuplicateMobile(mobileCheck, data?.mobileCountryCode))
    ) {
      const params = {
        ...data,
        mobileNumber: data?.mobileNumber.slice(data?.mobileCountryCode?.length, data?.mobileNumber?.length),
        expectedStartDate: data?.startDate,
        identificationDocumentType: data?.documentType,
        isReggieNumber: true,
        programCode: data?.program,
        programName: getName(programList, data?.program),
        studyModeCode: data?.studyMode,
        gender: data?.gender,
        dateOfBirth: data?.dateOfBirth,
        language: data?.language,
        race: data?.race
      }

      setShow(false)
      await userDetailUpdate(params)
      reset(defaultValues)
      setFeeDetails([])
    }
  }

  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [feeError, setFeeError] = useState<string>('')

  const countryCodeContact = (data: any, dialCode: string) => {
    data && setValue(`mobileCountryCode`, dialCode)
  }

  const mobileNumberCheck = (mobile: any) => {
    const countryCodeLength = watch('mobileCountryCode').length
    const mobileNumber = mobile?.toString().substring(countryCodeLength)
    if (mobileNumber?.length < 6) {
      setError('mobileNumber', { type: 'manual', message: userInformationStatus.mobileNumberMin })
    } else clearErrors('mobileNumber')
  }

  useEffect(() => {
    const mobileNumber = watch('mobileNumber')
    mobileNumber && mobileNumberCheck(mobileNumber)
  }, [watch('mobileNumber'), watch('mobileCountryCode')])

  useEffect(() => {
    watch('program') && getFeeDetailsByProgramCode(watch('program'))
  }, [watch('program')])

  useEffect(() => {
    if (feeDetails?.length === 0 && watch('program')) {
      setFeeError(userInformationStatus.feeConfigure)
    } else if (feeDetails?.length !== 0) {
      setFeeError('')
    }
  }, [feeDetails, watch('program'), setError, clearErrors])

  const validateIndentificationNumber = (value: string) => {
    console.log('called', docType, value)
    if (docType === 'SMARTID') {
      if (!patternForSMARTID.test(value)) {
        setError('identificationNumber', {
          type: 'custom',
          message: userInformationStatus.IdentificationNumberSmart
        })
      }
    }
    if (docType === 'PASSPORT') {
      if (!patternForPassport.test(value)) {
        setError('identificationNumber', {
          type: 'custom',
          message: userInformationStatus.IdentificationNumberPassport
        })
      }
    }
  }

  return (
    <Grid>
      <Box>
        <Button size='small' variant='contained' onClick={handleOpen}>
          <Typography className={styles.addButton}>Generate Reggie Number</Typography>
        </Button>
      </Box>

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
        <form onSubmit={handleSubmit(onPersonalInfoSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={handleDiscard} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Close />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Generate Reggie Number
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='First Name'
                      placeholder='Jordan'
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message as string | undefined}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <Controller
                  name='middleName'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Middle Name (Optional)'
                      placeholder='William'
                      onChange={event => field.onChange(!!event.target.value ? event.target.value : null)}
                      onBlur={event => field.onChange(!!event.target.value ? event.target.value : null)}
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Last Name'
                      placeholder='Stevenson'
                      error={!!fieldState.error}
                      helperText={fieldState?.error?.message as string | undefined}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register('gender')}
                    options={genderDetails}
                    disablePortal
                    getOptionLabel={option => option.name}
                    onChange={(e: any, value: any) => {
                      setValue('gender', value?.code)
                      clearErrors('gender')
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Gender'
                          helperText={errors?.gender?.message as string | undefined}
                          error={Boolean(errors?.gender?.message)}
                          required
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  rules={{ required: 'Date of birth is required' }}
                  render={({ field: { value, onChange } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label='Date of Birth *'
                        value={value}
                        onChange={onChange}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors?.dateOfBirth)}
                            // eslint-disable-next-line lines-around-comment
                            helperText={errors.dateOfBirth?.message as string | undefined}
                            fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register('language')}
                    options={languageDetails}
                    disablePortal
                    getOptionLabel={option => option.name}
                    onChange={(e: any, value: any) => {
                      setValue('language', value?.code)
                      clearErrors('language')
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Home Language'
                          helperText={errors?.language?.message as string | undefined}
                          error={Boolean(errors?.language?.message)}
                          required
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={8} xs={12}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label='Email'
                  placeholder='johnDoe@email.com'
                  error={!!errors.email}
                  onChange={e => {
                    const trimmedValue = e.target.value.trim()
                    setValue('email', trimmedValue)
                    clearErrors('email')
                  }}
                  helperText={errors.email && (errors.email?.message as string | undefined)}
                  onBlur={e => e.target.value && checkDuplicateEmail(e.target.value)}
                  required
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
                        countryCodeEditable={true}
                        placeholder='Enter Contact Number'
                        specialLabel='Contact Number *'
                        value={watch('mobileNumber') || '+27'}
                        {...register('mobileNumber')}
                        onChange={(data, countryData: { dialCode: string }) => {
                          countryCodeContact(data, countryData?.dialCode)
                          data && setValue('mobileNumber', data)
                          clearErrors('mobileNumber')
                        }}
                        onBlur={e => {
                          const mobileNumber =
                            e.target.value && e.target.value.replaceAll(' ', '').replace('+', '').replace('-', '')
                          const mobileCheck = mobileNumber.slice(
                            watch('mobileCountryCode')?.length,
                            mobileNumber?.length
                          )
                          mobileCheck.length >= 6 && checkDuplicateMobile(mobileCheck, watch('mobileCountryCode'))
                        }}
                        inputStyle={{
                          borderRadius: '4px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                      <FormHelperText error>
                        {errors.mobileNumber && (errors.mobileNumber?.message as string | undefined)}
                      </FormHelperText>
                      <input
                        type='hidden'
                        {...register('mobileCountryCode')}
                        value={field.value || ''}
                        onChange={() => setValue('mobileCountryCode', field?.value)}
                        required
                      />
                    </Box>
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register('race')}
                    options={raceDetails}
                    disablePortal
                    getOptionLabel={option => option.name}
                    onChange={(e: any, value: any) => {
                      setValue('race', value?.code)
                      clearErrors('race')
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Race'
                          helperText={errors?.race?.message as string | undefined}
                          error={Boolean(errors?.race?.message)}
                          required
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='startDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {' '}
                        <DatePicker
                          views={['year', 'month']}
                          openTo='month'
                          minDate={new Date()}
                          inputFormat='MMMM, yyyy'
                          label='Expected Start Date (Optional)'
                          value={value || null}
                          onChange={newValue => onChange(newValue)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              fullWidth
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.startDate && (
                    <FormHelperText sx={{ color: 'error.main' }} id='startDate'>
                      {userInformationStatus.startDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='leadSource'
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Lead Source (Optional)'
                        error={!!fieldState.error}
                        helperText={fieldState?.error?.message as string | undefined}
                      />
                    )}
                  />
                </FormControl>
              </Grid> */}
              <Grid item xs={8}>
                <ControlledAutocomplete
                  name='program'
                  control={control}
                  options={programList}
                  rules={{ required: 'Qualification is required' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Qualification'
                      helperText={errors?.program?.message as string | undefined}
                      error={Boolean(errors?.program as any) || feeError !== ''}
                      required
                    />
                  )}
                />
                {feeDetails?.length === 0 && watch('program') && (
                  <Typography variant='caption' color='red'>
                    {feeError && feeError}
                  </Typography>
                )}
              </Grid>

              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...register('paymentMode')}
                    options={feeMode}
                    disablePortal
                    getOptionLabel={option => option.name}
                    defaultValue={feeMode?.find((i: any) => i.code == watch('paymentMode'))}
                    onChange={(e: any, value: any) => {
                      setValue('paymentMode', value?.code)
                      clearErrors('paymentMode')
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Payment Mode'
                          helperText={errors?.paymentMode?.message as string | undefined}
                          error={Boolean(errors?.paymentMode?.message)}
                          required
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              {feeDetails[0]?.studyModes.length > 0 && (
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...register('studyMode')}
                      options={feeDetails[0]?.studyModes}
                      disablePortal
                      getOptionLabel={option => option.studyModeCode}
                      defaultValue={feeDetails[0]?.studyModes?.find((i: any) => i.studyModeCode == watch('studyMode'))}
                      onChange={(e: any, value: any) => {
                        setValue('studyMode', value?.studyModeCode)
                        clearErrors('studyMode')
                      }}
                      renderInput={params => {
                        return (
                          <TextField
                            {...params}
                            label='Study Mode'
                            helperText={errors?.studyMode?.message as string | undefined}
                            error={Boolean(errors?.studyMode?.message)}
                            required
                          />
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <LightBackground>
                  <Grid item display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='h5'>National ID Details</Typography>
                  </Grid>
                  <Grid container spacing={6} sx={{ mt: 2 }}>
                    {watch('nationalityStatus') === 'PRSA' ? (
                      <Grid item sm={4} xs={12}>
                        <TextField
                          {...register('permanentResident')}
                          fullWidth
                          label='Permanent Resident'
                          value={'South Africa'}
                          disabled
                          error={!!errors.permanentResident}
                          helperText={
                            !!errors.permanentResident && (errors.permanentResident?.message as string | undefined)
                          }
                          required
                        />
                      </Grid>
                    ) : null}
                    <Grid item sm={4} xs={12}>
                      <ControlledAutocomplete
                        control={control}
                        name='nationality'
                        options={nationality}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Nationality'
                            helperText={errors?.nationality?.message as string | undefined}
                            error={Boolean(errors?.nationality?.message)}
                            required
                          />
                        )}
                        disabled={watch('nationalityStatus') === 'SA'}
                      />
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <FormControl fullWidth>
                        <Autocomplete
                          {...register('documentType', { required: 'documentType is required' })}
                          disablePortal
                          options={documentType}
                          getOptionLabel={option => option.name}
                          defaultValue={documentType?.find((i: any) => i.code == watch('documentType'))}
                          onChange={(e: any, value: any) => {
                            setValue('documentType', value?.code || '')
                            clearErrors('documentType')
                          }}
                          renderInput={params => {
                            return (
                              <TextField
                                {...params}
                                label='Identification Document Type'
                                InputLabelProps={{
                                  shrink: true
                                }}
                                helperText={errors?.documentType?.message as string | undefined}
                                error={Boolean(errors?.documentType?.message)}
                                required
                              />
                            )
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={4} xs={12}>
                      <Controller
                        name='identificationNumber'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...register('identificationNumber')}
                            {...field}
                            fullWidth
                            label='Identification Number'
                            error={!!errors.identificationNumber}
                            onChange={e => {
                              field.onChange(e)
                              setValue('identificationNumber', e?.target?.value || '')
                            }}
                            helperText={
                              errors.identificationNumber &&
                              (errors.identificationNumber?.message as string | undefined)
                            }
                            required
                            onBlur={e => validateIndentificationNumber(e.target.value)}
                            inputProps={{ maxLength: 13 }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </LightBackground>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleDiscard}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ mr: 2 }}
              type='submit'
              disabled={!!errors?.email || !!errors?.mobileNumber || !!errors?.program || feeDetails?.length === 0}
            >
              GENERATE
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default GenerateReggieNumberDialog
