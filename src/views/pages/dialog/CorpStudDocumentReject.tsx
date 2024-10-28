// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

// ** Icon Imports
import Close from 'mdi-material-ui/Close'
import { FieldValues, useForm } from 'react-hook-form'
import { corporateConstant } from 'src/context/corporateData'
import { IdocumentDataType } from 'src/types/apps/invoiceTypes'
import { IDocumentsStatusType } from 'src/types/apps/corporatTypes'
import { documentStatus } from 'src/context/common'

interface IPropTypes {
  documentApprove: (docStatus: IDocumentsStatusType, comment: string) => void
  data: Array<IdocumentDataType>
  disabled: boolean
}

const CorpStudDocumentReject = (props: IPropTypes) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [fileTypes, setFileTypes] = useState<Array<Array<string | number>>>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const getFileType = () => {
    const fileTypesObject: { [key: string]: number } = {}
    for (let i = 0; i < props?.data?.length; i++) {
      const item = props.data[i].documentTypeCode
      fileTypesObject[item] = fileTypesObject[item] + 1 || 1
    }

    return Object.entries(fileTypesObject)
  }
  useEffect(() => {
    setFileTypes(getFileType())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])
  const onSubmit = (data: FieldValues) => {
    setOpen(false)
    props.documentApprove(documentStatus.rejected, data.comment)
    reset()
  }

  return (
    <Fragment>
      <Button
        variant='contained'
        size='small'
        disabled={!props.disabled}
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
      >
        <DialogTitle>Reason for Reject - {fileTypes.map(([key, value]) => `${key}(${value})`)}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText variant='body2' sx={{ mb: 3 }}>
              Please enter valid reason to Reject a Document?
            </DialogContentText>
            <TextField
              {...register('comment', { required: corporateConstant.documentCommentValidationMSG })}
              multiline
              rows={4}
              autoFocus
              fullWidth
              label='Reject Reason'
              error={!!errors?.comment}
              helperText={errors?.comment?.message as string | undefined}
            />
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button type='submit'>Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default CorpStudDocumentReject
