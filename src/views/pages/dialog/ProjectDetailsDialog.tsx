import React, { ChangeEvent, forwardRef, ReactNode, useEffect, useState } from 'react'
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

import { useForm, Controller } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CommonService, DashboardService } from 'src/service'
import { IAccountManagerList, IProjectManagerList, commonListTypes } from 'src/types/apps/dataTypes'
import { status } from 'src/context/common'
import { IProject } from 'src/views/apps/project/TabDetails'
import { successToast } from 'src/components/Toast'
import AlertBox from 'src/layouts/components/Alert'
import RequiredLabel from 'src/components/RequiredLabel'

interface FormInputs {
  projectName: string
  projectCode: string
  corporateName: string
  projectManager: string
  accountManager: string
  programBusinessUnit: string
  typeOfNotificationReceived: string
  approvedProposal: boolean
  varianceDetails: string
  releaseOfNotification: string
  proposalSubmissionDate: DateType
}

interface DataParams {
  q: string
  status: any
  pageSize: number
  pageNumber: number
}

interface CustomInputProps {
  value: DateType | any
  label: string | ReactNode
  error: boolean
  onChange: (event: ChangeEvent) => void
}

interface propsType {
  open: boolean
  onClose: () => void
  projectData: IProject
  fetchProject: (id: string | number) => void
  accountManagerList: IAccountManagerList[]
  projectManagerList: IProjectManagerList[]
}

