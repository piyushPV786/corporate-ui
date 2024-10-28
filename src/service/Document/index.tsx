import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { apiEndPoints, baseApiURL } from '../config'
import { IFileTypePayload } from 'src/types/apps/dataTypes'

export default class Document {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/`
  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getDocumenFileType(documentCode: string, params: IFileTypePayload) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.documentFileType}${documentCode}/type`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, params)

      return response
    } catch (err: any) {
      console.log('Error fetching Document File Type detail ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async updateDocumentStatus(documentCode: string) {
    const route = apiEndPoints?.updateDocumentStatus.replace(':documentCode', documentCode)
    const url = `${this.baseUrl}${route}`
    const response = await this.apiServer.patch<any>(url)
    const result = response?.data ? response?.data : {}

    return result
  }

  async documentRemove(payload: any) {
    const url = `${this.baseUrl + apiEndPoints?.documentRemove}/${payload}`
    const response = await this.apiServer.delete(url)
    const result = response?.data?.data ? response?.data?.data : {}

    return result
  }

  async documentUpdate(payload: any) {
    const url = `${this.baseUrl}${apiEndPoints?.document}`
    const response = await this.apiServer.post(url, { ...payload })
    const result = response?.data?.data ? response?.data : {}

    return result
  }
}
