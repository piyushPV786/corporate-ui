import { IResultDetailsTypes } from './dataTypes'

export interface IStudentAggregatorTypes {
  application: IApplicationTypes
  payment: IPaymentTypes[]
  document: IDocumentTypes[]
  admission: IAdmissionTypes
}

export interface IApplicationTypes {
  id: number
  isActive: boolean
  applicationCode: string
  status: string
  enrolmentCode: string
  studentCode: string
  userId: string
  username: string
  password: string
  studentId: number
  lead: ILeadTypes
  address: IAddressTypes[]
  education: IEducationTypes
}

export interface ILeadTypes {
  id: number
  isActive: boolean
  leadCode: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  mobileNumber: string
  mobileCountryCode: string
  dateOfBirth: string
  identificationNumber: string
  identificationDocumentType: string
  gender: string
  nationality: string
  language: string
  race: string
  refreshToken: string
  nationalityStatus: string
  isAgreedTermsAndConditions: boolean
  permenantResident: string
}

export interface IAddressTypes {
  id: number
  isActive: boolean
  street: string
  country: string
  state: string
  city: string
  zipcode: number
  addressType: string
}

export interface IEducationTypes {
  id: number
  isActive: boolean
  programCode: string
  programName: string
  studyModeCode: string
  qualificationCode: string
  socialMediaCode: string
  programFees: string
  highSchoolName: string
  programMode: string
  agentCode: string
  studentTypeCode: string
  bursaryName: string
  bursaryId: string
  isInternationDegree: boolean
  applicationId: number
}

export interface IPaymentTypes {
  autoIdx: string
  isActive: boolean
  id: number
  transactionId: string
  totalAmount: string
  feeModeCode: string
  discountTypeCode: string
  discountCode: string
  discountAmount: string
  totalPaidAmount: string
  paymentStatus: string
  referenceNumber: string
  paymentType: string
  applicationCode: string
  enrolemntCode: string
  studentCode: string
  documentCode: string
  currencyCode: string
  bankName: string
  paymentDate: string
  comments: string
  dueDate: string
  dueAmount: string
  invoiceNumber?: string
  studentType?: string
  debit?: string
  reference?: string
  description?: string
  dtstamp?: string
}

export interface IDocumentTypes {
  isActive: boolean
  id: number
  name: string
  code: string
  filePath: string
  fileExtension: string
  status: string
  documentTypeCode: string
  comment: string
  applicationCode: string
  enrolmentCode: string
  studentCode: string
  projectCode: string
  projectStudentCode: string
  isContactClass: boolean
  programCode: string
}

export interface IAdmissionTypes {
  isActive: boolean
  id: number
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  mobileCountryCode: string
  dateOfBirth: string
  identificationNumber: string
  applicationCode: string
  status: string
  VIPStatus: string
  VIPComment: string
  studentCode: string
  intakeCode: string
  intakeAcademicYear: string
  address: IAddressTypes[]
  education: IEducationTypes[]
  document: IDocumentTypes[]
  rmat: Array<IResultDetailsTypes>
}
