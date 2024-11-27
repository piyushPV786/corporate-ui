import axios, { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { baseApiURL, apiEndPoints } from '../config'
import { status } from 'src/context/common'
import { ICommonDocumentUploadParamTypes } from 'src/types/apps/projectTypes'

export interface DataParams {
  projectIdentificationType?: boolean
}

export default class Common {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getFileUrl(fileName: string, studentCode?: string | boolean) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.getFileUrl
    try {
      const response = await this.apiServer.get(
        `${endUrlName}?filename=${fileName}${studentCode ? `&studentCode=${studentCode}` : ''}`
      )
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getHighestQualification() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.qualification
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getStudyMode() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studyMode
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Study Mode detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getSocialMedia() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.socialMedia
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Social Media detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getAgent() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.agent
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getStudentType() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentType
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getAddressList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.addressList
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Address detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getCountryLists() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.countryList
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Country List detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getGenderList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.gender
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Gender detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getNationalityList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.nationality
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Nationality detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getNationalityStatus() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.nationalityStatus
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Nationality  Status detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getRace() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.race
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Race detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getLanguage() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.language
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching language detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getDisability() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.disability
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching disability detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getSocioEconomicList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.socioeconomic
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Socioeconomic detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getEmployeStatus() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.emplyoment
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Employed status detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getYear() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.year
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching year detail ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async documentUpload(param: ICommonDocumentUploadParamTypes) {
    nProgress.start()
    let response = false
    const endUrlName = `${this.baseUrl + apiEndPoints.uploadFileUrl}?filename=${param.filename}&filetype=${
      param.filetype
    }&studentCode=${param.studentCode}`

    try {
      const s3amazonawsUrl = await this.apiServer.get(endUrlName)
      if (s3amazonawsUrl?.data?.statusCode === status.successCode) {
        const isFileUploaded = await axios.put(decodeURIComponent(s3amazonawsUrl.data.data), param?.file, {
          onUploadProgress: param?.setUploadPercent
        })
        response = isFileUploaded.status === status.successCode
      } else {
        return response
      }

      return response
    } catch (err: any) {
      console.log('Error in Upload Document to Amazon AWS S3 ========>', err?.message)
    } finally {
      nProgress.done()

      return response
    }
  }
  async getDocumentTypeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.documentTypeList

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Fetching Document Type List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getCurrencyList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.currency
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching currency list ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getProjectDocumentTypeList(projectDocument = 'true') {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.documentTypeList}?projectDocument=${projectDocument}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Fetching Project Management Document Type List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getIdentificationTypeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.identificationType

    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error Fetching IdentificationType List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getCitizenShipList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.citizenShip
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching CitizenShip List  ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async identificationType(params: DataParams) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.identificationType}?projectIdentificationType=${
      params?.projectIdentificationType
    }`
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching IdentificationType List  ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async companyType() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.companyType
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response.data
    } catch (err: any) {
      console.log('Error fetching Company Type List  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getProgrammeBusinessUnit() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.programmeBusinessUnit
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response.data
    } catch (err: any) {
      console.log('Error fetching Programme Business Unit  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getCourseTypeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.courseType
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

  async getStatesByCountry(countryCode?: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.stateByCountry}/${countryCode ? countryCode : ''}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.log('Error fetching State List By Country Code ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getDocumentFileTypeList(projectDocument = 'false') {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.documentTypeList}?projectDocument=${projectDocument}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Fetching  Document File Type List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStudentStatus() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentStatus
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Student Status list ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async getAuditLog(applicationCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.getAuditLog}/${applicationCode}/${status.local}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.error('Error fetching Audit Logs ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getActivityTimelineData(formData: Record<string, any>, limit: any = 0) {
    nProgress.start()

    let queryParams = ''
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        queryParams += `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}&`
      }
    }
    queryParams = queryParams ? `?${queryParams.slice(0, -1)}` : ''
    if (limit) {
      queryParams += `&limit=${limit}`
    }

    // Define the endpoint URL
    const endUrlName = `${this.baseUrl + apiEndPoints.getAuditLog}`

    try {
      const response = await this.apiServer.get(`${endUrlName}${queryParams}`)

      return response.data
    } catch (err: any) {
      console.error('Error fetching Audit Logs ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getFeeModeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.feeModeLists
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async DocumentCode() {
    nProgress.start()
    const url = `${this.baseUrl + apiEndPoints?.documentCode}`
    try {
      const response = await this.apiServer.get(url)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error getting document code ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getFileSignUrl(fileName: string, filetype: string, studentCode: string) {
    const url = `${this.baseUrl}common/document/upload?filename=${fileName}&filetype=${filetype}&&studentCode=${studentCode}`
    const response = await this.apiServer.get(url)

    return response?.data?.data ? response?.data?.data : null
  }

  async uploadDocumentToAws(url: string, file: any, setUploadPercent?: any) {
    const response = await axios.put(url, file, {
      onUploadProgress: setUploadPercent
    })

    return response ? response : null
  }
}
