// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  GridProps,
  TextField,
  TextFieldProps,
  createFilterOptions
} from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserManagementService } from 'src/service'
import { CheckCircleOutline } from 'mdi-material-ui'
import { AgentRole, status } from 'src/context/common'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const filter = createFilterOptions<any>()

const Img = styled('img')(({ theme }) => ({
  // marginTop: theme.spacing(15),
  // marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))
const Boxes = styled(Card)(({ theme }) => ({
  // marginTop: theme.spacing(15),
  // marginBottom: theme.spacing(15),
  background: theme?.palette?.common.white,
  margin: theme.spacing(10),
  padding: theme.spacing(8)
}))

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  department: yup
    .string()
    .min(3, obj => showErrors('department', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('name', obj.value.length, obj.min))
    .required(),
  comment: yup.string()
})

const Error401 = () => {
  const [roles, setRoles] = useState([])
  const [agentDetails, setAgentDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const getAllRoles = async () => {
    const response = await UserManagementService?.getRoles()

    setRoles(
      response?.filter(
        (item: { name: string; code: string }) =>
          item?.code !== AgentRole.Sales &&
          item?.code !== AgentRole.FINANCE &&
          item?.code !== AgentRole.Admission &&
          item?.code !== AgentRole.CorporateSales &&
          item?.code !== AgentRole.Academics &&
          item?.code !== AgentRole.Assessment &&
          item?.code !== AgentRole.OPERATION
      )
    )
  }

  useEffect(() => {
    getAllRoles()
  }, [])

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const departmentWatch = watch('department')

  useEffect(() => {
    const getAgentData = async () => {
      const agentRole = AgentRole[departmentWatch] ? AgentRole[departmentWatch] : ''
      const agentResponse = await UserManagementService.getAgents(agentRole)
      setAgentDetails(agentResponse)
    }
    if (departmentWatch) {
      getAgentData()
    }
  }, [departmentWatch])

  useEffect(() => {
    if (user?.firstName && user?.email) {
      setValue('name', `${user?.firstName} ${user?.lastName}`)
      setValue('email', user?.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onSubmit = async (data: any) => {
    setLoading(true)
    const payload = {
      roles: data?.department,
      emailAddress: data?.email,
      comments: data?.comment
    }
    const response = await UserManagementService?.requestAssess(payload)
    if (response?.status === status?.successCodeOne) {
      setShowSuccess(true)
    } else {
      setShowSuccess(false)
    }

    setLoading(false)
  }

  const onBackToLogin = async () => {
    setLoading(true)
    window.localStorage.clear()
    window.sessionStorage.clear()
    router.push('/enrolment/login')
    setLoading(false)
  }

  const getDefaultValue = (agentDetails: any) => {
    return agentDetails?.map((item: any) => `${item?.firstName} ${item?.lastName} ${item?.email}`)
  }

  const GridWrapper = styled(Grid)<GridProps>(() => ({
    marginTop: showSuccess ? '4%' : 0
  }))

  return (
    <Box>
      <Box>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            {!showSuccess && (
              <>
                <Typography variant='h1' sx={{ mb: 2.5 }}></Typography>
                <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
                  You are not authorized! 🔐
                </Typography>
                <Typography variant='body2'>You don&prime;t have permission to access this page</Typography>
              </>
            )}
          </BoxWrapper>
        </Box>
      </Box>

      <GridWrapper container>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          {showSuccess && (
            <Boxes>
              <Box textAlign='center'>
                <CheckCircleOutline color='primary' fontSize={'large'} />
                <Typography fontSize={20} color='primary' pb={3} fontWeight={700}>
                  Thank you! Your request has been submitted
                </Typography>
                <Typography fontWeight={700}>Within a few moments, You will be notified through an email</Typography>
                <Typography fontWeight={700}>once the access is granted</Typography>
              </Box>
            </Boxes>
          )}
          {!showSuccess && (
            <Boxes>
              <Typography variant='h5' component='h5' textAlign={'center'} pb={10}>
                Request Access
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container>
                  <Grid xs={6} pr={5}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            disabled
                            value={`${user?.firstName} ${user?.lastName}`}
                            label='Name'
                            onChange={onChange}
                            error={Boolean(errors.name)}
                            aria-describedby='validation-schema-name'
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-name'>
                          {errors.name.message as string | undefined}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} pl={5}>
                    <FormControl fullWidth>
                      <Controller
                        name='email'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            disabled
                            value={user?.email}
                            label='Email'
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            aria-describedby='validation-schema-email'
                          />
                        )}
                      />
                      {errors.email && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-email'>
                          {errors.email.message as string | undefined}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} pt={8}>
                    <FormControl fullWidth>
                      <Controller
                        name='department'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Autocomplete
                            onChange={(e, data) => field?.onChange(data?.name)}
                            options={roles}
                            renderOption={(props, option: any) => <li {...props}>{option?.name}</li>}
                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                              <TextField {...params} label='Department' error={Boolean(errors.department)} />
                            )}
                            getOptionLabel={(option: any) => {
                              return option?.name
                            }}
                            value={roles?.find(item => (item as any)?.code === field?.value)}
                            filterOptions={(options: any, params: any) => {
                              const filtered = filter(options, params)
                              const { inputValue } = params
                              const isExisting = options.some((option: any) => inputValue === option.name)
                              if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                  inputValue,
                                  name: `Add "${inputValue}"`
                                })
                              }

                              return filtered
                            }}
                          />
                        )}
                      />
                      {errors.department && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-last-name'>
                          {errors.department.message as string | undefined}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {!!agentDetails?.length && departmentWatch && (
                    <Grid xs={12} pt={8}>
                      <Autocomplete
                        disabled
                        multiple
                        id='tags-readOnly'
                        options={agentDetails}
                        defaultValue={getDefaultValue(agentDetails)}
                        readOnly
                        renderInput={params => <TextField {...params} label='Administrator Name' />}
                      />
                    </Grid>
                  )}

                  <Grid xs={12} pt={8}>
                    <FormControl fullWidth>
                      <Controller
                        name='comment'
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} multiline minRows={4} placeholder='Comments (Optional)' />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={6} pt={8} textAlign='center'>
                    <Button type='submit' variant='contained' disabled={loading}>
                      Request Access
                    </Button>
                  </Grid>
                  <Grid xs={6} pt={8} textAlign='center'>
                    <Button variant='outlined' disabled={loading} onClick={onBackToLogin}>
                      Back to login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Boxes>
          )}
        </Grid>
        <Grid item xs={3}>
          <Img alt='error-illustration' src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/pages/401.png`} />
        </Grid>
      </GridWrapper>
      <FooterIllustrations image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/pages/misc-401-object.png`} />
    </Box>
  )
}

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error401
