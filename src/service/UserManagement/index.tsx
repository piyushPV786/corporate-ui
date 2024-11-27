import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { apiEndPoints, baseApiURL } from '../config'
import { status } from 'src/context/common'

export default class UserManagement {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/user-management/`
  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }

  async getRefreshToken() {
    nProgress.start()
    const endUrlName = `${baseApiURL}/${apiEndPoints.refreshToken}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('error')
    } finally {
      nProgress.done()
    }
  }

  async getUserDetails(email: any) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.userDetails}/${email}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error while fetching user details =========>')
    } finally {
      nProgress.done()
    }
  }
  async getRoles() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.roles
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.status === status.successCode && response.data.statusCode === status.successCode
        ? response.data.data
        : []
    } catch (err: any) {
      console.log('Error fetching Roles list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getAgents(role: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.agents}/${role}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.status === status.successCode && response.data.statusCode === status.successCode
        ? response.data.data
        : []
    } catch (err: any) {
      console.log('Error fetching Agents list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getProjectManagerList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.projectManager
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Project Manager List ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getAccountManagerList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.accountManager
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Account Manager List ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async requestAssess(payload: any) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.requestAccess
    try {
      const response = await this.apiServer.post(endUrlName, payload)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Account Manager List ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getSalesAgentList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.salesAgentList
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Sales Agent List ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
}
