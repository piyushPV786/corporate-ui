import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { baseApiURL, apiEndPoints } from '../config'

interface IDataParams {
  q: string
  pageNumber: number
  pageSize: number
}

export default class Apply {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/apply/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getStudentList(params: any) {
    let endUrlName = `${this.baseUrl + apiEndPoints.studentRecords}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async getStudentRecordList(params?: IDataParams) {
    nProgress.start()

    let endUrlName = `${this.baseUrl + apiEndPoints.studentRecord}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching student record list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async updateNewProgram(payload: any) {
    const url = `${this.baseUrl}${apiEndPoints?.newProgram}`
    const response = await this.apiServer.post(url, { ...payload })
    const result = response?.data?.data ? response?.data : {}

    return result
  }
  async updateStudentType(appCode: string, studentType: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.assignStudentType}/${appCode}/${studentType}`

    try {
      const response = await this.apiServer.patch(endUrlName)

      return response?.data
    } catch (err: any) {
      console.log('Error Updating student Type ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getStudentDetail(studentCode: string) {
    const route = apiEndPoints?.getStudentDetail?.replace(':studentCode', studentCode)
    const endUrlName = `${this.baseUrl + route}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : null
    } catch (err: any) {
      console.log('Error Updating student Type ========>', err)
    } finally {
      nProgress.done()
    }
  }
  async getStudentDetailAppCode(appCode: string) {
    const route = apiEndPoints?.getStudentDetailAppCode?.replace(':appCode', appCode)
    const endUrlName = `${this.baseUrl + route}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : null
    } catch (err: any) {
      console.log('Error Updating student Type ========>', err)
    } finally {
      nProgress.done()
    }
  }
  async getApplicationDetails(leadCode: string) {
    const route = apiEndPoints?.applicationDetails?.replace(':leadId', leadCode)
    const endUrlName = `${this.baseUrl + route}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : null
    } catch (err: any) {
      console.log('Error Updating Application Details ========>', err)
    } finally {
      nProgress.done()
    }
  }
  async getMasterData() {
    const url = `${this.baseUrl}${apiEndPoints?.loadMasterData}`

    try {
      const response = await this.apiServer.get(url)
      const result = response?.data?.data ? response?.data?.data : null

      return result
    } catch (err: any) {
      console.log('Error fetching student record list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async applicationDiscount(studentType: any, applicationCode: string, discountCode: any) {
    const url = `${this.baseUrl}${apiEndPoints?.studentList}/${applicationCode}/discount/${discountCode}?studentType=${studentType}`

    try {
      const response = await this.apiServer.get(url)
      const result = response?.data?.data ? response?.data?.data : {}

      return result
    } catch (e) {
      throw e
    }
  }
}
