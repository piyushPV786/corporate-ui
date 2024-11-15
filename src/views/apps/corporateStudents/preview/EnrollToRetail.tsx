// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'

// ** Icons Imports
import { FormHelperText, TextField } from '@mui/material'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import RequiredLabel from 'src/components/RequiredLabel'

// ** Validation Imports
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { CommonService, UserManagementService } from 'src/service'
import { status } from 'src/context/common'

// Define the Yup validation schema
const validationSchema = Yup.object({
  interestedQualification: Yup.string().required('Interested Qualification is required'),
  highestQualification: Yup.string().required('Highest Qualification is required')
})

const EnrollToRetail = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const [openEnrollToRetail, setOpenEnrollToRetail] = useState<boolean>(false)
  const [salesAgentList, setSalesAgentList] = useState<any[]>([])
  const [interestedQualificationList, setInterestedQualificationList] = useState<any[]>([])
  const [highestQualificationList, setHighestQualificationList] = useState<any[]>([])

  const handleCloseEnrollToRetail = () => {
    setOpenEnrollToRetail(false)
  }

  const getSalesAgentList = async () => {
    const response = await UserManagementService?.getSalesAgentList()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setSalesAgentList(response.data.data)
    }
  }

  const getInterestedQualificationList = async () => {
    const response = await UserManagementService?.getSalesAgentList()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setInterestedQualificationList(response.data.data)
    }
  }

  const getHighestQualificationList = async () => {
    const response = await CommonService?.getHighestQualification()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setHighestQualificationList(response.data.data)
    }
  }

  const onSubmit = (data: any) => {
    console.log(data) // Handle form submission logic here
    handleCloseEnrollToRetail() // Close the modal on form submission
  }

  useEffect(() => {
    getInterestedQualificationList()
    getHighestQualificationList()
    getSalesAgentList()
  }, [])

  return (
    <Fragment>
      <Box>
        <Button fullWidth onClick={() => setOpenEnrollToRetail(true)} variant='contained' sx={{ mt: 3.5 }}>
          Enroll as Retail
        </Button>
      </Box>
      <Grid>
        <Dialog
          fullWidth
          open={openEnrollToRetail}
          maxWidth='md'
          scroll='body'
          onClose={(event, reason) => {
            reason != 'backdropClick' && handleCloseEnrollToRetail()
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Enroll as Retail
                </Typography>
              </Box>
              <Grid container spacing={8} sx={{ p: 10, pt: 2 }}>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='interestedQualification'
                      options={interestedQualificationList}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Interested Qualification' />}
                          error={!!errors?.interestedQualification}
                        />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>
                    {errors?.interestedQualification?.message as string | undefined}
                  </FormHelperText>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='salesAgent'
                      options={salesAgentList}
                      renderInput={params => <TextField {...params} label={'Sales Agent'} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='highestQualification'
                      options={highestQualificationList}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Highest Qualification' />}
                          error={!!errors?.highestQualification}
                        />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>{errors?.highestQualification?.message as string | undefined}</FormHelperText>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant='outlined' color='secondary' onClick={handleCloseEnrollToRetail}>
                Cancel
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Fragment>
  )
}
export default EnrollToRetail
