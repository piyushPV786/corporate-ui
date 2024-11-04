// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from './msalConfig'
import { status } from './common'
import { UserManagementService } from 'src/service'
import { baseApiURL } from 'src/service/config'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const { instance } = useMsal()
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const userDetails = window.localStorage.getItem('userData')!
      if (JSON.parse(userDetails)?.email) {
        setLoading(true)
        const userDetailsResponse = await UserManagementService?.getUserDetails(JSON.parse(userDetails)?.email)
        setUser({ ...userDetailsResponse })
        setLoading(false)
      } else {
        setLoading(false)
        redirect()
      }
      setIsInitialized(false)
    }

    initAuth()
  }, [])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await instance.loginPopup(loginRequest)
      const config = {
        headers: { Authorization: `Bearer ${response.idToken}` }
      }
      const userResponse = await axios.get(`${baseApiURL}/auth/access-token`, config)
      const userDetailsResponse = await UserManagementService?.getUserDetails(response?.account?.username)
      setUser(userDetailsResponse)
      window.localStorage.setItem('userData', JSON.stringify(userDetailsResponse))
      if (userResponse?.data.statusCode === status.successCode) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, userResponse.data.data.access_token)
        window.localStorage.setItem(authConfig.refreshToken, userResponse.data.data.refresh_token)
        redirect()
      }
      redirect()
    } catch (err: any) {
      if (errorCallback) errorCallback(err)
    }
  }

  const redirect = () => {
    const returnUrl = router.query.returnUrl
    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    router.push(redirectURL as string)
  }

  const handleLogout = async () => {
    await setUser(null)
    await setIsInitialized(false)
    await window.localStorage.removeItem('userData')
    await window.localStorage.removeItem(authConfig.storageTokenKeyName)

    window.location.href = '/corporate/login'
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
