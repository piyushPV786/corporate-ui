import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField
} from '@mui/material'
import { PencilOutline } from 'mdi-material-ui'
import { Fragment, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import FallbackSpinner from 'src/@core/components/spinner'
import RequiredLabel from 'src/components/RequiredLabel'
import { userInformationStatus } from 'src/context/common'
import AlertBox from 'src/layouts/components/Alert'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import * as yup from 'yup'

interface ICorporateManagerAddDialogTypes {
  isEdit?: boolean
  managerData?: any
  actions: {
    createManager?: (params: any) => Promise<void>
    updateManager?: (params: any, code: string) => Promise<void>
  }
}
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required(userInformationStatus.FirstNameRequired)
    .matches(/^[a-zA-z]*$/, userInformationStatus.FirstNameError),
  middleName: yup
    .string()
    .matches(/^[a-zA-Z]*$/, userInformationStatus.MiddleNameError)
    .notRequired(),
  lastName: yup
    .string()
    .required(userInformationStatus.LastNameRequired)
    .matches(/^[a-zA-z]*$/, userInformationStatus.LastNameError),
  email: yup.string().email().required(userInformationStatus.EmailRequired),
  mobileNumber: yup.string().required(userInformationStatus.MobileNumber),
  roles: yup
    .array()
    .of(yup.string())
    .min(1, userInformationStatus.RoleRequired)
    .required(userInformationStatus.RoleRequired)
})
const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  mobileCountryCode: '',
  roles: []
}

const ManagersTypesList = [
  { label: 'Account Manager', value: 'CE_Account_Manager' },
  { label: 'Project Manager', value: 'CE_Project_Manager' }
]

const CorporateManagerAddDialog = ({ isEdit, managerData, actions }: ICorporateManagerAddDialogTypes) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    trigger,
    formState: { errors, isDirty }
  } = useForm<FieldValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  })

  const setFormData = (managerData: IDynamicObject) => {
    const formData: IDynamicObject = {
      firstName: managerData.firstName,
      middleName: managerData.middleName ?? '',
      lastName: managerData.lastName,
      email: managerData.email,
      mobileNumber: managerData.mobileCountryCode + managerData.mobileNumber,
      mobileCountryCode: managerData.mobileCountryCode,
      roles: managerData.roles.map((role: any) => role.code)
    }

    reset(formData)
  }

  const handleOpen = () => {
    isEdit && managerData ? setFormData(managerData) : reset(defaultValues)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    reset(defaultValues)
  }

  const handleChange = (name: string, value: string | string[]) => {
    setValue(name, value)
    clearErrors(name)
    trigger(name)
  }

  const onSubmit = async (data: FieldValues) => {
    setLoading(true)
    reset({}, { keepValues: true })
    const managerDetails = {
      firstName: data.firstName.trim(),
      middleName: data.middleName?.trim() || '',
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      mobileNumber: data.mobileNumber.slice(data.mobileCountryCode.length),
      mobileCountryCode: data.mobileCountryCode,
      roles: data.roles
    }
    if (!isEdit && !managerDetails.middleName) {
      delete managerDetails.middleName
    }
    if (isEdit && !!actions?.updateManager && !!managerData) {
      await actions.updateManager(managerDetails, managerData?.code)
    } else if (!!actions?.createManager) {
      await actions?.createManager(managerDetails)
    }
    setLoading(false)
    handleClose()
  }

  const hasUnsavedChanges =
    watch('firstName') !== managerData?.firstName ||
    watch('middleName') !== (managerData?.middleName ?? '') ||
    watch('lastName') !== managerData?.lastName ||
    watch('email') !== managerData?.email ||
    watch('mobileNumber') !== managerData?.mobileCountryCode + managerData?.mobileNumber ||
    JSON.stringify(watch('roles')) !== JSON.stringify(managerData?.roles?.map((role: any) => role.code))

  const isUpdateRequired = isEdit && hasUnsavedChanges

  return (
    <Fragment>
      {isEdit ? (
        <IconButton
          onClick={handleOpen}
          size='small'
          color='primary'
          sx={{ border: theme => `1px solid ${theme.palette.primary.main}` }}
        >
          <PencilOutline sx={{ fontSize: 21 }} />
        </IconButton>
      ) : (
        <Button variant='contained' size='small' onClick={handleOpen}>
          Add Manager
        </Button>
      )}

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        maxWidth='md'
        sx={{ '& .MuiDialog-paper': { p: 10 } }}
      >
        <DialogTitle textAlign='center'>
          <strong>{isEdit ? 'Edit' : 'Add'} Manager</strong>
        </DialogTitle>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <FallbackSpinner />
        </Backdrop>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={4}>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='First Name' />}
                      error={!!errors?.firstName}
                      helperText={errors?.firstName && (errors?.firstName?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='middleName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Middle Name'
                      error={!!errors?.middleName}
                      helperText={errors?.middleName && (errors?.middleName?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='Last Name' />}
                      error={!!errors?.lastName}
                      helperText={errors?.lastName && (errors?.lastName?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} mt={5}>
                <Grid spacing={4} container>
                  <Grid item xs={6}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<RequiredLabel label='Email' />}
                          fullWidth
                          error={errors.email as boolean | undefined}
                          helperText={errors.email && (errors.email?.message as string | undefined)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                            onChange={(data, countryData: { dialCode: string }) => {
                              data && handleChange('mobileNumber', data)
                              data && handleChange('mobileCountryCode', countryData?.dialCode)
                            }}
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
                            {errors.mobileNumber && (errors.mobileNumber?.message as string | undefined)}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} mt={5}>
                    <FormControl fullWidth error={!!errors.roles}>
                      <Controller
                        name='roles'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={ManagersTypesList}
                            multiple={true}
                            value={ManagersTypesList.filter(option => field.value?.includes(option.value)) || []}
                            onChange={(e, newValue) => {
                              const selectedValues = newValue.map(option => option.value)
                              handleChange('roles', selectedValues)
                            }}
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Roles'
                                error={errors?.roles as boolean | undefined}
                                helperText={errors?.roles?.message as string | undefined}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {isUpdateRequired ? (
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
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              CANCEL
            </Button>
            <Button type='submit' variant='contained' disabled={isEdit ? !isUpdateRequired : !isDirty}>
              {isEdit ? 'Save' : 'Add Manager'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}
export default CorporateManagerAddDialog
