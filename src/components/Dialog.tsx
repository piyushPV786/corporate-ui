import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AlertOutline } from 'mdi-material-ui'

type ConfirmationDialogType = {
  show: boolean
  message: string
  submit: () => void
  cancel: () => void
}

export const ConfirmationDialog = ({ show, message, submit, cancel }: ConfirmationDialogType) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth='xs'
      open={show}
      onClose={(event, reason) => {
        reason !== 'backdropClick' && cancel()
      }}
    >
      <DialogContent>
        <Typography align='center'>
          <AlertOutline sx={{ m: 2 }} fontSize='large' color='warning' />
        </Typography>
        <Typography sx={{ m: 5 }} align='center'>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={cancel} variant='outlined'>
          Disagree
        </Button>
        <Button onClick={submit} autoFocus variant='contained'>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
