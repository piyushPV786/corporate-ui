import axios, { AxiosInstance } from 'axios'

import Academic from './Academic'
import Aggregator from './Aggregator'
import Common from './Common'
import Apply from './Apply'

import { baseApiURL, apiEndPoints } from './config'
import Dashboard from './Dashboard'
import Finance from './Finance'
import Student from './Student'
import authConfig from 'src/configs/auth'
import UserManagement from './UserManagement'
import Document from './Document'
import { status } from 'src/context/common'
import mem from 'mem'

const appAPIServer: AxiosInstance = axios.create()

export const DashboardService = new Dashboard(appAPIServer)
export const StudentService = new Student(appAPIServer)
export const CommonService = new Common(appAPIServer)
export const FinanceService = new Finance(appAPIServer)
export const AcademicService = new Academic(appAPIServer)
export const AggregatorService = new Aggregator(appAPIServer)
export const UserManagementService = new UserManagement(appAPIServer)
export const ApplyService = new Apply(appAPIServer)
export const DocumentService = new Document(appAPIServer)

const refreshTokenUrl = `${baseApiURL}/${apiEndPoints.refreshToken}`

appAPIServer.interceptors.request.use(
  config => {
    if (config.headers && config?.url === refreshTokenUrl) {
      config.headers['Authorization'] = `Bearer ${window.localStorage.getItem(authConfig.refreshToken)}`
    } else if (config.headers) {
      config.headers['Authorization'] = `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const refreshTokenFunction = async () => {
  const response = await UserManagementService.getRefreshToken()
  const { data } = response?.data
  if (data?.access_token && data?.refresh_token) {
    await window.localStorage.setItem(authConfig.storageTokenKeyName, data.access_token)
    await window.localStorage.setItem(authConfig.refreshToken, data.refresh_token)
  }

  return data
}
const maxAge = 10000
const memoizedRefreshToken = mem(refreshTokenFunction, {
  maxAge
})

const requestInterceptor = (config: any) => {
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
  }

  return config
}
const responseInterceptor = (response: any) => {
  if (response) {
    return response
  }
}
const errorInterceptor = async (err: any) => {
  const error = err.response
  const config = error?.config

  if (error.status === status.unauthorizedStatus && err?.config?.url === refreshTokenUrl) {
    redirectToLoginPage()
  }
  if (error.status === status.unauthorizedStatus && !config?.sent && !config?.__isRetryRequest) {
    config.sent = true
    const response = await memoizedRefreshToken()
    if (response?.status === 200 && response?.access_token && response?.refresh_token) {
      config.headers['Authorization'] = `Bearer ${response?.access_token}`
    }

    return appAPIServer(config)
  }

  return Promise.reject(error)
}

const addInterceptorToAxiosInstances = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(requestInterceptor)
  axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor)
}

const redirectToLoginPage = async () => {
  let pathName = window.location.pathname
  pathName = pathName.replace(/^\/[\w\d]+\//, '')
  await window.localStorage.clear()
  window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login?returnUrl=/${pathName}`
}

addInterceptorToAxiosInstances(appAPIServer)
