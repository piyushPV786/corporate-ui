import { GridSelectionModel } from '@mui/x-data-grid'
import { ICommonParams } from 'src/types/apps/common'
import { ICourseTypes } from 'src/types/apps/dataTypes'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export interface UserDataType {
  isActive: boolean
  id: number
  code: string
  createdBy: any
  createdAt: string
  updatedBy: any
  updatedAt: string
  deletedBy: any
  deletedAt: any
  name: string
  emailAddress: string
  phoneNumber: any
  profileImage: any
  refreshToken: string
  roles: Role[]
  firstName: string
  lastName: string
  email: string
}

export interface Role {
  isActive: boolean
  id: number
  createdBy: any
  createdAt: string
  updatedBy: any
  updatedAt: string
  deletedBy: any
  deletedAt: any
  name: string
  code: string
  roleFeaturePermission: [
    {
      permission: {
        code: string
      }
      feature: {
        code: string
      }
    }
  ]
}

export interface ICourseList {
  code?: string
  id: number
  name: string
}

export interface IAcademicApi {
  courseCode: string
  courseName: string
  programId: number
  studentId: number
  id: number
  isActive: boolean
  year: number
  assessment: string
  assignments: string
  examination: string
  total: string
  isExempt: boolean
  symbol: string
  status: string
  studentCode: string
  isAssignmentPublish: boolean
  assignmentPublishDate: any
  isExaminationPublish: boolean
  examinationPublishDate: any
  isAssessmentPublish: boolean
  assessmentPublishDate: any
  course: ICourseTypes
  program: IprogramDataTypes
  formative: number
  summative: number
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}

export interface IAddNotes {
  projectCode: number | undefined | string
  notes: string
  madeBy: string
}

export interface DocTypes {
  appCode: string
  docCode: string
  status: string
  comment: string
}

export interface IPayment {
  applicationCode: string
  currencyCode: string
  discounAmount: string
  discountCode: string | null
  discountTypeCode: string | null
  documentCode: string
  enrolemntCode: string | null
  feeModeCode: string
  id: number
  isActive: boolean
  paymentDate: string
  paymentStatus: string
  paymentType: string | null
  referenceNumber: string
  studentCode: null
  totalAmount: string
  transactionId: string
  totalPaidAmount: string
}
export interface IAcademicApiType {
  applicationCode: string
  id: number
  education: {
    programCode: string
    programName: string
    programFees: string
    programMode: string
    qualificationCode: string
    studentTypeCode: string
    studyModeCode: string
  }
  enrolmentCode: string
  lead: {
    studentCode: string
    email: string
    firstName: string
    lastName: string
    mobileCountryCode: string
    mobileNumber: string
  }
  studentCode: string
  status: string
}

export interface IAddDocumentType {
  documentType: string
  comments: string
}

export interface IAddstudentDraftType {
  projectCode: string
  lead: {
    firstName: string
    middleName?: string // Optional
    lastName: string
    email: string
    mobileNumber: string
    mobileCountryCode: string
    dateOfBirth: string
    nationalityStatus: string
    permenantResident: string
    identificationNumber: string
    identificationDocumentType?: string
    gender: string
    nationality: string
    language: string
    race?: string
    isAgreedTermsAndConditions: boolean
  }
  address: {
    street: string
    country: string
    state: string
    city: string
    zipcode: string
    addressType: string
  }
  education: {
    qualificationCode: string
    highSchoolName: string
    isInternationDegree: boolean
  }
}

export interface IAddProjectstudentType {
  projectCode: string
  lead: {
    firstName: string
    middleName?: string // Optional
    lastName: string
    email: string
    mobileNumber: string
    mobileCountryCode: string
    dateOfBirth: string
    nationalityStatus: string
    permenantResident: string
    identificationNumber: string
    identificationDocumentType?: string
    gender: string
    nationality: string
    language: string
    race?: string
    isAgreedTermsAndConditions: boolean
  }
  address: {
    street: string
    country: string
    state: string
    city: string
    zipcode: string
    addressType: string
  }
  education: {
    qualificationCode: string
    highSchoolName: string
    isInternationDegree: boolean
  }
}

