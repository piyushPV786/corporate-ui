import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { baseApiURL, apiEndPoints } from '../config'

export default class Aggregator {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/aggregator/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getStudentDetail(id: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.individualDetails
    try {
      const response = await this.apiServer.get(`${endUrlName}${id}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getEnrollStudentDetails(id: number | string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.enrollIndividualDetails
    try {
      const response = await this.apiServer.get(`${endUrlName}${id}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getStudentDetailsById(id: number | string, appCode: string) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.aggreegatStudents
    try {
      const response = await this.apiServer.get(`${endUrlName}${id}/${appCode}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async addComment(appCode: string, title: string) {
    const endUrlName = this.baseUrl + `${apiEndPoints.enrollIndividualDetails}${appCode}/comment`

    try {
      const response = await this.apiServer.post(`${endUrlName}`, {
        applicationCode: appCode,
        title: title
      })

      return response
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }
}
