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

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { userInformationStatus } from 'src/context/common'
import AlertBox from 'src/layouts/components/Alert'
import { Backdrop, CircularProgress, Tooltip } from '@mui/material'

import { PencilOutline } from 'mdi-material-ui'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { getStateList } from 'src/utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const schema = yup.object().shape({
  street: yup.string().required(userInformationStatus.StreetNameRequired),
  country: yup.string().required(userInformationStatus.CountryNameRequired),
  city: yup.string().required(userInformationStatus.CityNameRequired),
  state: yup.string().required(userInformationStatus.StateNameRequired),
  zipcode: yup
    .string()
    .required(userInformationStatus.ZipcodeRequired)
    .matches(/^\d+$/, userInformationStatus.zipcodeNegative)
    .min(4)
    .max(6)
})
const defaultValues = {
  addressType: '',
  street: '',
  country: '',
  state: '',
  city: '',
  zipcode: ''
}

interface IAddressState {
  name: string
  code: string
  countryCode: string
  latitude: string
  longitude: string
}

const AddressInfo = ({ studentdata, addressdata, userAddressUpdate, country }: any) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [loadingStates, setLoadingStates] = useState<boolean>(true)
  const [statesName, setStatesName] = useState<IAddressState[]>([])

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all'
  })
  const countryCode = watch('country')

  const onSubmit = async (data: FieldValues) => {
    reset({}, { keepValues: true })
    const params = {
      addressType: addressdata.addressType,
      street: data.street,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode
    }

    userAddressUpdate(params, studentdata?.application?.applicationCode)
    setShow(false)
    reset(defaultValues)
  }
  const handleOpen = () => {
    reset({
      addressType: addressdata.addressType,
      street: addressdata.street,
      country: addressdata.country,
      state: addressdata.state,
      city: addressdata.city,
      zipcode: addressdata.zipcode
    })
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
    reset(defaultValues)
  }

  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true)
      if (countryCode) {
        const fetchedStates = await getStateList(countryCode)
        const FormattedData = fetchedStates.map((region: any) => {
          region['code'] = region['isoCode']
          delete region['isoCode']

          return region
        })
        setStatesName(FormattedData)
      } else {
        setStatesName([])
      }
      setLoadingStates(false)
    }
    fetchStates()
  }, [countryCode])

  return (
    <Grid>
      <Box display='flex' justifyContent='flex-end'>
        <Tooltip title={`Edit ${addressdata.addressType === 'RESIDENTIAL' ? 'Residential' : 'Postal'} Address`}>
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
                Edit {`${addressdata.addressType === 'RESIDENTIAL' ? 'Residential' : 'Postal'}`} Address
              </Typography>
            </Box>
            {loadingStates ? (
              <Backdrop
                open={loadingStates}
                sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
            ) : (
              <>
                <Grid container spacing={6}>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      {...register('street')}
                      fullWidth
                      defaultValue={addressdata.street}
                      label='Address'
                      onChange={e => {
                        setValue('street', e.target.value)
                      }}
                      error={errors.street as boolean | undefined}
                      helperText={errors.street && (errors.street?.message as string | undefined)}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      {...register('city')}
                      fullWidth
                      defaultValue={addressdata.city}
                      label='City'
                      onChange={e => {
                        setValue('city', e.target.value)
                      }}
                      error={errors.city as boolean | undefined}
                      helperText={errors.city && (errors.city?.message as string | undefined)}
                    />
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    <ControlledAutocomplete
                      name='country'
                      control={control}
                      options={country}
                      rules={{ required: 'Country is required' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Country'
                          helperText={errors?.country?.message as string | undefined}
                          error={Boolean(errors?.country as any)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <ControlledAutocomplete
                      name='state'
                      control={control}
                      options={statesName}
                      rules={{ required: 'State is required' }}
                      defaultValue={statesName.find(state => state.name === addressdata.state)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='State'
                          helperText={errors?.state?.message as string | undefined}
                          error={Boolean(errors?.state as any)}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Controller
                      name='zipcode'
                      control={control}
                      defaultValue={addressdata.zipcode}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Zip Code'
                          error={errors.zipcode as boolean | undefined}
                          helperText={errors.zipcode && (errors.zipcode?.message as string | undefined)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {addressdata &&
                (addressdata.addressType !== watch('addressType') ||
                  addressdata.street !== watch('street') ||
                  addressdata.country !== watch('country') ||
                  addressdata.state !== watch('state') ||
                  addressdata.zipcode !== watch('zipcode') ||
                  addressdata.city !== watch('city')) ? (
                  <AlertBox
                    sx={{ mb: 6 }}
                    color='warning'
                    variant={'filled ' as any}
                    header='Unsaved Changes'
                    message='You have made changes. Do you want to save or cancel them?'
                    severity='warning'
                  ></AlertBox>
                ) : null}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
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

export default AddressInfo
