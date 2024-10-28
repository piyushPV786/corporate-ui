import Grid from '@mui/material/Grid'
import { Controller, UseFormReturn } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import { Box, Typography, TextField, Card, FormHelperText } from '@mui/material'
import { AccountDetailsOutline } from 'mdi-material-ui'

interface IContactTypes {
  register: UseFormReturn['register']
  errors: any
  control: UseFormReturn['control']
  watch: UseFormReturn['watch']
  setValue: UseFormReturn['setValue']
}

export const ContactDetail = ({ errors, setValue, control, watch }: IContactTypes) => {
  const countryCodeContact = (fieldName: string, data: any, dialCode: string) => {
    data && setValue(fieldName, data)
    data && setValue(`${fieldName}CountryCode`, dialCode)
  }

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <Grid
            sx={{
              pl: 2,
              pt: 0,
              '& .special-label': {
                color: theme => theme.palette.customColors.main,
                background: theme => theme.palette.background.paper
              }
            }}
          >
            <Box sx={{ pt: 5, pb: 5 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                <AccountDetailsOutline sx={{ mr: 2 }} color='primary' />
                Contact Details
              </Typography>
            </Box>

            <Grid container spacing={8} sx={{ p: 10, pt: 2 }}>
              <Grid item sm={4}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Email'
                      fullWidth
                      error={errors.email}
                      helperText={errors.email && errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='contactNumber'
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
                          countryCodeContact('contactNumber', data, countryData?.dialCode)
                        }
                        country={'US'}
                        placeholder='Enter phone number'
                        specialLabel='Contact Number'
                        inputStyle={{
                          borderRadius: '10px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                      <FormHelperText style={{ color: 'red' }}>
                        {errors.contactNumber && errors.contactNumber?.message}
                      </FormHelperText>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='alternativeContact'
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
                        country={'US'}
                        placeholder='Enter alternate number'
                        specialLabel='Alternate Number (optional)'
                        value={watch('alternativeContact')}
                        onChange={(data, countryData: { dialCode: string }) =>
                          countryCodeContact('alternativeContact', data, countryData?.dialCode)
                        }
                        inputStyle={{
                          borderRadius: '10px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                    </Box>
                  )}
                />

                <FormHelperText style={{ color: 'red' }}>
                  {errors.alternativeContact && errors.alternativeContact?.message}
                </FormHelperText>
              </Grid>

              <Grid item sm={4}>
                <Controller
                  name='homePhone'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Home Phone (optional)'
                      fullWidth
                      placeholder='Home Phone if any(optional)'
                      error={errors.homePhone}
                      helperText={errors.homePhone && errors.homePhone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='whatsappNumber'
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
                          countryCodeContact('whatsappNumber', data, countryData?.dialCode)
                        }
                        country={'US'}
                        placeholder='Enter whatsapp number'
                        specialLabel='Whatsapp Number'
                        inputStyle={{
                          borderRadius: '10px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                    </Box>
                  )}
                />

                <FormHelperText style={{ color: 'red' }}>
                  {errors.whatsappNumber && errors.whatsappNumber?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  )
}
