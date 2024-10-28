// ** React Imports
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { dataMessages } from 'src/context/common'

// ** MUI Imports
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'

// ** MUI Icons
import { Close, FileDocumentEdit } from 'mdi-material-ui'

// ** API
import { StudentService } from 'src/service'
import AlertBox from 'src/layouts/components/Alert'

const DialogPaymentDetail = () => {
  const [show, setShow] = useState(false)

  // ** for dummy use only
  const courseFee = 20000

  const {
    register,
    handleSubmit,
    watch,
    formState: {}
  } = useForm()

  const onSubmit = async (data: any) => {
    const params = data
    const result = await StudentService.setVipStudent(params)

    result?.status === 200 ? notify('success') : notify('error')
  }

  const notify = (status: string) => {
    const myStyle = {
      position: 'top-center' as const,
      style: {
        borderRadius: '10px',
        background: '#1f2b37',
        color: '#fff'
      }
    }

    status === 'success' ? toast.success(dataMessages.success, myStyle) : toast.error(dataMessages.error, myStyle)
    setShow(false)
  }

  return (
    <main>
      <Grid>
        <Box>
          <Button size='small' startIcon={<FileDocumentEdit />} variant='contained' onClick={() => setShow(true)}>
            Edit payment Details
          </Button>
        </Box>
        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={(event, reason) => {
            reason != 'backdropClick' && setShow(false)
          }}
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
                  Edit Payment Details
                </Typography>
              </Box>
              <Grid container rowSpacing={10} columnSpacing={6}>
                <Grid item sm={6} xs={12}>
                  <Typography variant='body2' sx={{ mt: -3, mb: 2 }}>
                    Module Fee
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    $ {courseFee}
                  </Typography>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='payment-type'>Payment Type</InputLabel>
                    <Select
                      {...register('type', { required: 'Payment Type is required' })}
                      labelId='payment-type'
                      id='type'
                      label='Payment Type'
                    >
                      <MenuItem value='semester'>Semester</MenuItem>
                      <MenuItem value='quarterly'>Quarterly</MenuItem>
                      <MenuItem value='monthly'>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='payment-mode'>Payment Mode</InputLabel>

                    <Select
                      {...register('mode', { required: 'Payment Mode is required' })}
                      labelId='payment-mode'
                      id='mode'
                      label='Payment Mode'
                    >
                      <MenuItem value='online'>Online</MenuItem>
                      <MenuItem value='cash'>Cash</MenuItem>
                      <MenuItem value='cheque'>Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='payment-method'>Payment Method</InputLabel>
                    <Select
                      {...register('method', { required: 'Payment Method is required' })}
                      labelId='payment-method'
                      id='method'
                      label='Payment Method'
                    >
                      <MenuItem value='credit'>Credit Card</MenuItem>
                      <MenuItem value='debit'>Debit Card</MenuItem>
                      <MenuItem value='upi'>UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {watch('type') !== undefined || watch('mode') !== undefined || watch('method') !== undefined ? (
                <AlertBox
                  sx={{ mb: 6 }}
                  header='Unsaved Changes'
                  color='warning'
                  variant={'filled ' as any}
                  message='You have made changes. Do you want to save or cancel them?'
                  severity='warning'
                ></AlertBox>
              ) : null}
            </DialogContent>
            <DialogActions sx={{ mt: 5, pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </main>
  )
}

export default DialogPaymentDetail
