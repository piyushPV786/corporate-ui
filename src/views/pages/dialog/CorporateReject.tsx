// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material'

// ** Third Party Library Imports
import { FieldValues, useForm } from 'react-hook-form'

interface ICorporateRejectProps {
  rejectStudent: (comments: string) => void
  disable: boolean
}

const CorporateReject = ({ rejectStudent, disable }: ICorporateRejectProps) => {
  // ** States
  const [show, setShow] = useState(false)

  const {
    register,
    reset,
    unregister,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = ({ comments }: FieldValues) => {
    setShow(false)
    rejectStudent(comments)
    reset()
  }
  useEffect(() => {
    unregister()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid>
      <Box>
        <Button disabled={disable} fullWidth variant='contained' color='error' onClick={() => setShow(true)}>
          REJECT
        </Button>
      </Box>

      <Dialog
        open={show}
        scroll='body'
        onClose={(event, reason) => reason != 'backdropClick' && setShow(false)}
        maxWidth='sm'
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 8 }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5'>Reason for Reject</Typography>
            </Box>
            <TextField
              {...register('comments', {
                required: 'Please Type Reason for Reject',
                pattern: {
                  value: /[^\s]/,
                  message: 'Entered value cant contain only white spacing'
                }
              })}
              label='Reject Reason (max 50 words)'
              multiline
              fullWidth
              autoFocus
              rows={4}
              maxRows={8}
              error={!!errors?.comments}
              helperText={errors?.comments?.message as string | undefined}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button variant='contained' type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default CorporateReject