export interface IGroupAPITypes {
  data(selectedRow: GridSelectionModel, data: any): unknown
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

export interface Enrolment {
  isActive: boolean
  id: number
  intake: { code: string; name: string }
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
  studentCode?: string
  intakeCode?: string
  intakeAcademicYear?: number
}

export interface ICorporateGroupAPITypes {
  data(selectedRow: GridSelectionModel, data: any): unknown
  isActive: boolean
  itemNumber: number
  id: number
  name: string
  code: string
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
  intake: Intake
  project: ICommonParams
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
  academicYearOfStudy: number
  year: string
  startDate: string
  endDate: string
  status: string
  studentCount: number
  studyMode: string
  program: any
  semester: string
  courses: string[]
}

export interface IGroupTypes {
  code: string
  name: string
  id: number
  programId: number
  courses: string
  AcademicYear: string
  StudyMode: string
  Year: string
  Semester: string
}
export interface IProjectStudentDTOTypes {
  projectCode: string
  firstName: string
  middleName: string
  lastName: string
  gender: string
  dateOfBirth: Date
  nationality: string
  citizenship: string
  ifOthersSpecifyTheCitizenship: string
  race: string
  ifOtherSpecifyEquityCode: string
  homeLanguage: string
  socioEconomicStatusCode: string
  disability: string
  medicalIssueIfAny: string
  email: string
  contactNumberCountryCode: string
  contactNumber: string
  alternativeContactCountryCode: string
  alternativeContact: string
  homePhone: string
  whatsappNumberCountryCode: string
  whatsappNumber: string
  streetAddress: string
  suburb: string
  town: string
  province: string
  country: string
  zipCode: number
  idType: string
  ifOthersSpecifyTheIdType: string
  idNo: string
  highestQualification: string
  highestQualificationCompletedYear: number
  BDEName: string
  matricYear: number
  addressLine1: string
  addressLine2: string
  state: string
  code: string
  contactEmail: string
  homeLanguageSpecified: string
}
export interface IIntakeType {
  program: any
  semester: {
    code: string
    name: string
    id: number
  }
  code: string
  id: number
  name: string
  academicYear: number
  programName: string
  programCode: string
  year: string
  semesterName: string
  startDate: string
  endDate: string
  studentCount: number
  status: string
  semCode?: string
}
export interface IProgramAPITypes {
  id?: number
  name: string
  code: string
  nqfLevel: string
  noOfYear: number
  category: string
  isActive: boolean
  studyModeCodes: string | undefined
  studymode?: Array<string>
}
export interface studentRecords {
  enrolment: Enrolment
  lead: {
    studentCode: string
    email: string
    firstName: string
    lastName: string
    mobileCountryCode: string
    mobileNumber: string
  }
  application: any
  firstName: string
  id: number
  intakeCode: string
  lastName: string
  studentCode: string
}

export interface IGroupListbyyearCode {
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
  program: Program
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

export interface IAgentsType {
  isActive: boolean
  id: number
  name: string
  emailAddress: string
  code: string
  phoneNumber: string
  profileImage: string
  refreshToken: string
  comments: string
}

export interface IExemptCoursePayloadType {
  name: string
  code: string
}

export interface IReassignPayloadTypes {
  applicationCode: (string | null)[]
  agentCode: string
}
export interface IGraduatePayloadTypes {
  studentCode: (string | null)[]
}

export interface IprogramDataTypes {
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
  isProject: boolean
  projectCode: string
  semester: Semester[]
}

export interface Semester {
  id: number
  isActive: boolean
  name: string
  code: string
  description: string
  studyYear: number
}

export type LeadOrSponsorType = 'lead' | 'sponsor'
