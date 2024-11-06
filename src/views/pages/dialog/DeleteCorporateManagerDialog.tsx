// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Backdrop, Box, IconButton, Typography } from '@mui/material'
import { TrashCanOutline, ProgressClose } from 'mdi-material-ui'
import FallbackSpinner from 'src/@core/components/spinner'

interface DialogFormProps {
  row: { code: string }
  deleteCorporateManager: (code: string) => Promise<void>
}
const DeleteCorporateManager = ({ row, deleteCorporateManager }: DialogFormProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleClose = async (code: string) => {
    setLoading(true)
    await deleteCorporateManager(code)
    setLoading(false)
    setOpen(false)
  }
  const handleClickOpen = () => setOpen(true)

  return (
    <Fragment>
      <Box>
        <IconButton
          onClick={() => handleClickOpen()}
          size='small'
          component='a'
          color='error'
          sx={{ textDecoration: 'none', mr: 2, border: '1px solid red' }}
        >
          <TrashCanOutline color='error' />
        </IconButton>
      </Box>
      <Dialog
        maxWidth='md'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>
            <ProgressClose color='error' style={{ height: '30%', width: '20%' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2'>
            <Typography sx={{ mb: 1, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              Are you sure you want to
            </Typography>
            <Typography sx={{ mt: 0, mb: 3, fontWeight: '600', justifyContent: 'center', display: 'flex' }}>
              Delete Manager
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={() => handleClose(row.code)}>
            Delete
          </Button>
        </DialogActions>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <FallbackSpinner />
        </Backdrop>
      </Dialog>
    </Fragment>
  )
}

export default DeleteCorporateManager
