import { commonListTypes } from './dataTypes'

export type InvoiceStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  id: string | undefined
}

export type InvoiceClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}
export type InvoiceInstallmentType = {
  installmentName: string
  currency: string
  amount: number
  dueDate: string
  status: string
}
export type InvoiceEditInstallmentType = {
  name: string
  currency: string
  dueAmount: number
  dueDate: string
}
export type InvoiceAddInstallmentType = {
  projectId: number
  name: string
  currency: string
  dueAmount: number
  dueDate: string
}
export type projectStudentType = {
  id: number
  name: string
  contact: {
    email: string
    contactNumber: string
  }
  regNo: string
  nationalId: string
  status: string
}

export type IVenueType = {
  name: string
  facilitator: string
  date: string | any
}

export type InvoiceType = {
  enrolment: any
  lead: {
    student: any
    studentCode: any
    mobileNumber: any
    mobileCountryCode: any
    firstName: string
    lastName: string
    email: string
    nationality?: string
    identificationNumber?: string
    identificationDocumentType?: string
    leadSource?: string
    paymentMode?: string
    startDate?: string
  }
  corporateEd: {
    code: string
    name: string
  }
  VIPType: string
  affordableRank: string
  creditRisk: string
  code: string
  projectManager: string
  accountManager: string
  program: string
  courseType: string
  mobileCountryCode: any
  name: string
  total: number
  avatar: string
  service: string
  dueDate: string
  address: string
  company: string
  country: string
  contact: string
  avatarColor?: string
  issuedDate: string
  companyEmail: string

  // balance: string | number
  invoiceStatus: InvoiceStatus
  courseName: string
  studentType: string

  // studyMode: string
  // status: string
  isActive: boolean
  id: number
  applicationCode: string
  enrolmentCode: string
  createdBy: null
  createdAt: string
  updatedBy: null
  updatedAt: string
  deletedBy: null
  deletedAt: null
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  qualificationCode: string
  programCode: string
  studyMode: string
  studyModeCode: string
  studyType: string
  studyTypeCode: string
  status: string
  subStatus: string
  balance: string | number
  VIPStatus: string
  VIPComment: null
  paymentLink: string
  education: any
  studentCode: string
  intakeCode: string
  noOfStudent: number
  nationality?: string
  identificationNumber?: string
  documentType?: string
  leadSource?: string
  startDate?: string
  paymentMode?: string
  expectedStartDate?: string
  agent?: {
    lastName: any
    firstName: any
    name: string
    emailAddress: string
    email: string
  }
}

export type IdocumentDataType = {
  code?: string
  comments?: string
  createdAt?: Date
  documentTypeCode: string
  fileExtension?: string
  id: number
  name: string
  status: string
  documentCode?: string
}

export type InvoicePaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleInvoiceType = {
  studentdata: InvoiceType
  paymentDetails: InvoicePaymentType
}

export interface PaymentProof {
  appCode?: string | string[]
  payload: {
    documents: Array<{
      appCode?: string | string[]
      docCode: any
      status: string
      comment: string
    }>
  }
}

export interface ICurrencyList {
  code: string
  id: number
  name: string
  isActive: boolean
  symbol: string
}

export interface INotes {
  projectId?: number | string | undefined
  id: number
  madeBy: string
  madeByName: string
  notes: string
  createdAt: string
}
export interface IPayloadTypes {
  fullCost?: number
  contractCost?: number
  variance?: boolean
  varianceDetails?: string
  paymentType: string
}
export interface IFormDataTypes {
  id: number
  fullCost?: number
  contractCost?: number
  variance?: string
  varianceDetails?: string
  paymentType?: string
}

export interface IAddVenueTypes {
  accommodation?: boolean
  carHire?: boolean
  flights?: boolean
  venueCostIncluded?: boolean
  cateringInculded: boolean
}

export interface ICommon {
  code: string | null
  createdAt: string | null
  createdBy: string | null
  deletedAt: string | null
  deletedBy: string | null
  id: number
  isActive: boolean | null
  name: string | null
  updatedAt: string | null
  updatedBy: string | null
}

