import { AxiosInstance } from 'axios'
import { allowedDocsForCreditVetting, apiEndPoints, baseApiURL } from '../config'
import { IAddNotes, IAddProjectstudentType, IGraduatePayloadTypes, IReassignPayloadTypes } from 'src/context/types'
import {
  IAddVenueTypes,
  IClientContact,
  IEnrolGroupTypes,
  IEnrollCorporateGroupTypesPayload,
  IPayloadTypes,
  IStudentManagementfilter,
  InvoiceEditInstallmentType,
  assignIntakeParams,
  intakePrams,
  searchFilter
} from 'src/types/apps/invoiceTypes'
import nProgress from 'nprogress'
import _ from 'lodash'
import {
  IStatusPayload,
  IStudentManagement,
  IUpdateProject,
  IUpdateStudentAddressInfo,
  IUpdateStudentContactInfo,
  IUpdateStudentPersonalInfo,
  IUpdateStudenteducationInfo,
  StudentReggieParams
} from 'src/types/apps/dataTypes'
import { IGenerateQuoteParams } from 'src/types/apps/quoteGenerationInterface'
import { IAssignIntake } from 'src/views/apps/project/components/BulkIntake'

export interface IIncludeParams {
  intakeCode: string
  programCode: string
}

export interface DataParams {
  q?: string
  status?: string
  pageSize?: number
  pageNumber?: number
  academicYear?: number
  groupCode?: string
  code?: string
  firstName?: string
  email?: string
  enrolmentCode?: string
  projectName?: string
  projectId?: number
  programName?: string
  courseType?: string
  search?: string
  projectCode?: string
}

export interface StatushistoryParams {
  status?: string
  studentCode?: string
  pageNumber?: number
  pageSize?: number
}
export interface GraduationStudentParams {
  programCode?: string
  academicYear?: string
  pageNumber?: number
  pageSize?: number
}

interface NotesDataParams {
  status: string
  pageSize: number
  pageNumber: number
  projectCode: any
}

interface studentDataParams {
  q: string
  pageSize: number
  pageNumber: number
  intakeCode: string
}

interface corporateStudentDataParams {
  q: string
  pageSize: number
  pageNumber: number
}

interface UploadDocumentParam {
  documentTypeCode: string
  fileName: string
  fileType: string
  applicationCode: string
}

interface enrolmentEligibilityParam {
  highestNqfLabel: number
  marks: number
  accessProgram: boolean
  applicationCode: string
}

