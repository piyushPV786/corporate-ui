import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { AccountEditOutline, FileDocumentEdit } from 'mdi-material-ui'

interface IButtonProps {
  edit: boolean
  individualStudentData: any
  onClickDialogue: () => void
}

export const AddEditButton = ({ edit, onClickDialogue }: IButtonProps) => {
  if (edit) {
    return (
      <Box display='flex'>
        <Tooltip title='Edit'>
          <Box sx={{ backgroundColor: 'primary', borderRadius: '100%' }}>
            <IconButton
              size='small'
              component='a'
              onClick={onClickDialogue}
              color='primary'
              sx={{
                textDecoration: 'none',
                mr: 0.5,
                padding: '5px',
                borderRadius: '50%',
                borderStyle: 'solid',
                borderWidth: ' 2px',
                borderColor: 'inherit'
              }}
            >
              <AccountEditOutline color='inherit' />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box display='flex' justifyContent='flex-end'>
      <Button
        size='medium'
        startIcon={<FileDocumentEdit />}
        variant='contained'
        onClick={onClickDialogue}
        sx={{ position: 'absolute' }}
      >
        Manage Students
      </Button>
    </Box>
  )
}
