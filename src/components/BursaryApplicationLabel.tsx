import { Grid, Typography } from '@mui/material'
import { Account } from 'mdi-material-ui'

const BursaryApplicationLabel = () => (
  <Grid
    item
    sx={{
      borderRadius: '10px',
      backgroundColor: theme => theme.palette.primary.dark,
      color: theme => theme.palette.grey[400],
      px: 4,
      py: 2,
      display: 'flex',
      gap: 1,
      alignItems: 'center'
    }}
  >
    <Account fontSize='small' color='warning' />
    <Typography variant='body2' color='warning.main'>
      Bursary Application
    </Typography>
  </Grid>
)

export default BursaryApplicationLabel
