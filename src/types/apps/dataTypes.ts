import { ILeadTypes } from './admittedStudent'

export type educationTypes = {
  id: number
  programCode: string
  studyModeCode: string
  studyTypeCode: string
  studentTypeCode: string
  programName: string
  bursaryName: string
  bursaryId: string
  agentCode: string
  socialMediaCode: string
}
export type addressTypes = {
  id: number
  street: string
  country: string
  state: string
  city: string
  zipcode: string
  addressType: string
}
export type documentTypes = {
  id: number | string
  name: string
  status: string
  documentTypeCode: string
  Comments: string
  documentCode?: string
  applicationCode?: string
}
export type commonListTypes = {
  lastName?: string
  firstName?: string
  id: number | string
  name: string
  code: string
  symbol?: string
}

export type bursaryTypes = {
  id: number | string
  name: string
  mobile: string
  address: string
  email: string
  occupation: string
  vip: boolean
  bursaryFinances: Array<bursaryFinancesTypes>
}
export type bursaryFinancesTypes = {
  id: number | string
  sponsorAmount: number
  financialYear: number
  sanctionedAmount: number
  remaningAmount: number
  bursaryId: number | string
}
export interface StudentParams {
  firstName: string
  lastName: string
  emailId?: string
  email?: string
  mobileNumber: string
}
export interface CourseParams {
  programCode: string
  studyModeCode: string
  qualificationCode: string
  programMode?: string
  isInternationDegree: boolean
  highSchoolName: string
  programName: string
}
export interface AddressParams {
  addressType: string
  street: string
  country: string
  state: string
  city: string
  zipCode: string
}
export interface DataParams {
  reason: string
  id: string
  applicationCode: string
  VIPComment: string
}

export interface DocumentTypeData {
  code: string
  comment: string
  createdAt: string
  documentTypeCode: string
  fileExtension: string
  id: number
  name: string
  status: string
}

export interface IResultDetailsTypes {
  isActive: boolean
  id: number
  username: string
  password: string
  moodleId: string
  programId: string
  updatedAt: string
  createdAt: string
  exam: Array<IExamDetailsTypes>
}

export interface IExamDetailsTypes {
  isActive: boolean
  id: number
  level1: string
  level2: string
  level3: string
  level4: string
  level5: string
  level6: string
  result: string
  totalmarks: string
  updatedAt: string
  createdAt: string
}
export interface IRMATProgramTypes {
  id: number
  isActive: boolean
  name: string
  code: string
  moodleId: string
  maximumAttempts: number
  program: IProgramTypes
  isOptional: boolean
}

export interface IProgramTypes {
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
  regiProgramId: number
}

export interface IProjectManagerList {
  isActive: boolean
  id: number
  code: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  profileImage: string
  refreshToken: string
}

export interface IAccountManagerList {
  isActive: boolean
  id: number
  code: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  profileImage: string
  refreshToken: string
}

export interface IUpdateProject {
  name: string
  code: string
  projectManager: string
  accountManager: string
  corporateCode: string
  programBusinessUnit: string
  typeOfNotificationReceived: string
  submission: boolean
  varianceDetails: string
  releaseOfNotificationApprovedBy: string
  proposalSubmissionDate: string
}

export interface IStudentManagement {
  academicYear?: number
  programCode?: string
  groupCode?: string
  intakeCode: string
  student: string
  excludeStudent: string
}

export interface IUpdateStudentPersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  gender: string
  dateOfBirth: string
  nationality: string

  //citizenship: string
  //ifOthersSpecifyTheCitizenship: string
  race: string

  //ifOtherSpecifyEquityCode: string
  //homeLanguage: string
  language: string

  //socioEconomicStatusCode: string
  //disability: string
  //medicalIssueIfAny: string
}
export interface IUpdateStudentContactInfo {
  email: string
  mobileCountryCode: string
  mobileNumber: string
}
export interface IUpdateStudentAddressInfo {
  street: string
  suburb: string
  town: string
  province: string
  country: string
  zipcode: number

  // identificationDocumentType: string
  // ifOthersSpecifyTheIdType: string
  // identificationNumber: string
}
export interface IUpdateStudenteducationInfo {
  qualificationCode: string

  //highestQualificationCompletedYear: number
}
export interface IListOfCommonTypes {
  race?: commonListTypes[]
  language?: commonListTypes[]
  nationality?: commonListTypes[]
  gender?: commonListTypes[]
  citizenship?: commonListTypes[]
  socioeconomic?: commonListTypes[]
  disability?: commonListTypes[]
  country?: commonListTypes[]
  highestQualification?: commonListTypes[]
  idType?: commonListTypes[]
  year?: number[]
  state?: commonListTypes[]
}

export type IDocumentFile = {
  id: number | string
  name: string
  code: string
}

export interface IChangeFileRow {
  code: string
  documentTypeCode: string
  name: string
}

export interface IFileTypePayload {
  documentTypeCode: string
}

export interface IUpldateDocRow {
  code: string
  documentTypeCode: string
  name: string
  status: string
}

export interface IStatusItem {
  map(arg0: (item: IStatusItem) => void): unknown
  isActive: boolean
  id: number
  name: string
  code: string
  subStatus: SubStatu[]
}

export interface SubStatu {
  map(arg0: (itemstatus: SubStatu) => void): unknown
  isActive: boolean
  id: number
  name: string
  code: string
}

export interface IAllStatus {
  name: string
  code: string
  status?: string
}

export interface IStatusPayload {
  status?: string
  subStatus?: string
  comments?: string
}

export interface IStatusHistoryItem {
  isActive: boolean
  id: number
  updatedAt: Date
  status: string
  subStatus: string
  comments: string
  studentCode: string
  actionBy: string
}

export type IRecordsType = IRecords[]

export interface IRecords {
  lead: ILeadTypes
  id: number
  isActive: boolean
  studentCode: string
  studentName: string
  groupCode: string
  confirmedAt?: string
  status: string
  academicYear: number
  programCode: string
  courseCode: string
  mobileNumber: string
  mobileCountryCode: string
  identificationNumber: string
  email: string
  applicationStatus: string
  applicationSubStatus: any
  cum_laude: boolean
  graduation_status: string
  graduation_symbol: string
  total: number
}

export interface IAllProgramApiTypes {
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
  minimumTimePeriod: number
  maximumTimePeriod: number
  studyModeCode: IStudyModeCodeTypes[]
  course: ICourseTypes[]
  programSchedule: IProgramScheduleTypes[]
}

export interface IStudyModeCodeTypes {
  id: number
  isActive: boolean
  studyModeCode: string
  code: string
  name: string
}

export interface ICourseTypes {
  id: number
  isActive: boolean
  name: string
  code: string
  type: string
  academicYearOfProgram: number
  validThroughAcademicYearofStudy: number
  dependentCourseCode: string
}

export interface IProgramScheduleTypes {
  id: number
  isActive: boolean
  name: string
  studyModeCode: string
  status: string
  academicYearOfStudy: number
}

export interface StudentReggieParams {
  firstName: string
  lastName: string
  email: string
  mobileCountryCode: string
  mobileNumber: string
  middleName: string
  leadSource: string
  expectedStartDate: string
  paymentMode: string
  nationality: string
  identificationDocumentType: string
  identificationNumber: string
  programName: string
  programCode: string
  studyModeCode: string
  gender: string
  dateOfBirth: string
}
