export const msalConfig = {
  auth: {
    clientId: `${process?.env?.NEXT_PUBLIC_AZURE_CLINT_ID}`,
    authority: `https://login.microsoftonline.com/${process?.env?.NEXT_PUBLIC_AZURE_TENANT_ID}`, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: '/'
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    asyncPopups: true,
    allowRedirectInIframe: true // Needed for Front-channel logout
  }
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['openid']
}

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
}
