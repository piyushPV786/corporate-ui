import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { Box, Typography, TextField, FormHelperText, Button, Dialog, DialogContent, DialogActions } from '@mui/material'
import { useEffect, useState } from 'react'
import { FileDocumentEdit } from 'mdi-material-ui'
import { DashboardService } from 'src/service'
import { successToast } from 'src/components/Toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationContactSchema } from 'src/views/apps/project/projectstudent/schema'

interface IContactTypes {
  studentData: any
  getStudentDetailById: any
}

type ValidContactNumberFieldNames = 'contactNumber'

const EditContactDetails = ({ studentData, getStudentDetailById }: IContactTypes) => {
  const defaultValues = {
    email: studentData?.lead?.email,
    contactNumberCountryCode: studentData?.lead?.mobileCountryCode,
    contactNumber: studentData?.lead?.mobileCountryCode + studentData?.lead?.mobileNumber
  }
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(validationContactSchema) })

  const countryCodeContact = (fieldName: ValidContactNumberFieldNames, data: any, dialCode: string) => {
    data && setValue(fieldName, data)
    data && setValue(`${fieldName}CountryCode`, dialCode)
  }

  const [show, setShow] = useState(false)

  const onSubmit = async (data: any) => {
    const payload = {
      email: data?.email,
      mobileCountryCode: data?.contactNumberCountryCode,
      mobileNumber: data.contactNumber.slice(data.contactNumberCountryCode.length)
    }

    const response = await DashboardService.addUpdateStudentContactInfo(payload, studentData?.applicationCode)

    if (response?.studentCode) {
      getStudentDetailById(studentData?.applicationCode)

      successToast(`Student Contact Info updated successfully`)
    }
    reset()
    setShow(false)
  }

  const onClose = () => {
    setShow(false)
  }

  useEffect(() => {
    !!studentData && reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData, reset, !show])

  return (
    <Grid>
      <Box display='block'>
        <Button size='small' startIcon={<FileDocumentEdit />} variant='contained' onClick={() => setShow(true)}>
          Edit Details
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
                Edit Contact Details
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
                      error={errors.email as boolean | undefined}
                      helperText={errors.email && (errors.email?.message as string | undefined)}
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
                        '& .react-tel-input': { color: theme => `rgb(${theme.palette.customColors.main})` }
                      }}
                    >
                      <PhoneInput
                        {...field}
                        onChange={(data, countryData: { dialCode: string }) =>
                          countryCodeContact('contactNumber', data, countryData?.dialCode)
                        }
                        country={'za'}
                        countryCodeEditable={false}
                        placeholder='Enter phone number'
                        specialLabel='Contact Number'
                        inputStyle={{
                          borderRadius: '10px',
                          background: 'none',
                          width: '100%'
                        }}
                      />
                      <FormHelperText error>
                        {errors.contactNumber && (errors.contactNumber?.message as string | undefined)}
                      </FormHelperText>
                    </Box>
                  )}
                />
              </Grid>
              {/* <Grid item sm={4} xs={12}>
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
                  {errors.alternativeContact && (errors.alternativeContact?.message as string | undefined)}
                </FormHelperText>
              </Grid> */}

              {/* <Grid item sm={4}>
                <Controller
                  name='homePhone'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Home Phone (optional)'
                      fullWidth
                      placeholder='Home Phone if any(optional)'
                      error={errors.homePhone as boolean | undefined}
                      helperText={errors.homePhone && (errors.homePhone?.message as string | undefined)}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
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

export default EditContactDetails
