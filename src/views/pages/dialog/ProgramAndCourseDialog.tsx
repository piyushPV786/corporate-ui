import React, { useEffect } from 'react'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DashboardService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import RequiredLabel from 'src/components/RequiredLabel'

interface propsType {
  open: boolean
  code: string
  courseTypeList: any
  programList: any
  onClose: () => void
  fetchProject: (id: string | number) => void
  projectData: any
  facilitatorList: any
}

const validationSchema = Yup.object({
  courseType: Yup.string().required('Course Type is required'),
  program: Yup.string().required('Program is required'),
  startDate: Yup.date().required('Start Date is required'),
  duration: Yup.number().required('Duration is required'),
  noOfStudent: Yup.number().required('Number of Students is required'),
  facilitator: Yup.array().min(1, 'At least one facilitator is required').required('Facilitator is required'),
  assessmentRequired: Yup.boolean().required('Assessment Required is required'),
  accreditationRequired: Yup.boolean().required('Accreditation Required is required'),
  customizationRequired: Yup.boolean().required('Customization Required is required')
})

const ProgramAndCourseDialog = ({
  open,
  onClose,
  code,
  fetchProject,
  courseTypeList,
  programList,
  facilitatorList,
  projectData
}: propsType) => {
  const defaultValues = {
    courseType: projectData?.courseType,
    program: projectData?.program,
    startDate: projectData?.programDetails?.startDate ? projectData?.programDetails?.startDate : new Date(),
    duration: projectData?.programDetails?.duration,
    noOfStudent: projectData?.noOfStudent,
    facilitator: projectData?.programDetails?.facilitator?.split(',') || [],
    assessmentRequired: projectData?.programDetails?.assessmentRequired ?? true,
    accreditationRequired: projectData?.programDetails?.accreditationRequired ?? true,
    customizationRequired: projectData?.programDetails?.customizationRequired ?? true,
    notes: projectData?.programDetails?.notes
  }

  // ** Hooks

  const {
    control,
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema) // Apply Yup validation schema
  })

  const handleClose = () => {
    onClose()
  }

  const onSubmit = async (data: any) => {
    const Data = { ...data, facilitator: data.facilitator.join(','), noOfStudent: Number(data?.noOfStudent) }
    await DashboardService?.editProgramAndCourseDetail(code, Data)
    handleClose()
    reset()
    fetchProject(code)
  }

  useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [open, projectData, reset])

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle textAlign={'center'}>Manage Module/Qualification Detail</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  {...register('courseType', { required: true })}
                  style={{ width: '100%' }}
                  options={courseTypeList}
                  onChange={(_, value) => {
                    value && setValue('courseType', value.code)
                    clearErrors('courseType')
                  }}
                  value={courseTypeList?.find((i: commonListTypes) => i.code === watch('courseType'))}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Corporate Name' />}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                {errors.courseType && (
                  <FormHelperText sx={{ color: 'error.main' }} id='corporateName'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  {...register('program', { required: true })}
                  style={{ width: '100%' }}
                  options={programList}
                  onChange={(_, value) => {
                    value && setValue('program', value.code)
                    clearErrors('program')
                  }}
                  value={programList?.find((i: commonListTypes) => i.code === watch('program'))}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Qualification' />}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                {errors.program && (
                  <FormHelperText sx={{ color: 'error.main' }} id='program'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='startDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      {' '}
                      <DatePicker
                        minDate={new Date()}
                        inputFormat='dd/MM/yyyy'
                        label={<RequiredLabel label='Start Date' />}
                        value={value || null}
                        onChange={newValue => onChange(newValue)}
                        renderInput={params => <TextField {...params} error={Boolean(errors.startDate)} />}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.startDate && (
                  <FormHelperText sx={{ color: 'error.main' }} id='startDate'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='duration'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label={<RequiredLabel label='Duration' />}
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.duration)}
                      aria-describedby='duration'
                      inputProps={{
                        onWheel: e => (e.target as HTMLInputElement).blur() // Cast target to HTMLInputElement
                      }}
                    />
                  )}
                />
                {errors.duration && (
                  <FormHelperText sx={{ color: 'error.main' }} id='duration'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='noOfStudent'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='No of Students'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.noOfStudent)}
                      aria-describedby='noOfStudent'
                      inputProps={{
                        onWheel: e => (e.target as HTMLInputElement).blur() // Cast target to HTMLInputElement
                      }}
                    />
                  )}
                />
                {errors.noOfStudent && (
                  <FormHelperText sx={{ color: 'error.main' }} id='noOfStudent'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sm={8} mb={5}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  fullWidth
                  {...register('facilitator', { required: true })}
                  style={{ width: '100%' }}
                  options={facilitatorList}
                  onChange={(_, value) => {
                    const selectedFacilitators = value.map(facilitator => facilitator.code)
                    setValue('facilitator', selectedFacilitators)
                    clearErrors('facilitator')
                  }}
                  value={facilitatorList?.filter((i: any) => watch('facilitator')?.includes(i.code))}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Facilitator' />}
                      variant='outlined'
                      error={Boolean(errors.facilitator)}
                      fullWidth
                    />
                  )}
                />

                {errors.facilitator && (
                  <FormHelperText sx={{ color: 'error.main' }} id='facilitator'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl error={Boolean(errors.assessmentRequired)}>
                <FormLabel sx={{ fontSize: '12px' }}>
                  <RequiredLabel label='Assessment Required' />
                </FormLabel>
                <Controller
                  name='assessmentRequired'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='gender' name='validation-basic-radio'>
                      <FormControlLabel
                        value={true}
                        label='Yes'
                        sx={errors.assessmentRequired ? { color: 'error.main' } : null}
                        control={<Radio size='small' sx={errors.assessmentRequired ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value={false}
                        label='No'
                        sx={errors.assessmentRequired ? { color: 'error.main' } : null}
                        control={<Radio size='small' sx={errors.assessmentRequired ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.assessmentRequired && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-radio'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl error={Boolean(errors.customizationRequired)}>
                <FormLabel sx={{ fontSize: '12px' }}>
                  <RequiredLabel label='Customisation Required' />
                </FormLabel>
                <Controller
                  name='customizationRequired'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='gender' name='validation-basic-radio'>
                      <FormControlLabel
                        value={true}
                        label='Yes'
                        sx={errors.customizationRequired ? { color: 'error.main' } : null}
                        control={
                          <Radio size='small' sx={errors.customizationRequired ? { color: 'error.main' } : null} />
                        }
                      />
                      <FormControlLabel
                        value={false}
                        label='No'
                        sx={errors.customizationRequired ? { color: 'error.main' } : null}
                        control={
                          <Radio size='small' sx={errors.customizationRequired ? { color: 'error.main' } : null} />
                        }
                      />
                    </RadioGroup>
                  )}
                />
                {errors.customizationRequired && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-radio'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl error={Boolean(errors.accreditationRequired)}>
                <FormLabel sx={{ fontSize: '12px' }}>
                  <RequiredLabel label='Accreditation Required' />
                </FormLabel>
                <Controller
                  name='accreditationRequired'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='gender' name='validation-basic-radio'>
                      <FormControlLabel
                        value={true}
                        label='Yes'
                        sx={errors.accreditationRequired ? { color: 'error.main' } : null}
                        control={
                          <Radio size='small' sx={errors.accreditationRequired ? { color: 'error.main' } : null} />
                        }
                      />
                      <FormControlLabel
                        value={false}
                        label='No'
                        sx={errors.accreditationRequired ? { color: 'error.main' } : null}
                        control={
                          <Radio size='small' sx={errors.accreditationRequired ? { color: 'error.main' } : null} />
                        }
                      />
                    </RadioGroup>
                  )}
                />
                {errors.accreditationRequired && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-radio'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='notes'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Notes(if any)'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.notes)}
                      aria-describedby='notes'
                    />
                  )}
                />
                {errors.notes && (
                  <FormHelperText sx={{ color: 'error.main' }} id='varianceDetails'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color='primary' type='submit'>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProgramAndCourseDialog
