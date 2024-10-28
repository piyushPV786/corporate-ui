// ** MUI Import
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = () => {
  return (
    <Box
      sx={{
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <svg width={80} fill='none' height={44} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <linearGradient
            y1='0'
            x1='25.1443'
            x2='25.1443'
            y2='143.953'
            id='paint0_linear_7821_79167'
            gradientUnits='userSpaceOnUse'
          >
            <stop />
            <stop offset='1' stopOpacity='0' />
          </linearGradient>
          <linearGradient
            y1='0'
            x1='25.1443'
            x2='25.1443'
            y2='143.953'
            id='paint1_linear_7821_79167'
            gradientUnits='userSpaceOnUse'
          >
            <stop />
            <stop offset='1' stopOpacity='0' />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
