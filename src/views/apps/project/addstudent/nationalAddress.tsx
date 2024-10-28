import Grid from '@mui/material/Grid'
import { Controller, UseFormReturn } from 'react-hook-form'
import { Box, Typography, TextField, Card, Backdrop, CircularProgress } from '@mui/material'

import { CardAccountDetailsOutline } from 'mdi-material-ui'
import { CommonService } from 'src/service'
import { useEffect, useState } from 'react'
import { commonListTypes } from 'src/types/apps/dataTypes'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { status } from 'src/context/common'
import { getStateList } from 'src/utils'
import RequiredLabel from 'src/components/RequiredLabel'

interface Inational {
  errors: any
  register: UseFormReturn['register']
  setValue: UseFormReturn['setValue']
  clearErrors: UseFormReturn['clearErrors']
  watch: UseFormReturn['watch']
  control: UseFormReturn['control']
}
interface IAddressState {
  name: string
  code: string
  countryCode: string
  latitude: string
  longitude: string
}

export const NationalAddressDetail = ({ errors, control, watch }: Inational) => {
  const [country, setCountry] = useState<Array<commonListTypes>>([])
  const [states, setStates] = useState<IAddressState[] | []>([])
  const [loadingStates, setLoadingStates] = useState<boolean>(false)

  const countryWatch = watch('country')

  const getCountryLists = async () => {
    const response = await CommonService.getCountryLists()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setCountry(response.data.data)
    }
  }

  const fetchStates = async (countryCode: string) => {
    setLoadingStates(true)
    if (countryCode) {
      const fetchedStates = await getStateList(countryCode)
      const FormattedData = fetchedStates.map((region: any) => {
        region['code'] = region['isoCode'] || region['code']
        delete region['isoCode']

        return region
      })
      setStates(FormattedData)
    } else {
      setStates([])
    }
    setLoadingStates(false)
  }

  useEffect(() => {
    // getIdentificationType({ projectIdentificationType: true })
    getCountryLists()
  }, [])

  useEffect(() => {
    if (countryWatch) {
      fetchStates(countryWatch)
    }
  }, [countryWatch])

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <Grid sx={{ pl: 5, pt: 0, pb: 10, pr: 5 }}>
            <Box sx={{ pt: 5, pb: 5 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                <CardAccountDetailsOutline sx={{ mr: 2 }} color='primary' />
                Address
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={8}>
                <Controller
                  name='postalAddress'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='Postal Address' />}
                      error={errors.postalAddress}
                      helperText={errors.postalAddress && errors.postalAddress?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  control={control}
                  name='country'
                  options={country}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='Country' />} />}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  control={control}
                  name='state'
                  options={states}
                  renderInput={params => <TextField {...params} label={<RequiredLabel label='State/Provinces' />} />}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='City' />}
                      error={errors.city}
                      helperText={errors.city && errors.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='zipCode'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='number'
                      error={errors.zipCode}
                      fullWidth
                      label={<RequiredLabel label='Zip Code / Pin Code' />}
                      helperText={errors.zipCode && errors.zipCode?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {loadingStates && (
        <Backdrop
          open={loadingStates}
          sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      )}
    </>
  )
}
