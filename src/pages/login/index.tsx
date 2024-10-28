// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import MuiCard, { CardProps } from '@mui/material/Card'
import { CardContent } from '@mui/material'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import { GoogleAnalyticsScript } from 'src/context/common'
import { checkProd } from 'src/utils'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 400 }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'admin',
  email: 'admin@materialize.com'
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GoogleAnalyticsScript.script2)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Assuming the response is JavaScript content, you can evaluate it
        // Here, you would typically execute the JavaScript code within the response
        // For example, if it's a script, you could append it to the DOM
        const scriptContent = await response.text()
        const scriptElement = document.createElement('script')
        scriptElement.innerHTML = scriptContent
        document.body.appendChild(scriptElement)
      } catch (error) {
        console.error('There was a problem fetching the data:', error)
      }
    }

    checkProd() && fetchData()
  }, []) // Empty dependency array to run effect only once on mount

  // ** Hooks
  const auth = useAuth()

  // ** Vars

  const { setError } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  return (
    <Box className='content-center'>
      <img
        alt={'lgin'}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/bg-login1.jpg`}
        className='bg-login'
        width={'100%'}
        height={'100%'}
      />

      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>

      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/reggie-logo.png`} width='200' alt='ERP logo' />
          </Box>

          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TypographyStyled variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Welcome to ${themeConfig.templateName}!`}
            </TypographyStyled>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TypographyStyled variant='body2'>Sign in with your organizational Email</TypographyStyled>
          </Box>
          <form>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ mb: 7, mt: 3 }}
              onClick={() => onSubmit({ email: 'admin@materialize.com', password: 'admin' })}
            >
              Login
            </Button>
          </form>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TypographyStyled align='center' variant='body2'>
              For more information please contact the IT service desk on{' '}
              <a href='tel:+27 11 669 5000'>+27 11 669 5000</a>
            </TypographyStyled>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
