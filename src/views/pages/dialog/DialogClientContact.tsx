// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import 'react-phone-input-2/lib/material.css'
import PhoneInput from 'react-phone-input-2'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { ClientContactDetails } from 'src/context/common'
import { Autocomplete, FormHelperText, IconButton } from '@mui/material'
import { PencilOutline } from 'mdi-material-ui'
import AlertBox from 'src/layouts/components/Alert'
import { IClientContact } from 'src/types/apps/invoiceTypes'
import RequiredLabel from 'src/components/RequiredLabel'

interface IDialogClientContactProps {
  data?: IClientContact
  title: string
  projectId?: string | number | undefined
  createClientContact?: (arg: IClientContact) => void
  handleEdit?: (arg: IClientContact, id?: number) => void
}

type FormFields =
  | 'title'
  | 'firstName'
  | 'lastName'
  | 'mobileCountryCode'
  | 'telephoneCountryCode'
  | 'mobileNumber'
  | 'telephoneNumber'
  | 'email'
  | 'department'
  | 'designation'
  | 'relationshipOwner'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogClientContact = ({ title, data, createClientContact, handleEdit }: IDialogClientContactProps) => {
  const [show, setShow] = useState<boolean>(false)
  const schema = yup.object().shape({
    title: yup.string().required(ClientContactDetails.TitleRequired),
    firstName: yup
      .string()
      .required(ClientContactDetails.FirstNameRequired)
      .matches(/^[a-zA-z]*$/, ClientContactDetails.FirstNameError),
    lastName: yup
      .string()
      .required(ClientContactDetails.LastNameRequired)
      .matches(/^[a-zA-z]*$/, ClientContactDetails.LastNameError),
    mobileNumber: yup
      .string()
      .required(ClientContactDetails.MobileRequired)
      .test('is-valid-telephone', ClientContactDetails.mobileNumberLength, function (value) {
        const { mobileCountryCode } = this.parent
        const mobileNumberWithoutCode = value?.replace(mobileCountryCode || '', '') || ''

        return mobileNumberWithoutCode.length >= 6
      }),
    mobileCountryCode: yup.string(),
    telephoneNumber: yup
      .string()
      .test('is-valid-telephone', ClientContactDetails.telephoneNumberLength, function (value) {
        const { telephoneCountryCode } = this.parent
        const telephoneNumberWithoutCode = value?.replace(telephoneCountryCode || '', '') || ''
        if(telephoneNumberWithoutCode.length === 0){
          return true
        }else{
          return telephoneNumberWithoutCode.length >= 6
        }
      }),
    telephoneCountryCode: yup.string(),
    email: yup.string().email().required(ClientContactDetails.EmailRequired),
    department: yup
      .string()
      .required(ClientContactDetails.DepartmentRequired)
      .matches(/^[a-zA-Z0-9 ]*$/, ClientContactDetails.DepartmentError),
    designation: yup.string().required(ClientContactDetails.DesignationRequired),
    relationshipOwner: yup.string().required(ClientContactDetails.RelationshipRequired)
  })

  const Title = [{ title: 'Mr.' }, { title: 'Miss' }, { title: 'Mrs.' }, { title: 'Ms.' }, { title: 'Dr.' }]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    trigger,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      mobileCountryCode: '',
      telephoneNumber: '',
      telephoneCountryCode: '',
      email: '',
      department: '',
      designation: '',
      relationshipOwner: ''
    },
    resolver: yupResolver(schema)
  })

  const handleChange = (name: FormFields, value: string) => {
    setValue(name, value)
    clearErrors(name)
    trigger(name)
  }

  const onSubmit = (param: any) => {
    const payload = {
      ...param,
      mobileNumber: param.mobileNumber.slice(param.mobileCountryCode.length, param.mobileNumber.length),
      telephoneNumber: param.telephoneNumber.slice(param.telephoneCountryCode.length, param.telephoneNumber.length)
    }

    createClientContact && createClientContact(payload)
    handleEdit && handleEdit(payload, data?.id)
    setShow(false)
    reset()
  }

  const handleOpen = () => {
    setShow(true)
    if (data) {
      setValue('mobileNumber', data.mobileCountryCode + data.mobileNumber)
      setValue('telephoneNumber', data.telephoneCountryCode + data.telephoneNumber)
    }
  }

  const handleAddOpen = () => {
    setShow(true)
    setValue('mobileNumber', '')
    setValue('telephoneNumber', '')
  }

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        mobileCountryCode: data.mobileCountryCode,
        telephoneNumber: data.telephoneNumber,
        telephoneCountryCode: data.telephoneCountryCode,
        email: data.email,
        department: data.department,
        designation: data.designation,
        relationshipOwner: data.relationshipOwner
      })
    }
  }, [data])

  return (
    <Grid>
      <Box>
        {data ? (
          <Box>
            <IconButton
              onClick={handleOpen}
              size='small'
              component='a'
              color='primary'
              sx={{ textDecoration: 'none', mr: 2, border: '1px solid green' }}
            >
              <PencilOutline />
            </IconButton>
          </Box>
        ) : (
          <Button size='small' variant='contained' onClick={handleAddOpen} sx={{ color: 'white' }}>
            <Typography sx={{ color: 'white' }}>Add Contact</Typography>
          </Button>
        )}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 8, px: { xs: 4, sm: 9 }, pt: { xs: 8, sm: 10.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                {title} Contact
              </Typography>
            </Box>
            <Grid
              container
              spacing={6}
              sx={{
                '& .special-label': {
                  color: theme => theme.palette.customColors.main,
                  background: theme => theme.palette.background.paper
                }
              }}
            >
              <Grid item sm={2} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    fullWidth
                    id='title'
                    {...register('title')}
                    style={{ width: '100%' }}
                    options={Title}
                    onChange={(_, value) => {
                      value ? handleChange('title', value.title) : handleChange('title', '')
                    }}
                    getOptionLabel={option => option?.title?.toString() ?? ''}
                    defaultValue={{ title: watch('title') }}
                    renderInput={params => (
                      <TextField {...params} label={<RequiredLabel label='Title' />} variant='outlined' fullWidth />
                    )}
                  />
                  {errors.title && <FormHelperText error>{errors.title?.message as string | undefined}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item sm={5} xs={12}>
                <TextField
                  {...register('firstName')}
                  fullWidth
                  defaultValue={data?.firstName}
                  label={<RequiredLabel label='First Name' />}
                  placeholder='First Name '
                  onChange={e => handleChange('firstName', e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName && errors.firstName?.message}
                />
              </Grid>

              <Grid item sm={5} xs={12}>
                <TextField
                  {...register('lastName')}
                  fullWidth
                  label={<RequiredLabel label='Last Name' />}
                  placeholder='Last Name'
                  defaultValue={data?.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName && errors.lastName?.message}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
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
                    countryCodeEditable={true}
                    placeholder='Enter Mobile Number'
                    specialLabel={'Mobile Number'}
                    value={watch('mobileNumber') || '+27'}
                    {...register('mobileNumber')}
                    onChange={(data, countryData: { dialCode: string }) => {
                      data && handleChange('mobileNumber', data)
                      data && handleChange('mobileCountryCode', countryData?.dialCode)
                    }}
                    inputStyle={{
                      borderColor: errors.mobileNumber ? 'red' : 'initial',
                      borderRadius: '10px',
                      background: 'none',
                      width: '100%'
                    }}
                    containerClass='phone-number-required'
                  />
                  <FormHelperText error>
                    {errors.mobileNumber && (errors.mobileNumber?.message as string | undefined)}
                  </FormHelperText>
                </Box>
              </Grid>
              <Grid item sm={4} xs={12}>
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
                    placeholder='Enter Telephone number'
                    specialLabel={'Telephone Number'}
                    value={watch('telephoneNumber') || '+27'}
                    {...register('telephoneNumber')}
                    onChange={(data, countryData: { dialCode: string }) => {
                      data && handleChange('telephoneNumber', data)
                      data && handleChange('telephoneCountryCode', countryData?.dialCode)
                    }}
                    inputStyle={{
                      borderColor: errors.telephoneNumber ? 'red' : 'initial',
                      borderRadius: '10px',
                      background: 'none',
                      width: '100%'
                    }}
                    containerClass='phone-number-required'
                  />
                  <FormHelperText error>
                    {errors.telephoneNumber && (errors.telephoneNumber?.message as string | undefined)}
                  </FormHelperText>
                </Box>
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label={<RequiredLabel label='Email' />}
                  placeholder='Email'
                  defaultValue={data?.email}
                  onChange={event => {
                    handleChange('email', event.target.value)
                  }}
                  error={!!errors.email}
                  helperText={errors.email && errors.email?.message}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register('department')}
                  fullWidth
                  label={<RequiredLabel label='Department' />}
                  placeholder='Department'
                  defaultValue={data?.department}
                  onChange={event => {
                    handleChange('department', event.target.value)
                  }}
                  error={!!errors.department}
                  helperText={errors.department && errors.department?.message}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register('designation')}
                  fullWidth
                  label={<RequiredLabel label='Designation' />}
                  placeholder='Designation'
                  defaultValue={data?.designation}
                  onChange={event => {
                    handleChange('designation', event.target.value)
                  }}
                  error={!!errors.designation}
                  helperText={errors.designation && errors.designation?.message}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  {...register('relationshipOwner')}
                  fullWidth
                  label={<RequiredLabel label='Relationship Owner' />}
                  defaultValue={data?.relationshipOwner}
                  onChange={event => {
                    handleChange('relationshipOwner', event.target.value)
                  }}
                  placeholder='Relationship Owner'
                  error={!!errors.relationshipOwner}
                  helperText={errors.relationshipOwner && errors.relationshipOwner?.message}
                />
              </Grid>
            </Grid>
            {data &&
            (data.title !== watch('title') ||
              data.firstName !== watch('firstName') ||
              data?.lastName !== watch('lastName') ||
              data?.email !== watch('email') ||
              data?.department !== watch('department') ||
              data?.designation !== watch('designation') ||
              data?.relationshipOwner !== watch('relationshipOwner')) ? (
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
          {title && title == 'Add' ? (
            <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'center' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setShow(false)
                  reset()
                }}
              >
                CANCEL
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                {title} CONTACT
              </Button>
            </DialogActions>
          ) : (
            <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'center' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setShow(false)
                  reset()
                }}
              >
                CANCEL
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                SAVE
              </Button>
            </DialogActions>
          )}
        </form>
      </Dialog>
    </Grid>
  )
}

export default DialogClientContact
