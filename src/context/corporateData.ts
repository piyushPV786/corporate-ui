import { AccountCircle, BookEducation, CardAccountMail, ChartBoxOutline, SchoolOutline } from 'mdi-material-ui'
import { StudentService } from 'src/service'
import {
  ICorporateStudentDocumentApproveParams,
  IDocumentsStatusType,
  IDynamicObject
} from 'src/types/apps/corporatTypes'
import { messages, status } from './common'
import { errorToast, successToast } from 'src/components/Toast'

export const corporateConstant: IDynamicObject = {
  preview: '/corporate-students/preview',
  list: '/corporate-students/list/',
  dateOfBirth: 'dateOfBirth',
  address: 'nationalDetails',
  mobileNumber: 'mobileNumber',
  Enrolled: 'Review Pending',
  reviewPending: 'Review Pending',
  REJECT: 'Rejected',
  'PROG-ADMITTED': 'Enrolled to the Qualification',
  getNameCommonListArray: [
    'race',
    'language',
    'socioEconomicStatusCode',
    'nationality',
    'gender',
    'qualificationCode',
    'country',
    'state',
    'program',
    'identificationDocumentType'
  ],
  getFullNameCommonListArray: ['projectManager', 'accountManager'],
  documentCommentValidationMSG: 'Please Type reason to Reject',
  approveStudent: 'Student is Approved Successfully',
  rejectStudent: 'Student is Rejected Successfully'
}

export const corporateStudentPreviewCardSections = [
  {
    sectionTitle: 'Project Details',
    slug: 'projectDetails',
    id: 1,
    sectionIcon: ChartBoxOutline,
    sectionSubItems: {
      parentName: 'project',
      list: ['name', 'code', 'program', 'projectManager', 'accountManager', 'noOfStudent']
    },
    sectionItems: [],
    isDarkBg: true
  },
  {
    sectionTitle: 'Personal Information',
    slug: 'personalInformation',
    id: 2,
    sectionIcon: AccountCircle,
    sectionSubItems: {
      parentName: 'lead',
      list: ['firstName', 'middleName', 'lastName', 'gender', 'dateOfBirth', 'nationality', 'race', 'language']
    }
  },
  {
    sectionTitle: 'Contact Details',
    slug: 'contactDetails',
    id: 3,
    sectionIcon: BookEducation,
    sectionSubItems: {
      parentName: 'lead',
      list: ['email', 'mobileNumber']
    }
  },
  {
    sectionTitle: 'National ID and Address',
    slug: 'nationalDetails',
    id: 4,
    sectionIcon: CardAccountMail,
    sectionSubItems: {
      parentName: 'lead',
      list: ['street', 'city', 'state', 'country', 'zipcode']
    },
    grayBgItems: {
      title: 'National ID',
      sectionSubItems: {
        parentName: 'lead',
        list: ['identificationDocumentType', 'identificationNumber']
      }
    }
  },
  {
    sectionTitle: 'Education Details',
    slug: 'educationDetails',
    id: 5,
    sectionIcon: SchoolOutline,
    sectionSubItems: {
      parentName: 'education',
      list: ['qualificationCode']
    }
  }
]

export const corporatePreviewNames: Record<string, any> = {
  lead: {
    zipcode: 'Zip / Pin code',
    country: 'Country',
    state: 'State',
    suburb: 'Suburb',
    city: 'City',
    street: 'Street Address',
    whatAsppNumber: 'WhatsApp Number',
    homePhone: 'Home Phone',
    alternativeContact: 'Alternative Number',
    mobileNumber: 'Mobile Number',
    email: 'Email',
    BDEName: 'BDE Name',
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    gender: 'Gender',
    dateOfBirth: 'Date of Birth',
    nationality: 'Nationality',
    citizenship: 'Citizenship',
    race: 'Race/ Equity Code',
    language: 'Home Language',
    socioEconomicStatusCode: 'Socio Economic Status Code',
    identificationNumber: 'ID No',
    identificationDocumentType: 'ID Type',

    highestQualificationCompletedYear: 'Completed Year'
  },
  project: {
    accountManager: 'Account Manager',
    projectManager: 'Project Manager',
    program: 'Qualification',
    code: 'Project Code',
    noOfStudent: 'No of Students',
    name: 'Project Name'
  },
  education: {
    qualificationCode: 'Highest Qualification'
  }
}

export const accordionExpandInitialState = {
  projectDetails: true,
  personalInformation: true,
  contactDetails: true,
  nationalDetails: true,
  educationDetails: true,
  documentsDetails: true
}

export const documentApproveAPI = async (
  documentPayload: ICorporateStudentDocumentApproveParams[],
  docStatus: IDocumentsStatusType
) => {
  const result = await StudentService.approveCorporateStudentDocument(documentPayload)
  if (result?.statusCode === status?.successCode) {
    if (docStatus === status.approve) {
      successToast(messages.approve)
    } else {
      successToast(messages.reject)
    }
  } else {
    errorToast(messages.error)
  }
}

export const placeDivContentCenter = {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex'
}

export const filterOptionDefaultValues = {
  programs: [],
  projects: [],
  status: []
}