interface rplParams {
  applicationCode?: string
  rplStatus?: string | null
  isSaqa?: boolean | null
  isMatric?: boolean | null
  isRpl?: boolean | null
}
interface statusParams {
  applicationCode: string
  remark: string
  userCode: string | undefined
  lastApplicationStatus?: string
  lastStudentTypeCode?: string
  userEmailAddress: string | undefined
}
export default class Dashboard {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/enrolment/`
  financeBaseUrl = `${baseApiURL}/finance/`

  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getStudentList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.studentList}?pageNumber=${params?.pageNumber}&&pageSize=${
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
  async getAllApplicationRecord(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.allApplicationRecord}?pageNumber=${params?.pageNumber}&&pageSize=${
      params?.pageSize
    }`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Academic Record list ========>', err?.message)
    }
  }
  async getStudentListbyintake(params?: studentDataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.salesSudents}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }&intakeCode=${params?.intakeCode}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async getEnrolmentList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.enrolmentList}?pageNumber=${params?.pageNumber}&&pageSize=${
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

  async getProjectStudentList(projectCode: string | number, params?: DataParams) {
    const paramWithoutNullValue = !!params ? _.pickBy(params, _.identity) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudents}/${projectCode}${paramsAsQuery}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Project Student list ========>', err?.message)
    }
  }

  async downloadProjectStudentList(code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.downloadStudent}/${code}`

    try {
      const response = await this.apiServer.get<any>(endUrlName, {
        responseType: 'blob'
      })

      return response
    } catch (err: any) {
      console.log('Error downloading Project Student list ========>', err?.message)
    }
  }

  async downloadStudentTemplate(params: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.downloadTemplate}/${params}`

    try {
      const response = await this.apiServer.get<any>(endUrlName, {
        responseType: 'blob'
      })

      return response
    } catch (err: any) {
      console.log('Error downloading Student Template ========>', err?.message)
    }
  }
  async uploadBulkStudent(projectCode: number | string, file: File | any) {
    const formData = new FormData()
    formData.append('projectCode', projectCode as string)
    formData.append('file', file)

    const endUrlName = this.baseUrl + apiEndPoints.uploadBulkStudent

    try {
      const response = await this.apiServer.post(`${endUrlName}`, formData)

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
    }
  }

  async uploadDocument(params: UploadDocumentParam) {
    const endUrlName = this.baseUrl + apiEndPoints.uploadDocument

    try {
      const response = await this.apiServer.post(`${endUrlName}`, params)

      return response
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }

  async createEnrolmentEligibility(params: enrolmentEligibilityParam) {
    const endUrlName = this.baseUrl + apiEndPoints.enrolmentEligibility

    try {
      const response = await this.apiServer.post(`${endUrlName}`, params)

      return response
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }

  async updateEnrolmentEligibility(params: enrolmentEligibilityParam) {
    const endUrlName = this.baseUrl + apiEndPoints.enrolmentEligibility

    try {
      const response = await this.apiServer.patch(`${endUrlName}/${params?.applicationCode}`, params)

      return response
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }

  async getAdmissionList(params?: DataParams) {
    nProgress.start()
    const paramWithoutNullValue = !!params ? _.pickBy(params, _.identity) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''

    const endUrlName = `${this.baseUrl + apiEndPoints.admission}${paramsAsQuery}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getAdmissionDetail(id: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.admission
    try {
      const response = await this.apiServer.get(`${endUrlName}${id}`)

      return response
    } catch (err: any) {
      console.log('Error fetching student detail ========>', err?.message)
    }
  }
  async getCorporateList(params?: DataParams | any) {
    let endUrlName = `${this.baseUrl + apiEndPoints.corporateEd}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.isActive) endUrlName = `${endUrlName}&isActive=${params?.isActive}`
    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    if (params?.companyType) endUrlName = `${endUrlName}&companyType=${params?.companyType}`
    if (params?.code) endUrlName = `${endUrlName}&code=${params?.code}`
    if (params?.name) endUrlName = `${endUrlName}&name=${params?.name}`
    if (params?.country) endUrlName = `${endUrlName}&country=${params?.country}`
    if (params?.state) endUrlName = `${endUrlName}&state=${params?.state}`
    if (params?.pincode) endUrlName = `${endUrlName}&pincode=${params?.pincode}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching corporate list ========>', err?.message)
    }
  }
  async getCorporateListForDropdown() {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateEdDropdownList}`

    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching corporate list ========>', err?.message)
    }
  }
  async updateCorporate(code: any, params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateEd}/${code}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating corporate ========>', err?.message)
    }
  }
  async addCorporate(params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateEd}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error creating corporate ========>', err?.message)
    }
  }

  async getCorporateStudentGroupList(params?: DataParams, filterParams?: IStudentManagementfilter) {
    let endUrlName = `${this.baseUrl + apiEndPoints.corporateStudentManagement}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    if (filterParams?.groupCode) endUrlName = `${endUrlName}&groupCode=${filterParams?.groupCode}`
    if (filterParams?.groupName) endUrlName = `${endUrlName}&groupName=${filterParams?.groupName}`
    if (filterParams?.programName) endUrlName = `${endUrlName}&programCode=${filterParams?.programName}`
    if (filterParams?.academicYear) endUrlName = `${endUrlName}&academicYear=${filterParams?.academicYear}`
    if (filterParams?.intakeName) endUrlName = `${endUrlName}&intakeCode=${filterParams?.intakeName}`
    if (filterParams?.status) endUrlName = `${endUrlName}&status=${filterParams?.status}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Student management list ========>', err?.message)
    }
  }

  async getCorporateStudentListByGroup(groupId: string, params?: corporateStudentDataParams) {
    let endUrlName = `${this.baseUrl}${apiEndPoints.corporateGroupStudents}/${groupId}?pageNumber=${params?.pageNumber}&pageSize=${params?.pageSize}`
    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`

    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async enrollCorporateStudent(enrolGroups: IEnrollCorporateGroupTypesPayload) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.enrollCorporateGroup}`

    try {
      const response = await this.apiServer.patch<any>(endUrlName, enrolGroups)

      return response
    } catch (err: any) {
      console.log('Error fetching Enroll Intake details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getProjectList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.projectList}?pageNumber=${params?.pageNumber}&&pageSize=${
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

  async getProject(code: string | number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}/${code}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async editProgramAndCourseDetail(code: string | number, payload: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}/${code}/programDetails`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...payload })

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }
  async getProgramAndCourseDetail(id: string | number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}/${id}/programDetail`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }
  async createProject(params?: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }
  async updateProject(params: any, code: number | string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectList}/${code}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating project list ========>', err?.message)
    }
  }
  async getNotesList(params?: NotesDataParams) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectNotes}?pageNumber=${params?.pageNumber}&&pageSize=${
      params?.pageSize
    }&&projectCode=${params?.projectCode}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Notes list ========>', err?.message)
    }
  }
  async createNotes(params?: IAddNotes) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectNotes}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error saving Notes list ========>', err?.message)
    }
  }

  async getCostContractDetail(projectCode: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.costContract
    try {
      const response = await this.apiServer.get<any>(`${endUrlName}${projectCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching cost and contract detail ========>', err?.message)
    }
  }

  async addEditCost(params: IPayloadTypes, code: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.costContract}${code}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching cost and contract list ========>', err?.message)
    }
  }

  async getInstallmentAllDetail(projectCode: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.installmentAll
    try {
      const response = await this.apiServer.get<any>(`${endUrlName}${projectCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching installment detail ========>', err?.message)
    }
  }

  async AddInstallmentDetails(params?: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.installment}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error Adding Installment list ========>', err?.message)
    }
  }
  async updateNotes(params: { notes: string }, id: string | number | undefined) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectNotes}/${id}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating notes ========>', err?.message)
    }
  }
  async deleteNotes(id: string | number | undefined) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectNotes}/${id}`
    try {
      const response = await this.apiServer.delete<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error deleting notes ========>', err?.message)
    }
  }

  async getInstallmentDetail(code: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.installmentAll
    try {
      const response = await this.apiServer.get<any>(`${endUrlName}${code}`)

      return response
    } catch (err: any) {
      console.log('Error fetching installment detail ========>', err?.message)
    }
  }

  async EditInstallment(params: InvoiceEditInstallmentType, id: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.installment}/${id}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })
      console.log('editinstallll', response)

      return response
    } catch (err: any) {
      console.log('Error fetching installment list ========>', err?.message)
    }
  }

  async getVenueLogisticDetail(projectCode: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.venueLogistics
    try {
      const response = await this.apiServer.get<any>(`${endUrlName}${projectCode}`)

      return response
    } catch (err: any) {
      console.log('Error fetching venueLogistics detail ========>', err?.message)
    }
  }

  async addVenueLogistic(params: IAddVenueTypes, code: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.venueLogistics}${code}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching add venueLogistic list ========>', err?.message)
    }
  }
  async getVenueList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.venueList}?pageNumber=${params?.pageNumber}&&pageSize=${
      params?.pageSize
    }&&projectCode=${params?.projectCode}`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching venue list ========>', err?.message)
    }
  }
  async createVenue(params?: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.venueList}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      return err
    }
  }

  async editVenue(params?: any, id?: number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.venueList}/${id}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching edit venue details ========>', err?.message)
    }
  }

  async getCorporateStudentsList(params?: DataParams) {
    nProgress.start()
    const paramWithoutNullValue = !!params ? _.pickBy(params, _.identity) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''

    const endUrlName = `${this.baseUrl + apiEndPoints.corporateStudent}${paramsAsQuery}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error fetching corporate Student list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getCorporateStudentsDetailByCode(code: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateStudent}/${code}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error fetching Corporate Student by Id  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getIntakeList(params: intakePrams, filterParams: searchFilter) {
    let endUrlName = `${`${this.baseUrl + apiEndPoints?.intakeAssign}?reqFrom=${params?.reqFrom}`}&&pageNumber=${
      params?.pageNumber
    }&&pageSize=${params?.pageSize}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    if (filterParams?.status) endUrlName = `${endUrlName}&&status=${filterParams?.status}`
    if (filterParams?.name) endUrlName = `${endUrlName}&&name=${filterParams?.name}`
    if (filterParams?.email) endUrlName = `${endUrlName}&&email=${filterParams?.email}`
    if (filterParams?.interestedProgram) endUrlName = `${endUrlName}&&programCode=${filterParams?.interestedProgram}`
    if (filterParams?.intakeName) endUrlName = `${endUrlName}&&intakeCode=${filterParams?.intakeName}`
    if (filterParams?.studentType) endUrlName = `${endUrlName}&&studentType=${filterParams?.studentType}`
    if (filterParams?.studyMode) endUrlName = `${endUrlName}&&studyMode=${filterParams?.studyMode}`
    if (filterParams?.studentId) endUrlName = `${endUrlName}&&studentCode=${filterParams?.studentId}`
    if (filterParams?.contact) endUrlName = `${endUrlName}&&mobileNumber=${filterParams?.contact}`
    if (filterParams?.academicYear) endUrlName = `${endUrlName}&&academicYear=${filterParams?.academicYear}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching venue list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async assignIntake(params: assignIntakeParams, studentCode: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.intakeAssign}/${studentCode}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching edit venue details ========>', err?.message)
    }
  }
  async addProjectStudentDraft(params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudentDraft}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching Add student Draft list ========>', err?.message)
    }
  }

  async editProjectDraft(params?: any, code?: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudentDraft}/${code}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching edit student Draft details ========>', err?.message)
    }
  }
  async enrollProjectStudentDraft(params?: IAddProjectstudentType, code?: string) {
    nProgress.start()

    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudentDraft}/${code}/enroll`
    try {
      const response = await this.apiServer.post<any>(endUrlName, params)

      return response.data
    } catch (err: any) {
      console.log('Error enroll draft student details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async addProjectStudent(params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectStudent}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching Add student  list ========>', err?.message)
    }
  }
  async getProjectStudentById(id: number | string) {
    const endUrlName = this.baseUrl + apiEndPoints.projectStudent
    try {
      const response = await this.apiServer.get(`${endUrlName}${id}`)

      return response
    } catch (err: any) {
      console.log('Error fetching Student by Id  ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getClientContactList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.projectContactDetails}?pageNumber=${params?.pageNumber}&&pageSize=${
      params?.pageSize
    }&&projectCode=${params?.projectCode}`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Client Contact list ========>', err?.message)
    }
  }
  async createClientContact(params?: IClientContact) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectContactDetails}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching Client Contact ========>', err)

      return err
    }
  }

  async editClientContact(params?: IClientContact, id?: number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectContactDetails}/${id}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error fetching edit Client Contact details ========>', err)

      return err
    }
  }
  async deleteClientContact(id?: number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.projectContactDetails}/${id}`
    try {
      const response = await this.apiServer.delete(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error Delete Client Contact ========>', err?.message)
    }
  }

  async getErollStudentList(params: intakePrams, filterParams: searchFilter) {
    let endUrlName = `${`${this.baseUrl + apiEndPoints?.intakeAssign}?reqFrom=${params?.reqFrom}`}&&pageNumber=${
      params?.pageNumber
    }&&pageSize=${params?.pageSize}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    if (filterParams?.status) endUrlName = `${endUrlName}&&status=${filterParams?.status}`
    if (filterParams?.name) endUrlName = `${endUrlName}&&name=${filterParams?.name}`
    if (filterParams?.email) endUrlName = `${endUrlName}&&email=${filterParams?.email}`
    if (filterParams?.interestedProgram) endUrlName = `${endUrlName}&&programCode=${filterParams?.interestedProgram}`
    if (filterParams?.intakeName) endUrlName = `${endUrlName}&&intakeCode=${filterParams?.intakeName}`
    if (filterParams?.studentType) endUrlName = `${endUrlName}&&studentType=${filterParams?.studentType}`
    if (filterParams?.studyMode) endUrlName = `${endUrlName}&&studyMode=${filterParams?.studyMode}`
    if (filterParams?.studentId) endUrlName = `${endUrlName}&&studentCode=${filterParams?.studentId}`
    if (filterParams?.contact) endUrlName = `${endUrlName}&&mobileNumber=${filterParams?.contact}`
    if (filterParams?.academicYear) endUrlName = `${endUrlName}&&academicYear=${filterParams?.academicYear}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error Eroll Student list ========>', err?.message)
    }
  }

  async editEnrollStudent(enrolGroups: Array<IEnrolGroupTypes>) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.intakeAssign}/enroll-student`

    try {
      const response = await this.apiServer.patch<any>(endUrlName, { groups: enrolGroups })

      return response
    } catch (err: any) {
      console.log('Error fetching Enroll Intake details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async editReassignStudent(payload: IReassignPayloadTypes) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.reassign}`

    try {
      const response = await this.apiServer.post<any>(endUrlName, payload)

      return response
    } catch (err: any) {
      console.log('Error fetching Enroll Intake details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async editGraduateStudent(payload: IGraduatePayloadTypes) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.graduationList}`

    try {
      const response = await this.apiServer.post<any>(endUrlName, payload)

      return response
    } catch (err: any) {
      console.log('Error fetching Enroll Intake details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStudentGroupList(params?: DataParams, filterParams?: IStudentManagementfilter) {
    let endUrlName = `${this.baseUrl + apiEndPoints.studentManagement}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    if (filterParams?.groupCode) endUrlName = `${endUrlName}&groupCode=${filterParams?.groupCode}`
    if (filterParams?.groupName) endUrlName = `${endUrlName}&groupName=${filterParams?.groupName}`
    if (filterParams?.programName) endUrlName = `${endUrlName}&programCode=${filterParams?.programName}`
    if (filterParams?.academicYear) endUrlName = `${endUrlName}&academicYear=${filterParams?.academicYear}`
    if (filterParams?.intakeName) endUrlName = `${endUrlName}&intakeCode=${filterParams?.intakeName}`
    if (filterParams?.status) endUrlName = `${endUrlName}&status=${filterParams?.status}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Student management list ========>', err?.message)
    }
  }

  async getIncludeStudentByIntakeCode(params: IIncludeParams) {
    const endUrlName = `${this.baseUrl + apiEndPoints.studentManagement}/student/filter/${params.intakeCode}/${
      params.programCode
    }`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching include student list ========>', err?.message)
    }
  }

  async addStudent(payload: IStudentManagement) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentManagement
    try {
      const response = await this.apiServer.post(endUrlName, payload)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error Adding Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async updateStudent(payload: any, id: number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.studentManagement
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${id}`, payload)

      return response
    } catch (err: any) {
      console.log('Error Updating Student ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getAllStudentIntakeList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.allStudentIntake
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async addUpdateProjectDetails(payload: IUpdateProject, id: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.projectDetails}${id}/projectDetails`
    try {
      const response = await this.apiServer.patch(endUrlName, payload)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getAdmittedStudentList(params: DataParams) {
    nProgress.start()
    const paramWithoutNullValue = !!params ? _.pickBy(params, _.identity) : {}
    const paramsAsQuery = !!paramWithoutNullValue
      ? `?${new URLSearchParams(paramWithoutNullValue as URLSearchParams).toString()}`
      : ''

    const endUrlName = `${this.baseUrl + apiEndPoints.admittedStudents}${paramsAsQuery}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response.data
    } catch (err: any) {
      console.log('Error Getting Admitted Student List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async addUpdateStudentPersonalInfo(payload: IUpdateStudentPersonalInfo, code: number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.personalInfo
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${code}/update/basic`, payload)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Personal Info ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async addUpdateStudentContactInfo(payload: IUpdateStudentContactInfo, code: number) {
    nProgress.start()

    const endUrlName = this.baseUrl + apiEndPoints.contactInfo
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${code}/update/basic`, payload)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Contact Info ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async addUpdateStudentAddressInfo(payload: IUpdateStudentAddressInfo, code: number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.addressInfo
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${code}/update/address`, payload)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Address Info ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async addUpdateStudentEducationInfo(payload: IUpdateStudenteducationInfo, code: number) {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.educationInfo
    try {
      const response = await this.apiServer.patch(`${endUrlName}/${code}/update/course`, payload)

      return response?.data
    } catch (err: any) {
      console.log('Error fetching Student Education Info ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async globalSearch(search: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints?.globalSearch}?search=${search}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching while global search ================>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async reUploadDocument(params: UploadDocumentParam, code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.enrolmentList}/${code}/${apiEndPoints.reUploadDocument}`
    try {
      const response = await this.apiServer.patch(endUrlName, params)

      return response.data
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }

  async editStudentStatus(payload: IStatusPayload, code: string | undefined, applicationCode: string | undefined) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.admittedStudent}`

    try {
      const response = await this.apiServer.patch(`${endUrlName}/${code}/${applicationCode}`, payload)

      return response
    } catch (err: any) {
      console.log('Error fetching Student Status details ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStatusHistory(params?: StatushistoryParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.statusHistory}?studentCode=${params?.studentCode}&&pageNumber=${
      params?.pageNumber
    }&&pageSize=${params?.pageSize}`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Status History list ========>', err?.message)
    }
  }

  async getStudentforGraduate(params: GraduationStudentParams) {
    nProgress.start()
    try {
      const response = await this.apiServer.get(
        `${this.baseUrl + apiEndPoints?.graduationList}?programCode=${params?.programCode}&academicYear=${
          params.academicYear
        }&pageNumber=${params?.pageNumber}&pageSize=${params?.pageSize}`
      )

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching academic records ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getStudentReggieNumber(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.reggieNumberData}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`
    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async generateReggieStudent(params: StudentReggieParams) {
    nProgress.start()
    const url = this.baseUrl + apiEndPoints.generateReggieStudent

    try {
      const response = await this.apiServer.post(url, { ...params })
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async generateQuote(params: IGenerateQuoteParams) {
    nProgress.start()
    const url = this.baseUrl + apiEndPoints.generateQuote
    try {
      const response = await this.apiServer.post(
        url,
        { ...params },
        params?.currency !== 'ZAR' ? { responseType: 'blob' } : {}
      )
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async getStudentDataByCode(searchParam: string) {
    nProgress.start()
    const url = this.baseUrl + apiEndPoints.getStudentData
    try {
      const response = await this.apiServer.get(`${url}/${searchParam}`)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
    nProgress.done()
  }

  async reggieCheckDuplicateEmail(email: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.reggieCheckDuplicateEmail}/${email}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.error('Error checking Email ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async reggieCheckDuplicateMobile(mobileNumber: string, mobileCountryCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.reggieCheckDuplicateMobile}/${mobileCountryCode}/${mobileNumber}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data
    } catch (err: any) {
      console.error('Error checking Mobile Number ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async downloadQuote(code: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.downloadQuote}/${code}`

    try {
      const response = await this.apiServer.get<any>(endUrlName, {
        responseType: 'blob'
      })

      return response
    } catch (err: any) {
      console.log('Error downloading Project Student list ========>', err?.message)
    }
  }

  async createRpl(params: rplParams) {
    const endUrlName = this.baseUrl + apiEndPoints.createRpl

    try {
      const response = await this.apiServer.post(`${endUrlName}`, params)

      return response
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }

  async updateRpl(params: rplParams, appCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.updateRpl}/${appCode}`
    try {
      const response = await this.apiServer.patch(endUrlName, params)

      return response.data
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }
  async updateStatus(params: statusParams) {
    const endUrlName = `${this.baseUrl + apiEndPoints.resetStatus}`
    try {
      const response = await this.apiServer.patch(endUrlName, params)

      return response.data
    } catch (err: any) {
      console.log('Error uploading document ========>', err?.message)
    }
  }
  async addSponsor(params: any) {
    const endUrlName = this.baseUrl + apiEndPoints.addSponsor

    try {
      const response = await this.apiServer.post(`${endUrlName}`, params)
      let createCreditHistory
      if (response?.data?.data?.id && allowedDocsForCreditVetting.includes(params.identificationDocumentType)) {
        const createCreditHistoryURL = `${this.financeBaseUrl}credit-history/sponsor/${params.applicationCode}/update/${response.data?.data?.id}/credit-record`
        try {
          await this.apiServer.post(createCreditHistoryURL)
        } catch (error: any) {
          console.log('Error in creating credit history', error?.data?.message)
          createCreditHistory = error?.data?.message
        }
      }

      return { response, createCreditHistory }
    } catch (err: any) {
      console.log('Error adding sponsor ========>', err?.message)
    }
  }

  async updateSponsor(params: any, id: number) {
    const endUrlName = this.baseUrl + apiEndPoints.updateSponsor

    try {
      const response = await this.apiServer.patch(`${endUrlName}/${id}`, params)

      return response
    } catch (err: any) {
      console.log('Error adding sponsor ========>', err?.message)
    }
  }
  async assignCorporateGroup(params: IAssignIntake) {
    const endUrlName = `${this.baseUrl + apiEndPoints.assignGroup}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, params)

      return response
    } catch (err: any) {
      console.log('Error fetching Corporate group details ========>', err?.message)
    }
  }
  async getAllGroupByProgCode(projectCode: string) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.allGroup}/${projectCode}`
    try {
      const response = await this.apiServer.patch(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error fetching Student Intake List ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async getCorporateGroupList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.corporateGroup}?pageNumber=${params?.pageNumber}&&pageSize=${
      params?.pageSize
    }`
    if (params?.status) endUrlName = `${endUrlName}&&status=${params?.status}`
    if (params?.q) endUrlName = `${endUrlName}&&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching Corporate group list ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async addCorporateGroup(params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateGroup}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error adding student list ========>', err?.message)
    }
  }
  async updateCorporateGroup(code: any, params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateGroup}/${code}`
    try {
      const response = await this.apiServer.patch<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating corporate group  ========>', err?.message)
    }
  }

  async checkDuplicateCorporateCode(code: string | number, id?: number) {
    nProgress.start()
    let endUrlName = `${this.baseUrl + apiEndPoints.corporateCode}?code=${code}`
    if (id) endUrlName = `${endUrlName}&corporateId=${id}`

    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data
    } catch (err: any) {
      console.log('Error in checking duplicate Module code ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async getCorporateManagerList(params?: DataParams) {
    let endUrlName = `${this.baseUrl + apiEndPoints.corporateManager}?pageNumber=${params?.pageNumber}&pageSize=${
      params?.pageSize
    }`

    if (params?.q) endUrlName = `${endUrlName}&search=${params?.q}`
    try {
      const response = await this.apiServer.get<any>(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching manager list ========>', err?.message)
    }
  }
  async createCorporateManager(params?: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateManager}`
    try {
      const response = await this.apiServer.post<any>(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error creating manager ========>', err?.message)

      return err?.data?.message
    }
  }
  async updateCorporateManager(params: any, code: number | string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateManager}/${code}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating manager ========>', err?.message)
      
      return err?.data?.message

    }
  }
  async deleteCorporateManager(code?: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateManager}/${code}`
    try {
      const response = await this.apiServer.delete(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error Delete Manager ========>', err?.message)
    }
  }
  async getCorporateProjectManagerList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.corporateProjectManagerList
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
  async getCorporateAccountManagerList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.corporateAccountManagerList
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
  async getPaymentTypesList() {
    nProgress.start()
    const endUrlName = this.baseUrl + apiEndPoints.paymentTypes
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching Payment Types list ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }
  async corporateStudentChangeStatus(params: any) {
    const endUrlName = `${this.baseUrl + apiEndPoints.corporateStudentChangeStatus}`
    try {
      const response = await this.apiServer.patch(endUrlName, { ...params })

      return response
    } catch (err: any) {
      console.log('Error updating status ========>', err?.message)
    }
  }
}