export interface IIntakeCommonLists {
  academicYear: number
  code: string | null
  createdAt: string | null
  createdBy: string | null
  deletedAt: string | null
  deletedBy: string | null
  endDate: string | null
  id: number
  isActive: boolean | null
  name: string
  programCode: string
  programId: string | null
  programName: string | null
  semesterCode: string | null
  semesterId: string | null
  semesterName: string | null
  startDate: string | null
  status: string | null
  studentCount: number
  updatedAt: string | null
  updatedBy: string | null
  year: string | null
}

export interface IProgram {
  id: number
  isActive: boolean
  createdBy: string | null
  createdAt: string | null
  updatedBy: string | null
  updatedAt: string | null
  deletedBy: string | null
  deletedAt: string | null
  name: string | null
  code: string | null
  description: string | null
  nqfLevel: string | number | null
  noOfYear: number | string | null
  category: string | null
  isRmat: boolean | null
  acceptanceLetter: string | null
  confirmationLetter: string | null
  studyModeCodes: string | null
}

export interface IResponse {
  count: number
  data: IProgram[]
}
export interface ICommonData {
  interestedPrograms: { data: IProgram[]; count: number } | null
  academicYears: number[] | null
  studyType: ICommon[] | null
  studyMode: ICommon[] | null
  intakeList: IIntakeCommonLists[] | null
}
export interface IEducation {
  isActive: boolean | null
  id: number
  createdBy: string | null
  createdAt: string | null
  updatedBy: string | null
  updatedAt: string | null
  deletedBy: string | null
  deletedAt: string | null
  programCode: string
  programName: string
  bursaryName: string | null
  bursaryId: string | null
  studyModeCode: string
  studyTypeCode: string | null
  studentTypeCode: string | null
}
export interface IIntakeData {
  enrolment: any
  isActive: boolean | null
  id: number
  createdBy: string | null
  createdAt: string | null
  updatedBy: string | null
  updatedAt: string | null
  deletedBy: string | null
  deletedAt: string | null
  enrolmentCode: string | null
  lead: {
    firstName: string | null
    lastName: string | null
    email: string | null
    mobileNumber: string | null
    mobileCountryCode: string | null
    dateOfBirth: string | null
    studentCode: string
  }
  identificationNumber: string | null
  applicationCode: string | null
  status: string
  VIPStatus: string | null
  VIPComment: string | null
  intakeCode: string
  intakeAcademicYear: string | null
  education: IEducation
}
export interface IIntakeLists {
  count: number
  data: IIntakeData[] | []
}

export interface IAllIntake {
  code: string
  id: number
  name: string
}

export interface IProgramList extends commonListTypes {
  name: string
  code: string
}
export interface IUpComingIntake {
  id: number
  isActive: boolean | null
  createdBy: string | null
  createdAt: string | null
  updatedBy: string | null
  updatedAt: string | null
  deletedBy: string | null
  deletedAt: string | null
  name: string | null
  code: string | null
  academicYear: number | string | null
  programName: string | null
  programId: string | null
  year: string | null
  semesterName: string | null
  semesterId: string | null
  startDate: string | null
  endDate: string | null
  status: string | null
  studentCount: number | string | null
  semesterCode: string | null
  programCode: string | null
}

export interface assignIntakeParams {
  intakeCode: any
  intakeAcademicYear: any
}

export interface searchFilter {
  name: string
  contact: string
  email: string
  studentId: string
  academicYear: string
  intakeName: string
  interestedProgram: string
  status: string
  studentType: string
  studyMode: string
}

export interface intakePrams {
  q: string
  pageSize: number
  pageNumber: number
  reqFrom: string
}

export type documentType = {
  isActive: boolean
  createdAt: Date
  updatedAt: string
  id: number
  createdBy: null | string
  updatedBy: null | string
  name: string
  code: string
  filePath: null | string
  fileExtension: string
  status: string
  documentTypeCode: string
  comment: null | string
  applicationCode: string
  enrolmentCode: null | string
  studentCode: null | string
  projectCode: null | string
}
export interface ICorporateStudentFilterType {
  firstName: string
  email: string
  courseType: string
  corporateName: string
  enrolmentCode: string
  status: string
  projectName: string
  program: string
}
export interface CorporateStudentType {
  firstName: string
  lastName: string
  email: string
  contactNumber: number
  enrolment: {
    enrolmentCode: string
  }
  status: string
  id: number
  project: {
    code: string
    program: string
  }
  program: {
    project: string
    name: string
    courseType: string
  }
}
export interface IClientContact {
  projectId?: number | string | undefined
  id: number
  title: string
  firstName: string
  lastName: string
  mobileCountryCode: string
  telephoneCountryCode: string
  mobileNumber: string
  telephoneNumber: string
  email: string
  department: string
  designation: string
  relationshipOwner: string
}

