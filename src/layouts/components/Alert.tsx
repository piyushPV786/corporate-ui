import { AlertProps, styled } from '@mui/material'
import React from 'react'
import Alert from '@mui/material/Alert'

interface IAlertBox extends AlertProps {
  message?: string | any
  header?: string
}
const StyledAlertContainer = styled('div')<Partial<IAlertBox>>(({ severity }) => ({
  background: severity === 'warning' ? '#f9edd6' : '',
  color: severity === 'warning' ? '#e3a326' : '',
  '.MuiAlert-message': {
    color: severity === 'warning' ? '#e3a326' : ''
  },
  '.MuiAlert-icon': {
    color: severity === 'warning' ? '#e3a326' : ''
  }
}))

const AlertBox = ({ message, severity = 'warning', header, ...props }: IAlertBox) => {
  return (
    <>
      <StyledAlertContainer severity={severity}>
        <Alert {...props} sx={{ mb: 6, mt: 6 }} color='warning' variant={'filled ' as any} severity={severity}>
          {header ? header : null}
          {header ? <br /> : null}
          {message}
        </Alert>
      </StyledAlertContainer>
    </>
  )
}

export default AlertBox
