// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Close from 'mdi-material-ui/Close'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const DialogForm = (props: any) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const [fileTypes, setFileTypes] = useState<Array<any>>([])
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const getFileType = () => {
    const fileTypesObject: any = {}

    for (let i = 0; i < props?.data?.length; i++) {
      const item = props.data[i]
      const documentTypeCode = item.documentTypeCode
      const documentName = item.name

      if (!fileTypesObject[documentTypeCode]) {
        fileTypesObject[documentTypeCode] = {
          count: 1,
          names: [documentName]
        }
      } else {
        fileTypesObject[documentTypeCode].count += 1
        fileTypesObject[documentTypeCode].names.push(documentName)
      }
    }

    return Object.entries(fileTypesObject)
  }
  useEffect(() => {
    setFileTypes(getFileType())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])

  return (
    <Fragment>
      <Button
        variant='contained'
        size='small'
        disabled={props.disabled}
        onClick={handleClickOpen}
        color='error'
        startIcon={<Close />}
      >
        Reject
      </Button>

      <Dialog
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
        maxWidth='md'
      >
        <DialogTitle id='form-dialog-title'>
          Reason for Reject -
          <TableContainer sx={{ maxHeight: 300 }} component={Paper}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Document Name </TableCell>
                  <TableCell align='center'>Document Type</TableCell>
                  <TableCell align='left'>Document Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileTypes.map(([documentTypeCode, { count, names }]) => (
                  <TableRow
                    key={documentTypeCode}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell style={{ paddingTop: '8px', paddingBottom: '8px' }} align='left'>
                      {`${names?.join(', ')}`}
                    </TableCell>
                    <TableCell align='center' style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      {`${documentTypeCode}`}
                    </TableCell>
                    <TableCell align='center' style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      {`${count}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' sx={{ mb: 3 }}>
            Please enter valid reason to Reject a Document?
          </DialogContentText>
          <TextField
            onChange={e => setComment(e.target.value)}
            id=''
            multiline
            rows={4}
            autoFocus
            fullWidth
            type=''
            label='Reject Reason'
          />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            disabled={!comment.length}
            onClick={() => {
              setOpen(false)
              props.documentApprove('REJECT', comment)
            }}
          >
            Submit
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogForm
