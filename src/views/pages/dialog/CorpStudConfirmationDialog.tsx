import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AlertOutline } from 'mdi-material-ui'
import { Fragment, useState } from 'react'
import { messages } from 'src/context/common'

type CorpStudConfirmationDialogType = {
  disable: boolean
  submit: () => void
}

const CorpStudConfirmationDialog = ({ submit, disable }: CorpStudConfirmationDialogType) => {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const handleDialog = (state: boolean) => {
    setShowDialog(state)
  }

  return (
    <Fragment>
      <Button disabled={disable} onClick={() => handleDialog(true)} fullWidth variant='contained'>
        Verify
      </Button>
      <Dialog
        fullWidth
        maxWidth='xs'
        open={showDialog}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleDialog(false)
        }}
      >
        <DialogContent>
          <Typography align='center'>
            <AlertOutline sx={{ m: 2 }} fontSize='large' color='warning' />
          </Typography>
          <Typography sx={{ m: 5 }} align='center'>
            {messages.dialogWarningMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialog(false)} variant='outlined'>
            Disagree
          </Button>
          <Button onClick={submit} variant='contained'>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
export default CorpStudConfirmationDialog
