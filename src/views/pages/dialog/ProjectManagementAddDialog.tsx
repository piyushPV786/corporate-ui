import { yupResolver } from '@hookform/resolvers/yup'
import {
  Backdrop,
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
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { PencilOutline } from 'mdi-material-ui'
import { Fragment, useMemo, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import FallbackSpinner from 'src/@core/components/spinner'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import RequiredLabel from 'src/components/RequiredLabel'
import { projectMessages, status } from 'src/context/common'
import AlertBox from 'src/layouts/components/Alert'
import { AcademicService, StudentService } from 'src/service'
import { ICommonParams } from 'src/types/apps/common'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import * as yup from 'yup'

interface IProjectManagementAddDialogTypes {
  isEdit?: boolean
  projectData?: InvoiceType
  actions: {
    createProject?: (params: any) => void
    updateProject?: (params: any, code: string) => void
  }
  commonList: {
    programList: commonListTypes[]
    corporateList: commonListTypes[]
    courseTypeList: commonListTypes[]
    accountManagerList: commonListTypes[]
    projectManagerList: commonListTypes[]
  }
}
const schema = yup.object().shape({
  name: yup.string().required(projectMessages.name),
  code: yup
    .string()
    .matches(/^[\w@.-]*$/, `Special characters are not allowed in the Project Code`)
    .required(projectMessages.code),
  corporateEdCode: yup.string().required(projectMessages.corporateEdCode),
  projectManager: yup.string().required(projectMessages.projectManager),
  accountManager: yup.string().required(projectMessages.accountManager),
  program: yup.string().required(projectMessages.program),
  courseType: yup.string().required(projectMessages.courseType),
  studyMode: yup.string().required(projectMessages.studyMode),
  isActive: yup.boolean().required()
})
const defaultValues = {
  name: '',
  code: '',
  corporateEdCode: '',
  projectManager: '',
  accountManager: '',
  program: '',
  courseType: '',
  isActive: true,
  studyMode: ''
}

const ProjectManagementAddDialog = ({ isEdit, projectData, actions, commonList }: IProjectManagementAddDialogTypes) => {
  const [open, setOpen] = useState<boolean>(false)
  const [studyMode, setStudyMode] = useState<ICommonParams[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const {
    handleSubmit,
    watch,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty }
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  })

  const setFormData = (projectData: IDynamicObject) => {
    let formData: IDynamicObject = {}
    Object.keys(defaultValues).map(item => {
      formData = { ...formData, [item]: projectData[item] }
    })
    formData.corporateEdCode = projectData?.corporateEd?.code

    reset(formData)
  }

  const handleOpen = () => {
    isEdit && projectData ? setFormData(projectData) : reset(defaultValues)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setStudyMode([])
    reset(defaultValues)
  }

  // Get study modes behalf of progCode

  const getProgramList = async (code: number | string) => {
    setLoading(true)
    const response = await AcademicService?.getProgramByCode(code)
    setStudyMode(response?.studyModeCodes)
    setLoading(false)
  }

  useMemo(() => {
    watch('program') && getProgramList(watch('program'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('program')])
  const checkDuplicateProject = async (code: string, projectId?: number) => {
    const response = await StudentService?.checkDuplicateProject({ code, projectId })

    if (response?.statusCode === status.successCode && !!response?.data) {
      setError('code', { type: 'custom', message: response?.data?.message })
    } else {
      clearErrors('code')
    }

    return response?.data?.message
  }
  const checkDuplicateProjectCode = (data: FieldValues) => {
    return !!data?.code
      ? isEdit
        ? checkDuplicateProject(data.code, projectData?.id)
        : checkDuplicateProject(data.code)
      : isEdit
        ? checkDuplicateProject(watch('code'), projectData?.id)
        : checkDuplicateProject(watch('code'))
  }

  const onSubmit = async (data: FieldValues) => {
    reset({}, { keepValues: true })
    let isDuplicateMsg: boolean | string = true
    isDuplicateMsg = await checkDuplicateProjectCode(data)
    if (!!isDuplicateMsg) {
      setError('code', { type: 'custom', message: String(isDuplicateMsg) })
    } else {
      !!actions?.updateProject && !!projectData && actions?.updateProject(data, projectData?.code)
      !!actions?.createProject && actions?.createProject(data)
      handleClose()
    }
  }

  return (
    <Fragment>
      {isEdit ? (
        <IconButton
          onClick={handleOpen}
          size='small'
          color='primary'
          sx={{ border: theme => `1px solid ${theme.palette.primary.main}` }}
        >
          <PencilOutline />
        </IconButton>
      ) : (
        <Button variant='contained' size='small' onClick={handleOpen}>
          Add Project
        </Button>
      )}

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        maxWidth='sm'
        sx={{ '& .MuiDialog-paper': { p: 10 } }}
      >
        <DialogTitle textAlign='center'>
          <strong>{isEdit ? 'Edit' : 'Add'} Project</strong>
        </DialogTitle>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <FallbackSpinner />
        </Backdrop>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Controller
                  name='code'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='Project Code' />}
                      onBlur={checkDuplicateProjectCode}
                      error={!!errors?.code}
                      helperText={errors?.code && (errors?.code?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='Project Name' />}
                      error={errors?.name as boolean | undefined}
                      helperText={errors?.name && (errors?.name?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  options={commonList.corporateList}
                  name='corporateEdCode'
                  control={control}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Corporate Name' />}
                      variant='outlined'
                      fullWidth
                      error={!!errors?.corporateEdCode}
                      helperText={errors?.corporateEdCode?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledAutocomplete
                  options={commonList.projectManagerList}
                  name='projectManager'
                  control={control}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Project Manager' />}
                      variant='outlined'
                      fullWidth
                      error={!!errors?.projectManager}
                      helperText={errors?.projectManager?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledAutocomplete
                  options={commonList.accountManagerList}
                  name='accountManager'
                  control={control}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={<RequiredLabel label='Account Manager' />}
                      variant='outlined'
                      fullWidth
                      error={!!errors?.accountManager}
                      helperText={errors?.accountManager?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} mt={10}>
                <Grid spacing={4} container>
                  <Grid item xs={12} textAlign='center'>
                    <Typography variant='h6'>Qualification Details</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <ControlledAutocomplete
                      options={commonList.courseTypeList}
                      name='courseType'
                      control={control}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Module Type' />}
                          variant='outlined'
                          fullWidth
                          error={!!errors?.courseType}
                          helperText={errors?.courseType?.message as string | undefined}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ControlledAutocomplete
                      options={commonList.programList}
                      name='program'
                      control={control}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Qualification' />}
                          variant='outlined'
                          fullWidth
                          error={!!errors?.program}
                          helperText={errors?.program?.message as string | undefined}
                        />
                      )}
                    />
                  </Grid>
                  {studyMode?.length > 0 && (
                    <Grid item sm={12} xs={12}>
                      <FormControl component='fieldset'>
                        <FormLabel id='demo-controlled-radio-buttons-group'>Study Modes</FormLabel>
                        <Controller
                          rules={{ required: true }}
                          control={control}
                          name='studyMode'
                          render={({ field }) => (
                            <RadioGroup row {...field}>
                              {studyMode?.map(item => (
                                <FormControlLabel
                                  key={item?.id}
                                  value={item?.code}
                                  control={<Radio />}
                                  label={item?.name}
                                />
                              ))}
                            </RadioGroup>
                          )}
                        />
                        {errors?.studyMode && (
                          <FormHelperText error>{errors?.studyMode?.message as string | undefined}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} display='flex' justifyContent='center'>
                <Controller
                  name='isActive'
                  control={control}
                  render={({ field }) => (
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <Typography>In active</Typography>
                      <Switch {...field} defaultChecked={field.value} />
                      <Typography>Active</Typography>
                    </Stack>
                  )}
                />
              </Grid>
            </Grid>
            {isEdit &&
              (watch('code') !== projectData?.code ||
              watch('name') !== projectData?.name ||
              watch('corporateEdCode') !== projectData?.corporateEd?.code ||
              watch('projectManager') !== projectData?.projectManager ||
              watch('accountManager') !== projectData?.accountManager ||
              watch('courseType') !== projectData?.courseType ||
              watch('program') !== projectData?.program ||
              watch('isActive') !== projectData?.isActive ? (
                <AlertBox
                  sx={{ mb: 6 }}
                  color='warning'
                  variant={'filled ' as any}
                  header='Unsaved Changes'
                  message='You have made changes. Do you want to save or cancel them?'
                  severity='warning'
                />
              ) : null)}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              CANCEL
            </Button>
            <Button type='submit' variant='contained' disabled={!isDirty}>
              {isEdit ? 'Save' : 'Add Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}
export default ProjectManagementAddDialog
