import { commonListTypes } from './dataTypes'
import { documentType } from './invoiceTypes'

export interface IUploadDocumentParam {
  file: File & { isNewlyAdded?: boolean }
  documentTypeCode: string
  comment: string
  id?: number
}
export interface IDocumentDialogPropsTypes {
  uploadDocumentApi: (param: IUploadDocumentParam, documentCode: string) => void
  documentAdding?: boolean
  documentTypeList: Array<commonListTypes>
  documentBtnTitle?: string
  documentBtnProps?: any
  showCommentSection?: boolean
  studentData?: any
  programs?: any[]
  projectCode?: string
}

export interface ICommonDocumentUploadParamTypes {
  filename: string
  filetype: string
  file: File
  studentCode: string
  setUploadPercent?: any
}
export interface IDocumentListResponseTypes {
  createdAt: string
  id: number
  name: string
  code: string
  documentTypeCode: string
  comment: string
}

export interface IProjectDocumentsPostApiTypes {
  documentTypeCode: string
  fileName: string
  fileType: string
  projectCode: string
  comment?: string
  code: string
}
export interface IAddProjectDocumentsParamTypes {
  projectCode: string
  body: IProjectDocumentsPostApiTypes
}

export interface IProjectStudentDocument {
  response: boolean
  documentCode: string
  document: documentType
}
export interface IProjectStudentTypes {
  isActive: boolean
  id: number
  status: string
  balance: number
  VIPStatus: boolean
  VIPComment: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  contactNumberCountryCode: string
  contactNumber: string
  highestQualification: string
  BDEName: string
  gender: string
  dateOfBirth: string
  matricYear: number
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
  whatsappNumberCountryCode: string
  whatsappNumber: string
  ifOtherSpecifyEquityCode: string
  socioEconomicStatusCode: string
  medicalIssueIfAny: boolean
  disability: string
  comments: string
  contactEmail: string
  homeLanguageSpecified: string
  lead: any
  documents: {
    data: documentType[]
    count: number
  }
  studentCode: string
  applicationCode: string
  education: any
  project: {
    name: string
    code: string
    program: string
    courseType: string
    projectManager: string
    accountManager: string
  }
}
