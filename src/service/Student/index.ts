import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { apiEndPoints, baseApiURL } from '../config'
import { AddressParams, CourseParams, DataParams, StudentParams } from 'src/types/apps/dataTypes'
import { DataParams as DashboardDataParams } from 'src/service/Dashboard'
import { PaymentProof } from 'src/types/apps/invoiceTypes'
import { IAddProjectDocumentsParamTypes } from 'src/types/apps/projectTypes'
import { IAcceptCorporateStudentParams, ICorporateStudentDocumentApproveParams } from 'src/types/apps/corporatTypes'
import { IExemptCoursePayloadType } from 'src/context/types'
import _ from 'lodash'
import { status } from 'src/context/common'

interface id {
  id: string
}

export default class Student {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/enrolment/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  async setVipStudent(params: DataParams) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.vipStudent
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async sendPaymentLink(params: id) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.sendPaymentLink
    try {
      const response = await this.apiServer.put(endUrlName, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error send payment link ========>', err?.message)
    }
    nProgress.done()
  }

  async updateStudent(params: StudentParams, appCode: string) {
    nProgress.start()
    let url = this.baseUrl + apiEndPoints.updatestudent
    url = url.replace(':appCode', appCode)
    try {
      const response = await this.apiServer.patch(url, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }
  async updateBursary(params: any, appCode: string) {
    nProgress.start()
    const url = this.baseUrl + `/sales/${appCode}${apiEndPoints.updateBursary}`

    try {
      const response = await this.apiServer.patch(url, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async updateCourse(params: CourseParams, appCode: string) {
    nProgress.start()
    let url = this.baseUrl + apiEndPoints.updatecourse
    url = url.replace(':appCode', appCode)
    try {
      const response = await this.apiServer.patch(url, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      if (err?.data?.statusCode === status.badRequestCode) {
        return err?.data
      }
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async updateAddress(params: AddressParams, appCode: string) {
    nProgress.start()
    let url = this.baseUrl + apiEndPoints.updateaddress
    url = url.replace(':appCode', appCode)
    try {
      const response = await this.apiServer.patch(url, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }
  async paymentProofUpdate(params: PaymentProof) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentList
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${params?.appCode}/document`, params?.payload)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async enrollStudent(code: string | number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.enrollStudent
    try {
      const response = await this.apiServer.post(`${endUrlName}${code}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async approveEnrollment(code: string | number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.approveEnrolment
    try {
      const response = await this.apiServer.post(`${endUrlName}${code}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error Approving enrolment ========>', err?.message)
    }
    nProgress.done()
  }

  async appDocuments(params: PaymentProof) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.enrolmentList
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${params?.appCode}/document`, params?.payload)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }
  async admissionDocs(params: PaymentProof) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.admission
    try {
      const response = await this.apiServer.patch(`${endUrlName}${params?.appCode}/document`, params?.payload)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async acceptCorporateStudent(params: IAcceptCorporateStudentParams) {
    nProgress.start()
    let data: { [key: string]: string } = {
      status: params?.status
    }
    if (!!params?.comments) {
      data = {
        ...data,
        comments: params.comments
      }
    }
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateStudentApprove}/${params.code}`
    try {
      const response = await this.apiServer.patch(endUrlName, data)

      return response.data
    } catch (err: any) {
      console.log('Error Accepting Corporate Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async approveCorporateStudentDocument(param: ICorporateStudentDocumentApproveParams[]) {
    nProgress.start()
    const body = {
      documents: param
    }
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateStudentApproveDocument}`
    try {
      const response = await this.apiServer.patch(endUrlName, body)

      return response.data
    } catch (err: any) {
      console.log('Error Approving Corporate Student Documents ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getCorporateStudentFilterOptionList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.corporateStudentFilterList
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error getting Corporate Student Filter Option List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getProjectDocuments(projectCode: number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.projectList
    try {
      const response = await this.apiServer.get(`${endUrlName}/${projectCode}/document`)

      return response?.data
    } catch (err: any) {
      console.log('Error fetching Project Document list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getProjectAll() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.projectList
    try {
      const response = await this.apiServer.get(`${endUrlName}/all`)

      return response?.data
    } catch (err: any) {
      console.log('Error fetching Project list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async addProjectDocuments(param: IAddProjectDocumentsParamTypes) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}/${param.projectCode}/document`

    try {
      const response = await this.apiServer.post(endUrlName, param.body)

      return response.data
    } catch (err: any) {
      console.log('Error Adding Project Document list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async deleteProjectDocuments(documentCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.projectDocumentDelete}/${documentCode}`

    try {
      const response = await this.apiServer.delete(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Deleting Document ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async checkIsRmatRequired(programCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.isRmatRequired}/${programCode}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log(`Error Checking RMAT is Required For ${programCode}  ========>`, err?.message)
    } finally {
      nProgress.done()
    }
  }
  async sendRmatLink(enrolmentCode: string, RMATprog: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.rmatLink}/${enrolmentCode}/${RMATprog}`

    try {
      const response = await this.apiServer.post(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Sending RMAT Link ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async RMATPassFail(appCode: string, status: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.rmat}${appCode}/status/${status}`

    try {
      const response = await this.apiServer.patch(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error is pass fail  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getRmatExamDetails(enrolmentCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.rmatExamDetails}/${enrolmentCode}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error getting RMAT Exam Details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async addProjectStudentDocument(params: any, code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudentDocument}/${code}/document`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching  Add project student document ========>', err?.message)
    }
  }

  async deleteProjectStudent(id: number | string, code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudentDocument}/${id}/document/${code}`
    try {
      const response = await this.apiServer.delete(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error Delete projectstudent Document Delete ========>', err?.message)
    }
  }
  async addExemptCourse(payload: { exemptCourse: Array<IExemptCoursePayloadType> }) {
    nProgress.start()

    const endUrlName = this.baseUrl + apiEndPoints.exemptCourse
    try {
      const response = await this.apiServer.post(endUrlName, payload)

      return response.data
    } catch (err: any) {
      console.log('Error Adding Exempt Module to Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async updateExemptCourse(payload: { exemptCourse: Array<IExemptCoursePayloadType> }, enrolmentCode: string) {
    nProgress.start()

    const endUrlName = `${this.baseUrl + apiEndPoints.exemptCourse}/${enrolmentCode}`
    try {
      const response = await this.apiServer.patch(endUrlName, payload)

      return response.data
    } catch (err: any) {
      console.log('Error in updating Exempt Module to Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getExemptCourse(applicationCode: string) {
    nProgress.start()

    const endUrlName = `${this.baseUrl + apiEndPoints.exemptCourse}/${applicationCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Getting Exempt Module Details of Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async unenrollStudent(studentCodes: Array<string>) {
    nProgress.start()

    const body = {
      studentCodes: studentCodes
    }
    const endUrlName = this.baseUrl + apiEndPoints.unenrollStudent
    try {
      const response = await this.apiServer.post(endUrlName, body)

      return response.data
    } catch (err: any) {
      console.log('Error Unrolling Student from Admitted Students ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async checkDuplicateProject(params: DashboardDataParams) {
    nProgress.start()

    const paramWithoutNullValue = !!params ? _.pickBy(params, _.identity) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''
    const endUrlName = `${this.baseUrl + apiEndPoints.checkDuplicateProject}${paramsAsQuery}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Unrolling Student from Admitted Students ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async enrollProjectStudent(studentCode: string) {
    nProgress.start()

    const endUrlName = `${this.baseUrl + apiEndPoints.enrollProjectStudent}/${studentCode}`
    const body = {
      status: status.enrolled
    }

    try {
      const response = await this.apiServer.patch(endUrlName, body)

      return response.data
    } catch (err: any) {
      console.log('Error in Enrolling the Project Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async generateQuote(applicationCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.admission}${applicationCode}/generate-quote`
    try {
      const response = await this.apiServer.post(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error in Generating Quote ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async regenerateQuote(applicationCode: string, payload: any) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.admission}${applicationCode}/regenerate-quote`

    try {
      const response = await this.apiServer.post(endUrlName, payload)

      return response.data
    } catch (err: any) {
      console.error('Error in Regenerating Quote ========>', err?.message)
    } finally {
      nProgress.done()
    }
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
  async getSSAStudentList(params: DashboardDataParams) {
    nProgress.start()
    const paramWithoutNullValue = !!params ? _.pickBy(params) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''
    const endUrlName = `${this.baseUrl + apiEndPoints.ssaList}${paramsAsQuery}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.log('Error Getting student list to assign SSA ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async assignSSA(body: { applicationCode: string[]; SsaCode: string }) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.assignSSA}`
    try {
      const response = await this.apiServer.post(endUrlName, body)

      return response?.data
    } catch (err: any) {
      console.log('Error Getting student list to assign SSA ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async downloadAcademicTranscript(studentCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.downloadAcademicTranscript}/${studentCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.error('Error Downloading Academic Transcript ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async checkDuplicateEmail(applicationCode: string, email: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.checkDuplicateEmail}/${email}/${applicationCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.error('Error Downloading Academic Transcript ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async zeroAppFee(appCode: string) {
    nProgress.start()
    const endUrlName = this.baseUrl + `${apiEndPoints.studentList}/${appCode}/status/BURSARY-APP-FEE-PEND`
    try {
      const response = await this.apiServer.patch(endUrlName)
      nProgress.done()

      return response?.data
    } catch (err: any) {
      console.log('Error in apply Zero for Application Fee ========>', err?.message)
    }
    nProgress.done()
  }
  async checkMandatoryDocument(applicationCode: string) {
    nProgress.start()
    let url = `${this.baseUrl}${apiEndPoints?.checkAndUpdateStatus}`
    url = url.replace(':applicationCode', applicationCode)
    try {
      const response = await this.apiServer.get(url)

      return response?.data
    } catch (err: any) {
      console.error('Error  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getActivityTimelineData(applicationCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.getActivityTimeline}/${applicationCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.error('Error fetching activity timeline Logs ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
}
