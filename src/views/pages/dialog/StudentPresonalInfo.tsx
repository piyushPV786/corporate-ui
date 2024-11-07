// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Controller, useForm } from 'react-hook-form'

import FormControl from '@mui/material/FormControl'

import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import { DashboardService } from 'src/service'

// ** Icons Imports
import FileDocumentEdit from 'mdi-material-ui/FileDocumentEdit'
import { FormHelperText, TextField } from '@mui/material'
import { successToast } from 'src/components/Toast'
import { IListOfCommonTypes } from 'src/types/apps/dataTypes'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationPersonalSchema } from 'src/views/apps/project/projectstudent/schema'

interface Ipersonal {
  studentData: any
  getStudentDetailById: any
  listOf: IListOfCommonTypes
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

const EditInformation = ({ studentData, getStudentDetailById, listOf }: Ipersonal) => {
  const defaultValues = {
    firstName: studentData?.lead?.firstName,
    middleName: studentData?.lead?.middleName,
    lastName: studentData?.lead?.lastName,
    gender: studentData?.lead?.gender,
    dateOfBirth: studentData?.lead?.dateOfBirth,
    nationality: studentData?.lead?.nationality,

    //citizenship: studentData?.lead?.citizenship,
    ifOthersSpecifyTheCitizenship: studentData?.lead?.ifOthersSpecifyTheCitizenship,
    ifOtherSpecifyHomeLanguage: studentData?.lead?.ifOtherSpecifyHomeLanguage,
    race: studentData?.lead?.race,

    //ifOtherSpecifyEquityCode: studentData?.lead?.ifOtherSpecifyEquityCode,
    homeLanguage: studentData?.lead?.language,
    idType: studentData?.lead?.identificationDocumentType,
    idNo: studentData?.lead?.identificationNumber

    //socioEconomicStatusCode: studentData?.lead?.socioEconomicStatusCode,
    // disability: studentData?.lead?.disability,
    //medicalIssueIfAny: studentData?.lead?.medicalIssueIfAny
  }
  const {
    handleSubmit,
    watch,
    control,

    reset,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(validationPersonalSchema) })

  const [show, setShow] = useState(false)
  const [birthDate, setBirthDate] = useState<Date>()

  const onSubmit = async (data: any) => {
    const payload = {
      firstName: data?.firstName,
      middleName: data?.middleName,
      lastName: data?.lastName,
      gender: data?.gender,
      dateOfBirth: data?.dateOfBirth,
      nationality: data?.nationality,

      //citizenship: data?.citizenship,
      //ifOthersSpecifyTheCitizenship: data?.ifOthersSpecifyTheCitizenship,
      //ifOtherSpecifyHomeLanguage: data?.ifOtherSpecifyHomeLanguage,
      race: data?.race,

      //ifOtherSpecifyEquityCode: data?.ifOtherSpecifyEquityCode,
      language: data?.homeLanguage,

      //socioEconomicStatusCode: data?.socioEconomicStatusCode,
      //disability: data?.disability,
      //medicalIssueIfAny: data?.medicalIssueIfAny
      identificationDocumentType: data?.idType,
      identificationNumber: data?.idNo
    }

    const response = await DashboardService.addUpdateStudentPersonalInfo(payload, studentData?.applicationCode)

    if (response?.studentCode) {
      getStudentDetailById(studentData?.applicationCode)

      successToast(`Student Personal Info updated successfully`)
    }
    reset()
    setShow(false)
  }

  const onClose = () => {
    setShow(false)
  }

  useEffect(() => {
    setBirthDate(watch('dateOfBirth'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('dateOfBirth')])

  useEffect(() => {
    !!studentData && reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData, reset, !show])

  return (
    <Grid>
      <Box display='block'>
        <Button size='small' startIcon={<FileDocumentEdit />} variant='contained' onClick={() => setShow(true)}>
          Edit Info
        </Button>
      </Box>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && onClose()
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Personal Information
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
                      label='First Name'
                      fullWidth
                      error={!!errors?.firstName}
                      helperText={errors?.firstName?.message as string | undefined}
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
                      helperText={errors?.middleName?.message as string | undefined}
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
                      label='Last Name'
                      fullWidth
                      error={!!errors?.lastName}
                      helperText={errors?.lastName?.message as string | undefined}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='gender'
                    options={listOf?.gender ?? []}
                    renderInput={params => <TextField {...params} label='Gender' />}
                  />
                </FormControl>
                <FormHelperText error>{errors?.gender?.message as string | undefined}</FormHelperText>
              </Grid>

              <Grid item sm={4}>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        label='Date of Birth'
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
                                (errors?.dateOfBirth?.message as string)
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
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='nationality'
                    options={listOf?.nationality ?? []}
                    renderInput={params => <TextField {...params} label='Nationality' />}
                  />

                  <FormHelperText error>{errors?.nationality?.message as string | undefined}</FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='citizenship'
                    options={listOf?.citizenship ?? []}
                    renderInput={params => <TextField {...params} label='Citizenship' />}
                  />

                  <FormHelperText color='error'>{errors?.citizenship?.message as string | undefined}</FormHelperText>
                </FormControl>

                <Box>
                  {watch('citizenship') === 'OTHERS' ? (
                    <Grid item sm={12} sx={{ pl: 5, pt: 3 }}>
                      <Controller
                        name='ifOthersSpecifyTheCitizenship'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            error={!!errors.ifOthersSpecifyTheCitizenship}
                            fullWidth
                            label='if Others, Specify '
                            helperText={
                              errors.ifOthersSpecifyTheCitizenship &&
                              (errors.ifOthersSpecifyTheCitizenship?.message as boolean | undefined)
                            }
                          />
                        )}
                      />
                    </Grid>
                  ) : null}
                </Box>
              </Grid> */}
              <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='race'
                    options={listOf?.race ?? []}
                    renderInput={params => <TextField {...params} label='Race/Equity code' />}
                  />

