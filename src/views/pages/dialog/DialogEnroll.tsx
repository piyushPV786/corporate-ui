// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Box, Typography } from '@mui/material'
import { AlertOutline, Directions } from 'mdi-material-ui'

const DialogEnroll = ({ enrollIntake, selectedRow }: any) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEnroll = () => {
    enrollIntake()
    handleClose()
  }

  return (
    <Fragment>
      <Box>
        <Button
          variant='contained'
          size='small'
          onClick={handleClickOpen}
          disabled={!selectedRow.length}
          color='primary'
        >
          <Directions sx={{ mr: 1 }} />
          Enroll to REGenius
        </Button>
      </Box>
      <Dialog
        maxWidth='md'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>
            <AlertOutline color='warning' style={{ height: '30%', width: '20%' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2'>
            <Typography sx={{ mb: 1, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              Please double-check the group details before,
            </Typography>
            <Typography sx={{ mt: 0, mb: 3, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              enrolling in REGenius.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleEnroll}>
            Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogEnroll
