// ** React Imports
import { Fragment, useState } from 'react'

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

// Define the Yup validation schema
const validationSchema = Yup.object({
  status: Yup.string().required('Status is required')
})

const ChangeStatus = () => {
  const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false)

  const handleCloseChangeStatus = () => {
    setOpenChangeStatus(false)
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const statusList = [
    { name: 'Intake Assignment Pending', code: 'INTAKE-ASSIGNMENT-PEND' },
    { name: 'Cancelled', code: 'CANCELLED' }
  ]

  const onSubmit = (data: any) => {
    console.log(data) // Handle form submission logic here
    handleCloseChangeStatus() // Close the modal on form submission
  }

  return (
    <Fragment>
      <Button fullWidth sx={{ mb: 3.5 }} variant='outlined' onClick={() => setOpenChangeStatus(true)}>
        Change Status
      </Button>
      <Grid>
        <Dialog
          fullWidth
          open={openChangeStatus}
          maxWidth='sm'
          scroll='body'
          onClose={(event, reason) => {
            reason != 'backdropClick' && handleCloseChangeStatus()
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Change Status
                </Typography>
              </Box>
              <Grid container spacing={8} sx={{ p: 5, pt: 2 }}>
                <Grid item sm={12}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='status'
                      options={statusList}
                      renderInput={params => (
                        <TextField {...params} label={<RequiredLabel label='Status' />} error={!!errors?.status} />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>{errors?.status?.message as string | undefined}</FormHelperText>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant='outlined' color='secondary' onClick={handleCloseChangeStatus}>
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
export default ChangeStatus
