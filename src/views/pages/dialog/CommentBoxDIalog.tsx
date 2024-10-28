import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { CommentTextOutline } from 'mdi-material-ui'

interface ICommentBoxDialogTypes {
  comment: string
}

const CommentBoxDialog = ({ comment }: ICommentBoxDialogTypes) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDialogOpen = () => {
    setIsOpen(true)
  }
  const handleDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <Box width='100%' display='flex' justifyContent='center' alignItems='center'>
      {!!comment ? (
        <Tooltip placement='top' arrow title='View Comment'>
          <IconButton onClick={handleDialogOpen} size='small' color='primary'>
            <CommentTextOutline />
          </IconButton>
        </Tooltip>
      ) : (
        '-'
      )}
      <Dialog fullWidth={true} maxWidth='xs' open={isOpen} onClose={handleDialogClose}>
        <DialogTitle textAlign='center'>Reason to Reject</DialogTitle>
        <DialogContent>
          <Typography align='center'>{comment}</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleDialogClose} variant='outlined'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CommentBoxDialog
