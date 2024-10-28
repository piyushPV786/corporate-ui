import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { IStatusItem, commonListTypes, educationTypes } from 'src/types/apps/dataTypes'

export interface IIndexTypes {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}
export interface ISSACommonListTypes {
  ssaList: commonListTypes[]
  qualificationStatusList: IStatusItem[]
  studyMode: commonListTypes[]
  studyType: commonListTypes[]
  programs: commonListTypes[]
  academicYear: commonListTypes[]
}

export const errorMessage = {
  academic: 'Academic Year is Required',
  program: 'Program Name is Required'
}
export const ssaSuccessMessage = {
  assignedSuccessfully: 'The student support assigned successfully for the selected students.'
}

export enum SsaStatus {
  Assigned = 'ASSIGNED',
  NotAssigned = 'NOT-ASSIGNED'
}
export const ssaStatusLabels: IDynamicObject = {
  [SsaStatus.Assigned]: 'Assigned',
  [SsaStatus.NotAssigned]: 'Not assigned yet'
}
export const ssaStatusChipColor: IDynamicObject = {
  [SsaStatus.Assigned]: 'primary',
  [SsaStatus.NotAssigned]: undefined
}
export const ssaStatusList = [
  {
    id: 1,
    name: 'Assigned',
    code: SsaStatus.Assigned
  },
  {
    id: 2,
    name: 'Not Assigned',
    code: SsaStatus.NotAssigned
  }
]
export interface ISsaApiResponseTypes {
  data: ISSAStudentDataResponseTypes[]
  count: number
}
export interface ISSAStudentDataResponseTypes {
  application: any
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
  intakeAcademicYear: number
  subStatus: string
  comments: string
  VIPType: string
  SsaCode: string
  SsaStatus: string
  education: educationTypes[]
}