                  <FormHelperText error>{errors?.race?.message as string | undefined}</FormHelperText>
                </FormControl>

                {/* <Box>
                  {watch('race') === 'OTHER' ? (
                    <Grid item sm={12} sx={{ pl: 5, pt: 3 }}>
                      <Controller
                        name='ifOtherSpecifyEquityCode'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            error={errors.ifOtherSpecifyRace as boolean | undefined}
                            fullWidth
                            label='if Others, Specify '
                            helperText={
                              errors.ifOtherSpecifyEquityCode &&
                              (errors.ifOtherSpecifyEquityCode?.message as string | undefined)
                            }
                          />
                        )}
                      />
                    </Grid>
                  ) : null}
                </Box> */}
              </Grid>
              <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='homeLanguage'
                    options={listOf?.language ?? []}
                    renderInput={params => <TextField {...params} label='Home language' />}
                  />

                  <FormHelperText error>{errors?.homeLanguage?.message as string | undefined}</FormHelperText>
                </FormControl>

                {/* <Box>
                  {watch('homeLanguage') === 'OTHER' ? (
                    <Grid item sm={12} sx={{ pl: 5, pt: 3 }}>
                      <Controller
                        name='ifOtherSpecifyHomeLanguage'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            error={errors.ifOtherSpecifyHomeLanguage as boolean | undefined}
                            fullWidth
                            label='if Others, Specify '
                            helperText={
                              errors.ifOtherSpecifyHomeLanguage &&
                              (errors.ifOtherSpecifyHomeLanguage?.message as string | undefined)
                            }
                          />
                        )}
                      />
                    </Grid>
                  ) : null}
                </Box> */}
              </Grid>

              {/* <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='socioEconomicStatusCode'
                    options={listOf?.socioeconomic ?? []}
                    renderInput={params => <TextField {...params} label='Socio Economic Status Code' />}
                  />

                  <FormHelperText color='error'>
                    {errors?.socioEconomicStatusCode?.message as string | undefined}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
              {/* <Grid item sm={4}>
                <FormControl fullWidth>
                  <ControlledAutocomplete
                    control={control}
                    name='disability'
                    options={listOf?.disability ?? []}
                    renderInput={params => <TextField {...params} label='Disability' />}
                  />

                  <FormHelperText color='error'>{errors?.disability?.message as string | undefined}</FormHelperText>
                </FormControl>
              </Grid> */}

              {/* <Grid item sm={4}>
                <Controller
                  name='medicalIssueIfAny'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Medical Issue'
                      fullWidth
                      placeholder='Medical Issue if any(option)'
                      InputLabelProps={{ shrink: true }}
                      error={errors.medicalIssueIfAny as boolean | undefined}
                      helperText={errors.medicalIssueIfAny && (errors.medicalIssueIfAny?.message as string | undefined)}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
            <Box sx={{ marginTop: 8 }}>
              <Box style={{ padding: '1rem', borderRadius: 10 }}>
                <Box>
                  <Typography sx={{ textAlign: 'center' }}>National ID Details</Typography>
                </Box>
                <Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '22px' }}>
                  <Grid item sm={5} sx={{ width: '100%' }}>
                    <ControlledAutocomplete
                      fullWidth
                      control={control}
                      name='idType'
                      options={listOf?.idType ?? []}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='ID Type'
                          error={errors.idType as boolean | undefined}
                          helperText={errors.idType && (errors.idType?.message as string | undefined)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item sm={5} sx={{ width: '100%' }}>
                    <Controller
                      name='idNo'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='ID Number'
                          fullWidth
                          error={errors.idNo as boolean | undefined}
                          helperText={errors.idNo && (errors.idNo?.message as string | undefined)}
                        />
                      )}
                    />
                  </Grid>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}
export default EditInformation
