import React from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './msalConfig'

const msalInstance = new PublicClientApplication(msalConfig)

const MSALAuth = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
}) => {
  return <MsalProvider instance={msalInstance}>{props.children}</MsalProvider>
}

export default MSALAuth