const defaultValues = {
  projectName: '',
  projectCode: '',
  corporateName: '',
  projectManager: '',
  accountManager: '',
  programBusinessUnit: '',
  typeOfNotificationReceived: '',
  approvedProposal: true,
  varianceDetails: '',
  releaseOfNotification: '',
  proposalSubmissionDate: null
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const ProjectDetailsDialog = ({
  open,
  onClose,
  projectData,
  fetchProject,
  accountManagerList,
  projectManagerList
}: propsType) => {
  const [programBusinessUnit, setprogrammeBusinessUnit] = useState<commonListTypes[]>([])
  const [corporateList, setCorporateList] = useState<commonListTypes[]>([])

  const getProgrammeBusinessUnit = async () => {
    const response = await CommonService.getProgrammeBusinessUnit()
    if (response?.statusCode === status?.successCode && response?.data?.length) {
      setprogrammeBusinessUnit(response?.data)
    }
  }
  const getCorporateList = async (params: DataParams) => {
    const response = await DashboardService?.getCorporateList(params)
    if (response?.status === 200 && response?.data?.data) {
      setCorporateList(response?.data?.data?.data)
    }
  }

  useEffect(() => {
    getProgrammeBusinessUnit()
    getCorporateList({
      q: '',
      pageSize: 100,
      pageNumber: 1,
      status: ''
    })
  }, [])

  // ** Hooks
  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })
  const handleClose = () => {
    onClose()
  }

  const onSubmit = async (data: any) => {
    const payload = {
      name: data?.projectName,
      code: data?.projectCode,
      projectManager: data?.projectManager,
      accountManager: data?.accountManager,
      corporateCode: data?.corporateName,
      programBusinessUnit: data?.programBusinessUnit,
      typeOfNotificationReceived: data?.typeOfNotificationReceived,
      submission: data?.approvedProposal === true || data?.approvedProposal === 'true',
      varianceDetails: data?.varianceDetails,
      releaseOfNotificationApprovedBy: data?.releaseOfNotification,
      proposalSubmissionDate: data?.proposalSubmissionDate
    }

    const response = await DashboardService.addUpdateProjectDetails(payload, projectData?.code)

    if (response?.code) {
      fetchProject(projectData?.code)
      successToast(`${data.projectName}Project details updated successfully`)
      handleClose()
    }
  }

  useEffect(() => {
    if (projectData) {
      reset({
        projectName: projectData?.name,
        projectCode: projectData.code,
        projectManager: projectData?.projectManager,
        accountManager: projectData?.accountManager,
        corporateName: projectData?.corporateEd?.code,
        programBusinessUnit: projectData?.projectDetails?.programBusinessUnit,
        typeOfNotificationReceived: projectData?.projectDetails?.typeOfNotificationReceived,
        approvedProposal: projectData?.projectDetails?.submission,
        varianceDetails: projectData?.projectDetails?.varianceDetails,
        releaseOfNotification: projectData?.projectDetails?.releaseOfNotificationApprovedBy,
        proposalSubmissionDate:
          projectData?.projectDetails && new Date(projectData?.projectDetails?.proposalSubmissionDate)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData])

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
      <DialogTitle textAlign={'center'}>Manage Project Details</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='projectName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Project Name' />}
                      placeholder='Leonard'
                      error={Boolean(errors.projectName)}
                      aria-describedby='projectName'
                    />
                  )}
                />
                {errors.projectName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='projectName'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='projectCode'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Project Code' />}
                      placeholder='Carter'
                      disabled
                      error={Boolean(errors.projectCode)}
                      aria-describedby='projectCode'
                    />
                  )}
                />
                {errors.projectCode && (
                  <FormHelperText sx={{ color: 'error.main' }} id='projectCode'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  {...register('corporateName', { required: true })}
                  style={{ width: '100%' }}
                  options={corporateList}
                  onChange={(_, value) => {
                    value && setValue('corporateName', value.code)
                    clearErrors('corporateName')
                  }}
                  value={corporateList?.find((i: commonListTypes) => i.code === watch('corporateName'))}
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

                {errors.corporateName && (
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
                  {...register('projectManager')}
                  style={{ width: '100%' }}
                  options={projectManagerList}
                  onChange={(_, value) => {
                    value && setValue('projectManager', value.code)
                    clearErrors('projectManager')
                  }}
                  value={projectManagerList?.find((i: IProjectManagerList) => i.code === watch('projectManager'))}
                  getOptionLabel={option => `${option?.firstName} ${option?.lastName}`}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Project Manager' />}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                {errors.projectManager && (
                  <FormHelperText sx={{ color: 'error.main' }} id='projectManager'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  {...register('accountManager')}
                  style={{ width: '100%' }}
                  options={accountManagerList}
                  onChange={(_, value) => {
                    value && setValue('accountManager', value.code)
                    clearErrors('accountManager')
                  }}
                  value={accountManagerList?.find((i: IAccountManagerList) => i.code === watch('accountManager'))}
                  getOptionLabel={option => `${option?.firstName} ${option?.lastName}`}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Account Manager' />}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                {errors.accountManager && (
                  <FormHelperText sx={{ color: 'error.main' }} id='accountManager'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth error={Boolean(errors.programBusinessUnit)}>
                <Autocomplete
                  fullWidth
                  {...register('programBusinessUnit')}
                  style={{ width: '100%' }}
                  options={programBusinessUnit}
                  onChange={(_, value) => {
                    value && setValue('programBusinessUnit', value.name)
                    clearErrors('programBusinessUnit')
                  }}
                  value={programBusinessUnit?.find((i: commonListTypes) => i.name === watch('programBusinessUnit'))}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Qualification Business Unit' />}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                />

                {errors.programBusinessUnit && (
                  <FormHelperText sx={{ color: 'error.main' }} id='programBusinessUnit'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='typeOfNotificationReceived'
                  control={control}
                  defaultValue={projectData?.programDetails?.typeOfNotificationReceived}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Type of Notification Received' />}
                      error={Boolean(errors.typeOfNotificationReceived)}
                      aria-describedby='typeOfNotificationReceived'
                    />
                  )}
                />
                {errors.typeOfNotificationReceived && (
                  <FormHelperText sx={{ color: 'error.main' }} id='typeOfNotificationReceived'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} mb={5}>
              <FormControl error={Boolean(errors.approvedProposal)}>
                <FormLabel sx={{ fontSize: '12px' }}>
                  <RequiredLabel label='Variation form original approved Proposal / Submission label=' />
                </FormLabel>
                <Controller
                  name='approvedProposal'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='gender' name='validation-basic-radio'>
                      <FormControlLabel
                        value={true}
                        label='Yes'
                        sx={errors.approvedProposal ? { color: 'error.main' } : null}
                        control={<Radio size='small' sx={errors.approvedProposal ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value={false}
                        label='No'
                        sx={errors.approvedProposal ? { color: 'error.main' } : null}
                        control={<Radio size='small' sx={errors.approvedProposal ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.approvedProposal && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-radio'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='varianceDetails'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Variance Details' />}
                      placeholder='Leonard'
                      error={Boolean(errors.varianceDetails)}
                      aria-describedby='varianceDetails'
                    />
                  )}
                />
                {errors.varianceDetails && (
                  <FormHelperText sx={{ color: 'error.main' }} id='varianceDetails'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <FormControl fullWidth>
                <Controller
                  name='releaseOfNotification'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={<RequiredLabel label='Release of Notification approved by' />}
                      placeholder='Leonard'
                      error={Boolean(errors.releaseOfNotification)}
                      aria-describedby='releaseOfNotification'
                    />
                  )}
                />
                {errors.releaseOfNotification && (
                  <FormHelperText sx={{ color: 'error.main' }} id='releaseOfNotification'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} mb={5}>
              <Controller
                name='proposalSubmissionDate'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      onKeyDown={e => {
                        e.preventDefault()
                      }}
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => onChange(e)}
                      placeholderText='DD/MM/YYYY'
                      dateFormat='dd/MM/yyyy'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label={<RequiredLabel label='Proposal Submission Date' />}
                          error={Boolean(errors.proposalSubmissionDate)}
                          aria-describedby='proposalSubmissionDate'
                        />
                      }
                    />
                  </DatePickerWrapper>
                )}
              />
              {errors.proposalSubmissionDate && (
                <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='proposalSubmissionDate'>
                  This field is required
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          {(projectData &&
            (projectData?.name !== watch('projectName') ||
              projectData.code !== watch('projectCode') ||
              projectData?.projectManager !== watch('projectManager'))) ||
          projectData?.accountManager !== watch('accountManager') ||
          projectData?.projectDetails?.programBusinessUnit !== watch('programBusinessUnit') ||
          projectData?.projectDetails?.typeOfNotificationReceived !== watch('typeOfNotificationReceived') ||
          projectData?.projectDetails?.submission !== watch('approvedProposal') ||
          projectData?.projectDetails?.varianceDetails !== watch('varianceDetails') ||
          projectData?.projectDetails?.releaseOfNotificationApprovedBy !== watch('releaseOfNotification') ? (
            <AlertBox
              sx={{ mb: 6 }}
              color='warning'
              variant={'filled ' as any}
              header='Unsaved Changes'
              message='You have made changes. Do you want to save or cancel them?'
              severity='warning'
            />
          ) : null}
        </DialogContent>

        <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={{ mr: 2 }} type='submit'>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProjectDetailsDialog
