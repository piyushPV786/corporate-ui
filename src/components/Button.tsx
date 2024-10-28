import { Button, styled } from '@mui/material'

const WhiteButton = styled(Button)(({ theme }) => ({
  mt: 3.5,
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600]
  }
}))

export default WhiteButton
