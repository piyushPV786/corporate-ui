import React from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

interface ICommon500Props {
  handleRedirect: () => void
}
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))
const BlankLayoutWrapper = styled(Box)<BoxProps>(() => ({
  backgroundColor: ' #dde1e3'
}))
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  },
  padding: 20
}))
const CommonErrorComponent = ({ handleRedirect }: ICommon500Props) => {
  return (
    <>
      <BlankLayoutWrapper>
        <Box sx={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
          <Box>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <BoxWrapper>
                <Typography variant='h1'>500</Typography>
                <Typography variant='h5' sx={{ fontSize: '1.5rem !important' }}>
                  Internal server error 👨🏻‍💻
                </Typography>
                <Typography sx={{ pt: 2 }} variant='body2'>
                  Oops, something went wrong!
                </Typography>
              </BoxWrapper>
              <Button
                component='a'
                variant='contained'
                sx={{
                  px: 2,
                  backgroundColor: '#008554',
                  '&:hover': {
                    backgroundColor: 'black'
                  }
                }}
                onClick={handleRedirect}
              >
                Back to Home
              </Button>
              <Img
                sx={{ maxHeight: '420px', pt: 5 }}
                alt='error-illustration'
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/pages/500.png`}
              />
            </Box>
            <FooterIllustrations image={`${process.env.NEXT_PUBLIC_BASE_URL}/images/pages/misc-500-object.png`} />
          </Box>
        </Box>
      </BlankLayoutWrapper>
    </>
  )
}
export default CommonErrorComponent
