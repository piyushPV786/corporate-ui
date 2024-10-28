import { documentStatus } from 'src/context/common'
import { InvoiceType } from './invoiceTypes'

export interface ICorporateProjectTypes {
  code: string
  program: string
  name: string
  courseType: string
  isActive: boolean
  id: number
  projectManager: string
  accountManager: string
  noOfStudent: number
}
export interface ICorporateProgramTypes {
  project: string
  name: string
  courseType: string
}
export interface ICorporateStudentType {
  firstName: string
  middleName: string
  lastName: string
  email: string
  contactNumber: number
  enrolment: InvoiceType
  status: string
  id: number
  project: ICorporateProjectTypes
  program: ICorporateProgramTypes
  documents: {
    data: Array<ICorporateStudentDocumentTypes>
    count: number
  }
  isActive: boolean
  balance: number
  VIPStatus: boolean
  VIPComment: string
  contactNumberCountryCode: string
  highestQualification: string
  nationalId: string
  BDEName: string
  gender: string
  dateOfBirth: string
  matricYear: string
  nationality: string
  alternativeContactCountryCode: string
  alternativeContact: string
  addressLine1: string
  addressLine2: string
  country: string
  state: string
  zipCode: number
  regNo: string
  homePhone: string
  highestQualificationCompletedYear: number
  streetAddress: string
  province: string
  town: string
  suburb: string
  code: string
  idType: string
  ifOthersSpecifyTheIdType: string
  idNo: string
  citizenship: string
  ifOthersSpecifyTheCitizenship: string
  homeLanguage: string
  race: string
  whatsappNumber: string
  ifOtherSpecifyEquityCode: string
  socioEconomicStatusCode: string
  medicalIssueIfAny: boolean
  disability: string
  comments: string
  contactEmail: string
  homeLanguageSpecified: string
  studentCode: string
}

export interface ICorporateStudent {
  id: number
  isActive: boolean
  status: string
  createdAt: string
  updatedAt: string
  applicationCode: string
  lead: {
    id: number
    firstName: string
    middleName: string
    lastName: string
    email: string
    mobileNumber: string
    mobileCountryCode: string
    dateOfBirth: string
    nationality: string
    gender: string
    race: string
    studentCode: string
    address: Array<{
      id: number
      street: string
      city: string
      state: string
      country: string
      zipcode: number
      addressType: string
    }>
  }
  project: {
    id: number
    name: string
    code: string
    projectManager: string
    studyMode: string
    accountManager: string
    program: string
    courseType: string
  }
  education: {
    id: number
    programCode: string
    programName: string
    studyModeCode: string
    qualificationCode: string
  }
  comments: string
  balance: number
  VIPStatus: boolean
  VIPComment: string
  enrolment: any
}

export interface ICorporateStudentListType {
  count: number
  data: Array<ICorporateStudent>
}
export interface ICorporateStudentDocumentTypes {
  id: number
  name: string
  status: string
  documentTypeCode: string
  Comments: string
}
export interface ICorporateStudentDocumentApproveParams {
  docCode: string
  status: string
  comments: string
  documentTypeCode: string
}
export interface IAcceptCorporateStudentParams {
  code: string
  status: string
  comments?: string
}

export interface ICorporateStudentFilterType {
  firstName: string
  email: string
  courseType: string
  enrolmentCode: string
  status: string
  projectName: string
  programName: string
}
export interface IDynamicObject {
  [key: string]: any
}
export interface IFilterOptionsTypes {
  programs: Array<any>
  projects: Array<any>
  status: Array<any>
}
export type IDocumentsStatusType = documentStatus.approved | documentStatus.rejected
