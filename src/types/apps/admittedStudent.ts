export interface IAdmittedStudentTypes {
  admission: IAdmissionTypes
  application: IApplicationTypes
  academic: Array<[]>
  finance: Finance[]
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
  VIPType: string
  studentCode: string
  intakeCode: string
  intakeAcademicYear: number
  subStatus: string
  comments: string
  address: Address[]
  education: Education[]
  document: Array<[]>
  rmat: Array<[]>
}

export interface Address {
  isActive: boolean
  id: number
  street: string
  country: string
  state: string
  city: string
  zipcode: number
  addressType: string
}

export interface Finance {
  id: number
  AffordableRank: string
  CreditRisk: string
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

export interface IApplicationTypes {
  id: number
  isActive: boolean
  applicationCode: string
  status: string
  enrolmentCode: string
  studentCode: string
  userId: number
  username: string
  password: string
  studentId: string
  lead: ILeadTypes
  address: IAddressTypes[]
  education: IEducationTypes
  subStatus: string
  enrolment: {
    graduationDate: Date
  }
}

export interface ILeadTypes {
  student: any
  id: number
  isActive: boolean
  leadCode: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  studentCode: string
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
export interface IAddressExtendedTypes extends IAddressTypes {
  stateName: string
}
export interface IAddressStateTypes {
  name: string
  isoCode: string
  countryCode: string
  latitude: string
  longitude: string
}

export interface IEducationTypes {
  id: number
  isActive: boolean
  programCode: string
  programName: string
  studyModeCode: string
  qualificationCode: string
  socialMediaCode: string
  programFees: any
  highSchoolName: string
  programMode: any
  agentCode: string
  studentTypeCode: string
  bursaryName: any
  bursaryId: any
  isInternationDegree: boolean
}
