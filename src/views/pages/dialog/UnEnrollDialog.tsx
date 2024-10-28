// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Box, Tooltip, Typography } from '@mui/material'
import { AlertOutline } from 'mdi-material-ui'
import PersonDash from 'src/components/icons/PersonDash'
import { GridRowId } from '@mui/x-data-grid'

interface IUnEnrollDialogProps {
  unenrollStudent: () => void
  selectedRows?: GridRowId[]
}

const UnEnrollDialog = ({ unenrollStudent, selectedRows }: IUnEnrollDialogProps) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEnroll = () => {
    unenrollStudent()
    handleClose()
  }

  return (
    <Fragment>
      <Box>
        <Tooltip title={selectedRows?.length ? 'Unenroll from REGenius and RMS' : 'Select at least one student'}>
          <Box>
            <Button
              variant='contained'
              size='small'
              disabled={!selectedRows?.length}
              onClick={handleOpen}
              color='primary'
              startIcon={<PersonDash />}
            >
              Unenroll
            </Button>
          </Box>
        </Tooltip>
      </Box>
      <Dialog
        maxWidth='xs'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='Unenroll'
      >
        <DialogTitle id='Unenroll' textAlign='center'>
          <AlertOutline color='warning' sx={{ fontSize: 60 }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' pb={5}>
            <Typography textAlign='center'>
              Please double-check the student information, and details before unenrolled from program.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={handleEnroll}>
            Unenroll
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default UnEnrollDialog
