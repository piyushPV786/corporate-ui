import Grid from '@mui/material/Grid'

import { Box, InputLabel, Typography, FormControl, Select, Card, MenuItem, FormHelperText } from '@mui/material'
import { UseFormReturn } from 'react-hook-form'
import { School } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import { CommonService } from 'src/service'

interface Ieducational {
  register: UseFormReturn['register']
  errors: any
  watch: UseFormReturn['watch']
  setValue: UseFormReturn['setValue']
}

export const EducationalDetail = ({ register, errors }: Ieducational) => {
  const [qualification, setQualification] = useState<any>([])
  const [year, setYear] = useState<any>([])

  const getHighestQualificationList = async () => {
    const qualificationResponse = await CommonService?.getHighestQualification()
    if (qualificationResponse?.data?.data?.length > 0) {
      setQualification(qualificationResponse?.data?.data)
    }
  }
  const getYearList = async () => {
    const yearResponse = await CommonService?.getYear()
    if (yearResponse?.data?.data?.length > 0) {
      setYear(yearResponse?.data?.data)
    }
  }

  useEffect(() => {
    getHighestQualificationList()
    getYearList()
  }, [])

  return (
    <>
      <Grid item sx={{ pt: 5 }}>
        <Card>
          <Grid sx={{ pl: 2, pt: 0 }}>
            <Box sx={{ pt: 5, pb: 5 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', display: 'flex', mt: 0 }}>
                <School sx={{ mr: 2 }} color='primary' />
                Education Details
              </Typography>
            </Box>

            <Grid container spacing={8} sx={{ p: 10, pt: 2 }}>
              <Grid item sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Higher Qualification</InputLabel>
                  <Select
                    fullWidth
                    label='Higer Qualification'
                    error={errors.highestQualification}
                    {...register('highestQualification')}
                  >
                    {qualification?.map((item: any, index: any) => (
                      <MenuItem key={index.id} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.highestQualification?.message as string | undefined}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Completed year</InputLabel>
                  <Select
                    fullWidth
                    label='Completed year'
                    error={errors.highestQualificationCompletedYear}
                    {...register('highestQualificationCompletedYear')}
                  >
                    {year?.map((item: any, index: any) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.highestQualificationCompletedYear?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  )
}
