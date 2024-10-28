// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const AnalyticsCongratulations = () => {
  // ** Hook
  const { settings } = useSettings()

  return (
    <Card sx={{ position: 'relative', minHeight: '100%' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Welcome{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                John
              </Box>
              ! 🎉
            </Typography>
            <Typography variant='body2'>
              You have{' '}
              <Box component='span' sx={{ fontWeight: 800 }}>
                6
              </Box>{' '}
              application for review today.
            </Typography>
            <Typography sx={{ mb: 4.5 }} variant='body2'>
              Wishing you wealth and good health, have a great day.
            </Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img
              alt='Congratulations John'
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/cards/illustration-john-${settings.mode}.png`}
            />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCongratulations
