// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  // ** Var
  // const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='body2' sx={{ mr: 2 }}>
        {`© 1998-${new Date().getFullYear()}, Regenesys Business School (Pty) Ltd `}
      </Typography>
    </Box>
  )
}

export default FooterContent
