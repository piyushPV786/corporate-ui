// ** MUI Imports
import Grid from '@mui/material/Grid'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/material.css'

import { Box, Typography, TextField, Card, FormHelperText, Accordion, AccordionDetails } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import { AccountCircleOutline } from 'mdi-material-ui'
import { CommonService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { nationalityStatusEnum } from 'src/constants/constants'
import RequiredLabel from 'src/components/RequiredLabel'

interface Ipersonal {
  errors: any
  watch: UseFormReturn['watch']
  register: UseFormReturn['register']
  clearErrors: UseFormReturn['clearErrors']
  setValue: UseFormReturn['setValue']
  control: UseFormReturn['control']
}
const MIN_AGE = 16
const MAX_AGE = 100

// Calculate the minimum and maximum dates
const today = new Date()
const maxDate = new Date(today)
maxDate.setFullYear(today.getFullYear() - MIN_AGE)
const minDate = new Date(today)
minDate.setFullYear(today.getFullYear() - MAX_AGE)

const currentDate = new Date()

const ageValidator = (dateOfBirth: any) => {
  const selectedDate = new Date(dateOfBirth)
  if (!(selectedDate instanceof Date && !isNaN(selectedDate.getTime()))) {
    return 'Please enter a valid date'
  }
  const age = currentDate.getFullYear() - selectedDate.getFullYear()
  if (age < MIN_AGE || age > MAX_AGE) {
    return `Age must be between ${MIN_AGE} and ${MAX_AGE} years old.`
  } else {
    return false
  }
}

export const PersonalInformationDetail = ({ errors, setValue, watch, control }: Ipersonal) => {
  const [birthDate, setBirthDate] = useState<Date | null | undefined>()
  const [gender, setGender] = useState<Array<commonListTypes>>([])
  const [nationalityStatus, setNationalityStatus] = useState<Array<commonListTypes>>([])
  const [nationality, setNationality] = useState<Array<commonListTypes>>([])
  const [race, setRace] = useState<Array<commonListTypes>>([])
  const [language, setLanguage] = useState<Array<commonListTypes>>([])
  const [identificationDocumentType, setIdentificationDocumentType] = useState<Array<commonListTypes>>([])

  const nationalityStatusWatch = watch('nationalityStatus')

  const getGenderList = async () => {
    const response = await CommonService?.getGenderList()
    if (response?.data?.data?.length > 0) {
      setGender(response?.data?.data)
    }
  }

  const getNationalityStatusList = async () => {
    const nationalResponse = await CommonService?.getNationalityStatus()
    if (nationalResponse?.data?.data?.length > 0) {
      setNationalityStatus(nationalResponse?.data?.data)
    }
  }

  const getNationalityList = async () => {
    const nationalResponse = await CommonService?.getNationalityList()
    if (nationalResponse?.data?.data?.length > 0) {
      setNationality(nationalResponse?.data?.data)
    }
  }

  const getRaceList = async () => {
    const raceResponse = await CommonService?.getRace()
    if (raceResponse?.data?.data?.length > 0) {
      setRace(raceResponse?.data?.data)
    }
  }

  const getLanguageList = async () => {
    const languageResponse = await CommonService?.getLanguage()
    if (languageResponse?.data?.data?.length > 0) {
      setLanguage(languageResponse?.data?.data)
    }
  }

  const getIdentificationTypeList = async () => {
    const raceResponse = await CommonService.identificationType({ projectIdentificationType: true })
    if (raceResponse?.data?.data?.length > 0) {
      setIdentificationDocumentType(raceResponse?.data?.data)
    }
  }

  const countryCodeContact = (fieldName: string, data: any, dialCode: string) => {
    data && setValue(fieldName, data)
    data && setValue(`${fieldName}CountryCode`, dialCode)
  }

  useEffect(() => {
    getGenderList()
    getNationalityStatusList()
    getNationalityList()
    getRaceList()
    getLanguageList()
    getIdentificationTypeList()
  }, [])
  useEffect(() => {
    setBirthDate(watch('dateOfBirth'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('dateOfBirth')])

  useEffect(() => {
    if (nationalityStatusWatch) {
      setValue('permanentResident', '')
      if (nationalityStatusWatch === nationalityStatusEnum.PRSA) {
        setValue('permanentResident', nationalityStatusEnum.SA)
      } else if (nationalityStatusWatch === nationalityStatusEnum.SA) {
        setValue('nationality', nationalityStatusEnum.SA)
      } else {
        setValue('nationality', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalityStatusWatch])

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <Grid sx={{ pl: 2, pt: 0 }}>
            <Box sx={{ pt: 5, pb: 5 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                <AccountCircleOutline sx={{ mr: 2 }} color='primary' />
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={8} sx={{ p: 10, pt: 2 }}>
              <Grid item sm={4}>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='First Name' />}
                      fullWidth
                      error={!!errors?.firstName}
                      helperText={errors?.firstName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4}>
                <Controller
                  name='middleName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Middle Name'
                      placeholder='Middle Name(Optional)'
                      fullWidth
                      error={!!errors?.middleName}
                      helperText={errors?.middleName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4}>
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Last Name' />}
                      fullWidth
                      error={!!errors?.lastName}
                      helperText={errors?.lastName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4}>
                <ControlledAutocomplete
                  control={control}
                  name='gender'
                  options={gender}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='Gender' />} />}
                />
              </Grid>

              <Grid item sm={4}>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        label={<RequiredLabel label='Date of Birth' />}
                        inputFormat='dd/MM/yyyy'
                        minDate={minDate}
                        maxDate={maxDate}
                        disableFuture
                        renderInput={params => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { error, ...rest } = { ...params }

                          return (
                            <TextField
                              fullWidth
                              {...rest}
                              error={
                                birthDate === null ||
                                (birthDate && ((ageValidator(birthDate) || !!errors?.dateOfBirth) as any))
                              }
                              helperText={
                                (birthDate === null ? 'Date is required' : birthDate && ageValidator(birthDate)) ||
                                errors?.dateOfBirth?.message
                              }
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: theme => theme.palette.primary.main
                                }
                              }}
                            />
                          )
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item sm={4}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Email' />}
                      fullWidth
                      error={errors.email}
                      helperText={errors.email && errors.email?.message}
                    />
                  )}
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
                        onChange={(data, countryData: { dialCode: string }) =>
                          countryCodeContact('mobileNumber', data, countryData?.dialCode)
                        }
                        country={'za'}
                        countryCodeEditable={false}
                        placeholder='Enter phone number'
                        specialLabel={'Mobile Number'}
                        inputStyle={{
                          background: 'none',
                          width: '100%'
                        }}
                        containerClass='phone-number-required'
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {errors.mobileNumber && errors.mobileNumber?.message}
                      </FormHelperText>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item sm={4}>
                <ControlledAutocomplete
                  control={control}
                  name='race'
                  options={race}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='Race/Equity code' />} />}
                />
              </Grid>
              <Grid item sm={4}>
                <ControlledAutocomplete
                  control={control}
                  name='homeLanguage'
                  options={language}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='Home Language' />} />}
                />
              </Grid>
              <Grid item sm={12}>
                <ControlledAutocomplete
                  control={control}
                  name='nationalityStatus'
                  options={nationalityStatus}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='Nationality Status' />} />}
                />
                <Accordion expanded={!!nationalityStatusWatch} sx={{ boxShadow: 'none' }}>
                  <AccordionDetails>
                    {nationalityStatusWatch && (
                      <Grid container spacing={8}>
                        {nationalityStatusWatch === nationalityStatusEnum.PRSA && (
                          <Grid item sm={6}>
                            <ControlledAutocomplete
                              control={control}
                              name='permanentResident'
                              options={nationalityStatus}
                              disabled={true}
                              renderInput={params => (
                                <TextField {...params} label={<RequiredLabel label='Permanent Resident' />} />
                              )}
                            />
                          </Grid>
                        )}

                        <Grid item sm={6}>
                          <ControlledAutocomplete
                            control={control}
                            name='nationality'
                            options={nationality}
                            renderInput={params => (
                              <TextField {...params} label={<RequiredLabel label='Nationality' />} />
                            )}
                            disabled={nationalityStatusWatch === nationalityStatusEnum.SA}
                          />
                        </Grid>
                        <Grid item sm={6}>
                          <ControlledAutocomplete
                            control={control}
                            name='identificationDocumentType'
                            options={identificationDocumentType}
                            renderInput={params => (
                              <TextField {...params} label={<RequiredLabel label='Identification Document Type' />} />
                            )}
                          />
                        </Grid>
                        {watch('identificationDocumentType') === 'PASPORT' && (
                          <Grid item sm={6}>
                            <Controller
                              name='passportExpiryDate'
                              control={control}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    {...field}
                                    label={<RequiredLabel label='Expiry Date' />}
                                    inputFormat='dd/MM/yyyy'
                                    value={field.value || null}
                                    renderInput={params => {
                                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                      const { error, ...rest } = { ...params }

                                      return (
                                        <TextField
                                          fullWidth
                                          {...rest}
                                          sx={{
                                            '& .MuiSvgIcon-root': {
                                              color: theme => theme.palette.primary.main
                                            }
                                          }}
                                          error={!!errors?.passportExpiryDate}
                                          helperText={errors?.passportExpiryDate?.message}
                                        />
                                      )
                                    }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                        )}
                        <Grid item sm={6}>
                          <Controller
                            name='identificationNumber'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={<RequiredLabel label='Identification Number' />}
                                fullWidth
                                error={!!errors?.identificationNumber}
                                helperText={errors?.identificationNumber?.message}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  )
}
