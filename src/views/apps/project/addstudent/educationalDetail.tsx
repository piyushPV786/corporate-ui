import Grid from '@mui/material/Grid'

import {
  Box,
  Typography,
  Card,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText
} from '@mui/material'
import { Controller, UseFormReturn } from 'react-hook-form'
import { SchoolOutline } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import { CommonService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import RequiredLabel from 'src/components/RequiredLabel'

interface Ieducational {
  register: UseFormReturn['register']
  errors: any
  watch: UseFormReturn['watch']
  control: UseFormReturn['control']
  setValue: UseFormReturn['setValue']
  clearErrors: UseFormReturn['clearErrors']
}

export const EducationalDetail = ({ control, errors }: Ieducational) => {
  const [qualification, setQualification] = useState<Array<commonListTypes>>([])

  const getHighestQualificationList = async () => {
    const qualificationResponse = await CommonService?.getHighestQualification()
    if (qualificationResponse?.data?.data?.length > 0) {
      setQualification(qualificationResponse?.data?.data)
    }
  }

  useEffect(() => {
    getHighestQualificationList()
  }, [])

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <Grid sx={{ pl: 2, pt: 0 }}>
            <Box sx={{ pt: 5, pb: 5 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                <SchoolOutline sx={{ mr: 2 }} color='primary' />
                Education Details
              </Typography>
            </Box>

            <Grid container spacing={8} sx={{ p: 10, pt: 2 }}>
              <Grid item sm={6}>
                <ControlledAutocomplete
                  control={control}
                  name='highestQualification'
                  options={qualification}
                  renderInput={params => (
                    <TextField {...params} label={<RequiredLabel label='Higher Qualification' />} />
                  )}
                />
              </Grid>
              <Grid item sm={6}>
                <Controller
                  name='highSchoolName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={<RequiredLabel label='High School Name' />}
                      error={!!errors.highSchoolName}
                      helperText={errors.highSchoolName && (errors.highSchoolName?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={12}>
                <FormControl error={Boolean(errors.isInternationalDegreeHolder)}>
                  <FormLabel sx={{ fontSize: '14px' }}>
                    <RequiredLabel label='Are you an international degree holder?' />
                  </FormLabel>
                  <Controller
                    name='isInternationalDegreeHolder'
                    control={control}
                    defaultValue={0}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup row {...field} aria-label='international-degree' name='international-degree-radio'>
                        <FormControlLabel
                          value={1}
                          label='Yes'
                          sx={errors.isInternationalDegreeHolder ? { color: 'error.main' } : null}
                          control={
                            <Radio
                              size='small'
                              sx={errors.isInternationalDegreeHolder ? { color: 'error.main' } : null}
                            />
                          }
                        />
                        <FormControlLabel
                          value={0}
                          label='No'
                          sx={errors.isInternationalDegreeHolder ? { color: 'error.main' } : null}
                          control={
                            <Radio
                              size='small'
                              sx={errors.isInternationalDegreeHolder ? { color: 'error.main' } : null}
                            />
                          }
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.isInternationalDegreeHolder && (
                    <FormHelperText sx={{ color: 'error.main' }} id='international-degree-radio'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  )
}