export interface IRMATConstTypes {
  isEligible: boolean
  result: string
  llb: boolean
}

export interface IEnrollregeniusTypes {
  isActive: boolean
  itemNumber: number
  id: number
  academicYear: number
  programCode: string
  groupCode: string
  intakeCode: string
  excludeStudent: string
  includeStudent: string
  status: string
  enrolment: Enrolment[]
  program: Program
  group: Group
  studentCount: number
  intake: Intake[]
}

export interface IReassignTypes {
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
  education: Education[]
}

export interface Education {
  isActive: boolean
  id: number
  programCode: string
  programName: string
  bursaryName: string
  bursaryId: string
  studyModeCode: string
  studyTypeCode: string
  studentTypeCode: string
  agentCode: string
  socialMediaCode: string
}

export interface Enrolment {
  isActive: boolean
  id: number
  enrolmentCode: string
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
  intakeCode?: string
  intakeAcademicYear?: number
}

export interface Program {
  id: number
  isActive: boolean
  name: string
  code: string
  description: string
  nqfLevel: string
  noOfYear: number
  category: string
  isRmat: boolean
  acceptanceLetter: string
  confirmationLetter: string
  SAQA_ID: string
  studyModeCodes: string
}

export interface Group {
  id: number
  isActive: boolean
  name: string
  code: string
  description: string
  programId: number
  academicYear: number
  studyModeCode: string
  studyYear: number
  status: string
  semesterId: number
}

export interface Intake {
  id: number
  isActive: boolean

  name: string
  code: string
  academicYear: number
  year: string
  startDate: string
  endDate: string
  status: string
  studentCount: number
  studyMode: string
  program: string
  semester: string
  courses: string[]
}

export interface IEnrolGroupTypes {
  groupCode: string
  studentCodes: Array<string>
  intakeCode: string
}

export interface IStudentManagementfilter {
  groupCode?: string
  groupName?: string
  programName?: string
  academicYear?: string
  intakeName?: string
  status?: string
}

export interface ICorporateDataTypes {
  isActive: boolean
  id: number
  name: string
  code: string
  companyType: string
  email: string
  phoneNumber: string
  corporateAddress: ICorporateAddressTypes[]
  studentCount: number
  projectCount: number
  isSameAddress: boolean
}

export interface ICorporateAddressTypes {
  isActive: boolean
  id: number
  address1: string
  address2: string
  country: string
  state: string
  pincode: string
  addressType: string
}
export interface IEnrollCorporateGroupTypes {
  groupCode: string
}

export interface IEnrollCorporateGroupTypesPayload {
  corporateGroups: IEnrollCorporateGroupTypes[]
}

export interface IRowContent {
  itemNumber?: number
  firstName: string
  lastName: string
  studentCode: string
  intakeCode: string
  application: any
  intake: {
    name: string
    code: string
    intakeCoursesCourse: {
      id: number
      course: {
        name: string
        code: string
      }
      batchCode: string
    }[]
    courses: {
      name: string
      code: string
    }[]
  }
  status: string
  enrolmentDate: Date
}

export interface ICorporateStudentRowContent {
  itemNumber?: number
  enrolment: {
    id: number
    applicationCode: string
    enrolmentDate: string
    application: {
      id: number
      status: string
      lead: {
        id: number
        studentCode: string
        firstName: string
        middleName: null
        lastName: string
        email: string
        mobileNumber: string
        mobileCountryCode: string
      }
    }
    corporateGroup: {
      name: string
      code: string
      intake: {
        name: string
        code: string
        courses: {
          name: string
          code: string
        }[]
      }
    }
  }
}

export interface IFilterFieldsTypes {
  id: number
  name: string
  label: string
  list?:
    | string[]
    | {
        name: string
        code: string
      }[]
}

export interface IStatusHistoryitem {
  id: number
  status: string
  subStatus: string
  comments: string
  updatedAt: string
}
