// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Box, IconButton, Typography } from '@mui/material'
import { TrashCanOutline, ProgressClose } from 'mdi-material-ui'

interface DialogFormProps {
  row: { id: number; madeBy: string }
  deleteNotes: (arg1: number) => Promise<void>
  userName: string
}
const DialogForm = ({ row, userName, deleteNotes }: DialogFormProps) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDeleteNotes = async (id: number) => {
    await deleteNotes(id)
    handleClose()
  }

  return (
    <Fragment>
      <Box>
        {row?.madeBy === userName ? (
          <IconButton
            onClick={() => handleClickOpen()}
            size='small'
            component='a'
            color='error'
            sx={{ textDecoration: 'none', mr: 2, border: '1px solid red' }}
          >
            <TrashCanOutline color='error' />
          </IconButton>
        ) : (
          <IconButton
            disabled={true}
            size='small'
            component='a'
            color='secondary'
            sx={{ textDecoration: 'none', mr: 2, border: '1px solid grey' }}
          >
            <TrashCanOutline />
          </IconButton>
        )}
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
          {' '}
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>
            <ProgressClose color='error' style={{ height: '30%', width: '20%' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2'>
            <Typography sx={{ mb: 1, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              Are you sure that you want to
            </Typography>
            <Typography sx={{ mt: 0, mb: 3, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              delete the Notes?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              handleDeleteNotes(row.id)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogForm
