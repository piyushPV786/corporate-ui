import { ThemeColor } from 'src/@core/layouts/types'
import { ICommonParams } from 'src/types/apps/common'
import { IDynamicObject } from 'src/types/apps/corporatTypes'

type LoginParams = {
  successCode: number
  successCodeOne: number
  successCodeArr: Array<number>
  unauthorizedStatus: number
  badRequestCode: number
  approve: string
  reject: string
  enrolled: string
  local: string
}
export const manualDocumentName = 'RMS-Manual.pdf'
export const applicationStatus = 'GRADUATED'
export const cancelledApplicationStatus = 'CANCELLED'
export const completedApplicationStatus = 'COMPLETED'

interface IDocumentStatusArrayTypes {
  [key: string]: Array<string>
}

interface IProjectStatus {
  Active: string
  Inactive: string
}

export enum Address {
  Postal = 'POSTAL'
}
export enum EMSRole {
  Sales = 'Sales',
  Admin = 'Admin',
  Admission = 'Admission',
  CorporateSales = 'Corporate_Sales',
  Academics = 'Academics',
  Assessment = 'Assessment',
  CRM = 'CRM',
  FINANCE = 'Finance',
  OPERATION = 'Operation'
}

export const AgentRole: any = {
  Sales: 'Admin_Sales',
  Admin: 'Admin_Sales',
  Admission: 'Admin_Admission',
  CorporateSales: 'Admin_Corporate_Sales',
  Academics: 'Admin_Academics',
  Assessment: 'Admin_Assessment',
  CRM: 'Admin_Corporate_Sales',
  FINANCE: 'Admin_Finance',
  OPERATION: 'Admin_Operation'
}
export const AddressTypeData = [
  {
    isActive: true,
    id: 1,
    name: 'Postal',
    code: 'POSTAL'
  },
  {
    isActive: true,
    id: 2,
    name: 'Residential',
    code: 'RESIDENTIAL'
  }
]
export const enrolmentRole = ['Admin', 'Sales', 'Admission', 'Corporate_Sales']

export enum feeModeCode {
  Application = 'APPLICATION',
  Program = 'PROGRAM',
  InvalidCurrency = 'Invalid Currency Code',
  TOTAL = 'TOTAL',
  Monthly = 'MONTHLY',
  Semester = 'SEMESTER',
  Annually = 'ANNUALLY'
}

export enum FileName {
  Template = 'student-template.xlsx',
  List = 'student-List.xlsx'
}

export const status: LoginParams = {
  successCode: 200,
  successCodeOne: 201,
  unauthorizedStatus: 401,
  successCodeArr: [200, 201],
  badRequestCode: 400,
  approve: 'APPROVED',
  reject: 'REJECT',
  enrolled: 'Enrolled',
  local: 'LOCAL'
}

export enum feeMode {
  APPLICATION = 'APPLICATION',
  TOTAL = 'TOTAL',
  MONTHLY = 'MONTHLY'
}

export const muiThemeColors: { [key: string]: ThemeColor } = {
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success'
}

export const DBMCode = 'DBM-Prog'

export const messages = {
  approve: 'Document Approve success',
  reject: 'Document rejected successfully',
  uploadDocument: 'Document Uploaded successfully',
  deleteDocument: 'Document Deleted successfully',
  error: 'Something went wrong',
  enroll: 'Student enroll success',
  payment: 'Send payment Link success',
  vip: 'The VIP Type was assigned successfully',
  download: 'All documents downloaded successfully!',
  bursary: 'Bursary details updated Successfully',
  dialogWarningMessage:
    'Please double-check the documents, information, and details provided by the applicant before approval',
  acceptLetter: 'acceptance letter generated successfully.',
  searchErrorMessage: 'Type minimun 3 characters',
  CostContractAdd: 'Cost and Contract Details Added successfully',
  CostContractEdit: 'Cost and Contract Details Updated successfully',
  InstallmentAdd: 'Installment Details Added successfully',
  InstallmentEdit: 'Installment Details Updated successfully',
  VenueLogisticsAdd: 'Venue logistics Details Added successfully',
  VenueLogisticsEdit: 'Venue logistics Details Updated successfully',
  validEmail: 'Please enter a valid email address like someone@example.com',
  programDocumentTypeValidation: 'Please Select Document Type',
  programDocumentFileValidation: 'Please upload any File',
  enrolAccept: 'Enrolment Approved Successfully',
  corporateAdded: 'added successfully',
  corporateEdited: 'edited successfully',
  intakeCourseValidationMessage: 'The courses in the group is not matching with courses in the intake selected',
  successUnenrollStudent: 'The selected student Unenrolled from the Qualification Successfully',
  filtersCleared: 'Filters Cleared Successfully',
  filtersApplied: 'Filter applied Successfully',
  ReUploadDocumnentError: 'Something went wrong while uploading document. please try again later',
  FileTypeMessage: 'File Type Changed Successfully',
  fileDownloadedMessage: 'File Downloaded Successfully',
  studentTypeUpdate: 'Student type assigned Successfully',
  documentFileType: 'Document File Type Updated Successfully',
  generateFinalFee: 'Quote re-generated successfully',
  downloadAcademicTranscript: 'Academic Transcript Downloaded Successfully',
  zeroAppFeeBursaryWarning:
    'Please double-check the Application Id, information, and details provided by the applicant before approve zero the Application Fee',
  reggieNumberGenerated: 'The Reggie number was generated successfully for',
  awsFileNotUploadMessage: 'Your file is not uploaded please reupload.',
  documentUploaded: 'Document uploaded successfully',
  sponsorAdded: 'Sponsor details added Sucessfully',
  sponsorUpdated: 'Sponsor details updated Sucessfully',
  generateInvoice: 'Invoice generated successfully.',
  nullData: 'User not found in Regenesys Database',
  quoteGenerated: 'quote will be downloaded in 2-3 mintues.',
  assignIntake: 'Intake assigned successfully'
}

export const dataMessages = {
  success: 'Data Saved Successfully',
  error: 'Error While Saving Data'
}

export const projectStudentDocumentMessage: IDynamicObject = {
  'file-invalid-type': 'Only PNG, JPEG and PDF files are Allowed',
  'file-too-large': 'File is larger than 3 MB'
}

export const admissionRMAT = {
  sendRMAT: 'Send RMAT Test Link',
  resendRMAT: 'Re-send RMAT test link',
  successSentRMAT: 'RMAT test link sent successfully',
  pending: 'RMAT-PENDING',
  rmatPass: 'RMAT-PASS',
  rmatFail: 'RMAT-FAIL',
  passFailRMAT: ['RMAT-PENDING', 'RMAT-PASS', 'RMAT-FAIL'],
  documentAccepted: 'APP-DOC-ACCEPTED',
  applicationStatus: ['RMAT-PENDING', 'APP-DOC-ACCEPTED', 'RMAT-FAIL', 'RMAT-PASS'],
  pass: 'Pass',
  fail: 'Fail',
  PASS: 'PASS',
  FAIL: 'FAIL'
}
export const admissionRMATResult: IDynamicObject = {
  Pass: 'success.main',
  Fail: 'error'
}
export const admissionRMATAttempts: IDynamicObject = {
  '1': 'Send RMAT Test Link',
  '2': 'Send 2nd attempt link',
  '3': 'Send 3rd attempt link',
  '4': 'Send 4th attempt link',
  '5': 'Send 5th attempt link',
  '6': 'Send 6th attempt link',
  '7': 'Send 7th attempt link'
}
export const venueMessages = {
  add: 'Venue Details added Successfully.',
  edit: 'Venue Details Updated Successfully.'
}
export const clientcontactMessages = {
  add: 'Client Contact Details added Successfully.',
  edit: 'Client Contact Details Updated Successfully.',
  delete: 'Client Contact Details Deleted Successfully.'
}
export const projectMessages = {
  add: 'Project Details added Successfully.',
  edit: 'Project Details Updated Successfully.',
  name: 'Please enter Project Name',
  code: 'Please enter Project Code',
  corporateEdCode: 'Please Select a Corporate',
  projectManager: 'Please Select a Project Manager',
  accountManager: 'Please Select a Account Manager',
  program: 'Please Select a Qualification',
  studyMode : 'Please Select Study Mode',
  courseType: 'Please Select a Module Type'
}

export const CorporateManagerMessages = {
  add: 'Manager Added Successfully',
  edit: 'Manager Updated Successfully',
  delete: 'Manager Deleted Successfully'
}

export enum documentStatus {
  pending = 'PENDING',
  approved = 'APPROVED',
  rejected = 'REJECTED',
  salesApproved = 'SALES_APPROVED',
  salesReject = 'SALES_REJECT',
  financeApproved = 'FINANCE_APPROVED',
  financeReject = 'FINANCE_REJECT',
  admissionApproved = 'ADMISSION_APPROVED',
  admissionReject = 'ADMISSION_REJECT',
  FinanceVerified = 'FINANCE_VERIFIED',
  AffordableRank = 'AFFORDABLE-RANK',
  EdForAllContract = 'EDFORALLCONTRACT',
  Study_Flexi_Calculation = 'STUDY-FLEXI-CALCULATION',
  Study_Flexi_Agreement = 'STUDY-FLEXI-AGREEMENT'
}
export const URLArray = ['/', '/login', '/login/']
export enum StudyModeType {
  Online = 'ONLINE'
}
export enum DocumentType {
  PaymentProof = 'PAYMENTPROOF',
  AcceptanceLetter = 'ACCEPTANCE-LETTER',
  BursaryLetter = 'BURSARYLETTER',
  FinanceVerified = 'FINANCE_VERIFIED',
  RegenerateQuote = 'Regenerate-Quote',
  AffordableRank = 'AFFODABLE-RANK',
  Quote = 'QUOTE',
  TermsAndConditions = 'TERMSANDCONDITION',
  PassPort = 'PASSPORT',
  Study_Flexi_Calculation = 'STUDY-FLEXI-CALCULATION',
  Study_Flexi_Agreement = 'STUDY-FLEXI-AGREEMENT'
}
export enum paymentType {
  online = 'ONLINE',
  offline = 'OFFLINE'
}

export enum AddStudent {
  BackToList = '/project/preview/',
  addstudentPreview = `/project/addStudent/Preview`
}

export enum FileSize {
  maxSize = 3 * 1024 * 1024,
  maxSize3Mb = 3 * 1024 * 1024,
  maxSize20Mb = 20 * 1024 * 1024
}

export const documentStatusArray: IDocumentStatusArrayTypes = {
  application: [
    'SALES_APPROVED',
    'SALES_REJECT',
    'APPROVED',
    'REJECT',
    'ADMISSION_APPROVED',
    'ADMISSION_REJECT',
    'FINANCE_VERIFIED'
  ],
  enrolment: ['SALES_APPROVED', 'SALES_REJECT', 'ADMISSION_APPROVED', 'ADMISSION_REJECT', 'FINANCE_VERIFIED'],
  admission: ['APPROVED', 'REJECTED', 'ADMISSION_APPROVED', 'SALES_REJECT', 'ADMISSION_REJECT', 'FINANCE_VERIFIED']
}
export const allRoles = {
  application: 'application',
  enrolment: 'enrolment',
  admission: 'admission',
  assignIntake: 'assignIntake',
  admittedStudent: 'admittedStudent',
  studentRecord: 'studentRecord'
}

export const ProjectStatusTypes: IProjectStatus = {
  Active: 'Active',
  Inactive: 'In active'
}

export enum Regex {
  Alpha_Numeric = '(?!^[0-9 ]*$)(?!^[a-zA-Z- ]*$)^([a-zA-Z0-9- ]{5,})$',
  Numeric = '(?!^[0-9 ]*$)',
  Alpha = '^[a-zA-Z]+$',
  Pascal_Case = '^[A-Z][a-z A-Z0-9-]+$'
}
export const EditStudentMessages = {
  firstNameRequired: ' First Name is Required',
  firstNameError:
    'First name must be character. Please ensure first letter of the name starts with an uppercase letter and use single spaces or hyphens only.',
  lastNameRequired: 'Last Name is Required',
  lastNameError:
    'Last Name must be character. Please ensure first letter of the name starts with an uppercase letter and use single spaces or hyphens only.',
  middleNameError:
    'Middle Name must be character. Please ensure first letter of the name starts with an uppercase letter and use single spaces or hyphens only.'
}
export const AddStudentMessages = {
  firstNameRequired: ' First Name is Required',
  firstNameError: 'First name must be character',
  middleNameError: 'Middle name must be character',
  lastNameRequired: 'last Name is Required',
  lastNameError: 'last Name must be character',
  genderRequired: 'Gender is required',
  birthRequired: 'Date of Birth is required',
  nationalityStatusRequired: 'Nationality Status is required',
  nationalityRequired: 'Nationality is required',
  documentTypeRequired: 'Document Type is required',
  expiryDateRequired: 'Expiry Date is required',
  identificationNumberRequired: 'Identification Number is required',
  citizenShipRequired: 'CitizenShip is required',
  ifOtherSpecifyRace: 'if Other Race is required',
  raceRequired: 'Race is required',
  ifOthersSpecifyTheCitizenship: 'if Other citizen ship is required',
  homelanguageRequired: 'Home language is required',
  ifOtherSpecifyHomeLanguage: 'if Other Home Language is required',
  socialEconomicsRequired: 'Social Economices is required',
  disabilityRequired: 'Disability is required',
  medicalIssueRequired: 'Medical Issue  is required',
  emailRequired: 'Email  is required',
  contactRequired: 'contact number is required',
  contactMaxError: 'max home phone 12 digit',
  alternateContactRequired: ' Alternate contact number is required',
  whatappContactRequired: ' Whatsapp number is required',
  homePhone: 'Home Phone must be Numerical',
  streetAddressRequired: 'Strees Address  is required',
  suburbRequired: 'Suburb  is required',
  townRequired: 'Town is required',
  provinceRequired: 'Province is required',
  provinceCharacter: 'Province must be a character',
  postalAddressRequired: 'Postal Address is required',
  countryRequired: 'Country is required',
  stateRequired: 'State is required',
  cityRequired: 'City is required',
  zipCodeRequired: 'ZipCode is required',
  zipCodeError: 'Must be only digits',
  zipCodeMaxError: 'Must be exactly 5 digits',
  idTypeRequired: 'Id Type is required',
  idNoRequired: 'Id Number is required',
  ifOthersSpecifyTheIdType: 'if Other Id Type is required',
  higerQualificationRequired: 'Higer Qualification is required',
  highSchoolNameRequired: 'High School Name is required',
  isInternationalDegreeHolderRequired: 'International Degree Holder is required',
  highestQualificationCompletedYear: 'highest Qualification CompletedYear  is required',
  intakeSaveMessage: 'Intake Details Changed Successfully.',
  sucessDraftMsg: 'Student Data Saved as a Draft sucessfully ',
  enrollDraftMsg: 'Student Draft enrolled sucessfully ',
  editMsg: 'Student  Draft updated  sucessfully ',
  sucessMsg: ' Add student sucessfully ',
  reqFromAssignIntake: 'ASSIGN-INTAKE',
  reqFromEnrollStudent: 'ENROLL-STUDENT'
}

export enum userInformationStatus {
  FirstNameRequired = ' First Name is Required',
  FirstNameError = 'First name must be character',
  FirstNameSpace = 'First name cannot contain spaces',
  MiddleNameError = 'Middle name must be character',
  MiddleNameSpace = 'Middle name cannot contain spaces',
  LastNameRequired = 'Last Name is Required',
  LastNameError = 'Last Name must be character',
  LastNameSpace = 'Last Name cannot contain spaces',
  ContactRequired = 'Contact number is required',
  EmailRequired = 'Email is required',
  EmailInvalid = 'Please enter a valid email',
  EmailExceed = 'Email character count can’t exceed to 50 characters.',
  StreetNameRequired = 'Address is required',
  CountryNameRequired = 'Country is required',
  CityNameRequired = 'city is required',
  StateNameRequired = 'State is required',
  ZipcodeRequired = 'Zip is required',
  zipcodeNegative = "Zipcode can't be negative",
  CostOfTrainingQuoteRequired = 'Cost Of TrainingQuoted is required',
  ContractCostRequired = 'Contract Cost is required',
  VarianceRequired = 'Variance  is required',
  VarianceDetailRequired = 'Variance Details  is required',
  PaymentTypeRequired = 'Payment Type is required',
  InstallmentNameRequired = 'InstallmentName is required',
  CurrencyRequired = 'Currency is required',
  DueAmountRequired = 'DueAmount is required',
  DueDateRequired = 'Due Date is required',
  DateRequired = 'Date is required',
  AccommodationRequired = 'Accommodation  is required',
  CarHireRequired = 'Car Hire is required',
  FlightsRequired = 'Flights is required',
  VenueCostIncludedRequired = 'Venue Cost Included is required',
  CateringRequired = 'Catering Include is required',
  MobileNumber = 'Contact Number Required',
  MobileNumberMatch = 'Contact Number must be Number',
  MobileNumberMin = 'Contact Number must be greater then 6',
  MobileNumberMax = 'Contact Number must be less than or equal to 12',
  NationalityStatus = 'Nationality Status is required',
  Gender = 'Gender is required',
  DateOfBirth = 'Date Of Birth is required',
  InvalidDateOfBirth = 'Please enter valid date of Birth',
  Race = 'Race is Required',
  Language = 'Home Language is required',
  PermanentResident = 'Permanent Resident  is required',
  Nationality = 'Nationality is required',
  DocumentType = 'Document Type is required',
  IdentificationNumber = 'Identification Number is required',
  DueAmountRequiredError = 'Amount Must be only digits',
  PaymentMode = 'Payment mode is required',
  program = 'Qualification Name is required',
  startDate = 'Please enter valid Date',
  mobileNumberMin = 'Mobile Number must be at least 6 digits',
  studyMode = 'Study Mode is Required',
  feeConfigure = 'Fee is not configure to these Program.',
  academicYear = 'Academic year is required',
  intake = 'Intake is required',
  groupName = 'Group Code & Name is required',
  IdentificationType = 'Identification number must contain only alphanumeric characters.',
  IdentificationMax = 'Identification Number must be at most 13 characters',
  searchParam = 'Please add a Reggie Number / National ID / E-Mail /Contact Number',
  gender = 'Gender is required',
  dateOfBirth = 'Date of birth is required',
  SponsorType = 'Sponsor Type Required',
  Address = 'Address is Required',
  SponsorName = 'Sponsor Name is Required',
  RelationShipType = 'RelationShip Type Required',
  ZipCodeNumber = 'Zip code must be numbers',
  Underage = 'Sponsor must be at least 18 years old.',
  IdentificationNumbermin = 'Minimum length should be 8',
  IdentificationNumbermax = 'Maximum 13 characters allowed',
  IdentificationNumberSmart = 'Identification number must be 13 digits and contain only numbers for smartID, e.g.- YYMMDD1234567',
  IdentificationNumberPassport = 'Passport number must be valid, e.g:- P4366918',
  CityNameInvalid = 'City name must be characters',
  RoleRequired = 'Role is Required'
}

export const costResponse = {
  costOfTrainingQuoted: 'R 1500',
  contractCost: '1222',
  variance: 'no',
  paymentType: 'credit'
}

export enum NotesMessages {
  Edit = 'Notes updated successfully',
  Add = 'Notes added successfully',
  Delete = 'Notes deleted successfully'
}

export enum Download {
  Template = 'Bulk upload template downloaded Successfully',
  List = 'Student list downloaded Successfully'
}

export const AcademicHeaders = [
  { id: 1, minWidth: 50, flex: 0.15, name: '#' },
  {
    id: 2,
    minWidth: 145,
    flex: 0.25,
    name: 'Student ID'
  },
  {
    id: 3,
    flex: 0.17,
    minWidth: 230,
    name: 'Student Name'
  },
  {
    id: 4,
    flex: 0.25,
    minWidth: 150,
    name: 'Contact '
  },
  {
    id: 5,
    flex: 0.18,
    minWidth: 250,
    name: 'Qualification Details'
  },
  {
    id: 8,
    flex: 0.17,
    minWidth: 150,
    name: 'Status'
  },
  {
    id: 9,
    flex: 0.17,
    minWidth: 100,
    name: 'Actions'
  }
]

export enum ClientContactDetails {
  FirstNameRequired = ' First Name is Required',
  FirstNameError = 'First name must be character  ',
  LastNameRequired = 'Last Name is Required',
  LastNameError = 'Last Name must be character',
  EmailRequired = 'Email is Required',
  TitleRequired = 'Title is Required',
  mobileCountryCode = 'Country Code is Required',
  telephoneCountryCode = 'Country Code is Required',
  MobileRequired = 'Mobile Number is Required',
  TelephoneRequired = 'Telephone Number is Required',
  DepartmentRequired = 'Department is Required',
  DesignationRequired = 'Designation is Required',
  RelationshipRequired = 'Relationship ',
  mobileNumberLength = 'Mobile number must be atleast 6 digits',
  telephoneNumberLength = 'Telephone number must be atleast 6 digits'
}

interface UserStatusType {
  [key: string]: ThemeColor
}
export const intakeStatusColor: UserStatusType = {
  'INTAKE-PENDING': 'warning',
  'INTAKE-ASSIGNED': 'info',
  Enrolled: 'success',
  'PROG-ADMITTED': 'success'
}
export const enrollGroupStatusTypesColor: UserStatusType = {
  'ENROLLMENT-PENDING': 'warning',
  'ENROLLED-TO-REGENIUS': 'success'
}

interface enrollGroupStatusTypes {
  [key: string]: any
}

export const enrollGroupStatusTypes: enrollGroupStatusTypes = {
  'ENROLLMENT-PENDING': 'Enrollment Pending',
  'ENROLLED-TO-REGENIUS': 'Enrolled to REGenius',
  'NO-STUDENT-FOR-ENROLMENT': 'No Student For Enrolment'
}

export const intakeCode = {
  null: '-'
}

export const intakeStatue = {
  pending: 'INTAKE-PENDING',
  assigned: 'INTAKE-ASSIGNED',
  enrolled: 'Enrolled',
  progAdmitted: 'PROG-ADMITTED',
  intakeAssignedPending: 'INTAKE-ASSIGNMENT-PEND'
}
export const bursoryLetterPending = 'BURSARY-LETTER-PEND'

export const admissionStatus = [
  { name: 'Application Accepted', code: 'ENRL-ACCEPTED' },
  { name: 'Application Document Verification Pending', code: 'APP-DOC-VER-PEND' },
  { name: 'Intake Assignment Pending', code: 'INTAKE-ASSIGNMENT-PEND' },
  { name: 'Application Documents Accepted', code: 'APP-DOC-ACCEPTED' },
  { name: 'Intake Assigned', code: 'INTAKE-ASSIGNED' },
  { name: 'Enrolled to the Qualification', code: 'PROG-ADMITTED' },
  { name: 'RMAT Fail', code: 'RMAT-FAIL' },
  { name: 'RMAT Pass', code: 'RMAT-PASS' },
  { name: 'RMAT Exam is Pending', code: 'RMAT-PENDING' },
  { name: 'Resubmit Application Documents', code: 'RESUB-APP-DOC' },
  { name: 'Suspended-Deferred', code: 'DEFERRED' }
]
export const intakeStatusSelect = [
  {
    name: 'Intake Assignment Pending',
    code: 'INTAKE-ASSIGNMENT-PEND'
  },
  { name: 'Intake-Assigned', code: 'INTAKE-ASSIGNED' },
  { name: 'Enrolled to the Program', code: 'PROG-ADMITTED' }
]
export const enrollStatusSelect = [
  {
    name: 'Enrollment Pending',
    value: 'ENROLLMENT-PENDING'
  },
  { name: 'Enrolled to REGenius', value: 'ENROLLED-TO-REGENIUS' }
]

export enum StudentStatus {
  appEnrolled = 'APP-ENROLLED',
  appRejected = 'APP-REJECTED',
  progAdmitted = 'PROG-ADMITTED',
  appDocUploaded = 'APP-DOC-UPLOADED',
  enrollAccepted = 'ENRL-ACCEPTED',
  AppDocVerPending = 'APP-DOC-VER-PEND',
  rmatPass = 'RMAT-PASS',
  rmatFail = 'RMAT-FAIL',
  programFeeVerificationPend = 'PROG-FEE-VER-PEND'
}

export enum EnrollIntakeType {
  enrolled = 'ENROLLED-TO-REGENIUS'
}

export const CreditAffordableDataStatus: IDynamicObject = {
  high: 'High',
  medium: 'Medium',
  low: 'Low'
}
export const responseTable = [
  {
    id: 1,
    fileType: 'National Id',
    fileName: 'Passport-Type',
    comments: 'Expire on 2025',
    upload: '10-dec-2025',
    status: 'approved'
  }
]

export enum PreviewStudent {
  Backtolist = '/student/list/',
  StudentList = '/project/student/preview/'
}

interface IStudentManagement {
  Add: string
  Edit: string
  Error: string
  intakeAlreadyAssigned: string
}

export const StudentManagement: IStudentManagement = {
  Add: 'group student assigned successfully.',
  Edit: 'updated successfully',
  Error: 'Failed to add student',
  intakeAlreadyAssigned: 'Intake already assigned in this group'
}
export const isBursaryApplicationStatus = ['BURSARY-APP-FEE-PEND']

export const studentApplicationAllStatus: IDynamicObject = {
  'BURSARY-APP-FEE-PEND': 'Bursary Application Fee Pending',
  'APP-FEE-DOC-VER-PEND': 'Application Fee Verification Pending',
  'RESUB-APP-FEE-PROOF': 'Resubmit Application Fee POP',
  'APP-FEE-VER-PEND': 'Application Fee Verification Pending',
  'APP-FEE-ACCEPTED': 'Application Fee Accepted',
  'APP-FEE-REJECTED': 'Application Fee Rejected',
  'APP-ENROLLED': 'Application Confirmed',
  'APP-DOC-VER-PEND': 'Application Document Verification Pending',
  'APP-DOC-REQUESTED': 'Application Documents Requested',
  'APP-DOC-ACCEPTED': 'Application Documents Accepted',
  'RMAT-PEND': 'RMAT Exam is Pending',
  'RMAT-PASS': 'RMAT Pass',
  'RMAT-FAIL': 'RMAT Fail',
  'ENRL-ACCEPTED': 'Application Accepted',
  'PROG-FEE-PEND': 'Qualification Fee Pending',
  'BURSARY-REQUESTED': 'Request for Bursary',
  'BURSARY-DOC-VER-PEND': 'Bursary Document Verification Pending',
  'BURSARY-DOC-REQUESTED': 'Bursary Documents Requested',
  'BURSARY-PEND': 'Bursary Confirmation Pending',
  'BURSARY-APPROVED': 'Bursary Approved',
  'BURSARY-REJECTED': 'Bursary Rejected',
  'LOAN-REQUESTED': 'Request for Loan',
  'LOAN-DOC-VER-PEND': 'Loan Document Verification Pending',
  'LOAN-DOC-REQUESTED': 'Loan Documents Requested',
  'LOAN-PEND': 'Loan Confirmation Pending',
  'LOAN-APPROVED': 'Loan Approved',
  'LOAN-REJECTED': 'Loan Rejected',
  'PROG-FEE-DOC-VER-PEND': 'Qualification Fees Document Verification Pending',
  'RESUB-PROG-FEE-PROOF': 'Resubmit Program Fee  POP',
  'PROG-FEE-VER-PEND': 'Program Fees Verification Pending',
  'DEBIT-ORDER-FORM-PEND': 'Debit Order Form Pending',
  'DEBIT-ORDER-FORM-DOC-VER-PEND': 'Debit Order Form Document Verification Pending',
  'DEBIT-ORDER-FORM-VER-PEND': 'Debit Order Form Verification Pending',
  'DEBIT-ORDER-FORM-ACCEPTED': 'Debit Order Form Accepted',
  'RESUB-DEBIT-ORDER-FORM': 'Resubmit Debit Order Form',
  'EFT-LETTER-PEND': 'EFT Letter Pending',
  'EFT-LETTER-DOC-VER-PEND': 'EFT Letter Document Verification Pending',
  'EFT-LETTER-VER-PEND': 'EFT Letter Verification Pending',
  'EFT-LETTER-ACCEPTED': 'EFT Letter Accepted',
  'RESUB-EFT-LETTER': 'Resubmit EFT Letter',
  'PROG-FEE-ACCEPTED': 'Qualification Fee Accepted',
  'INTAKE-ASSIGNMENT-PEND': 'Intake Assignment Pending',
  'INTAKE-ASSIGNED': 'Intake Assigned',
  'PROG-ADMITTED': 'Enrolled to the Qualification',
  ENROLLED: 'Enrolled to the Program',
  'APP-DRAFT': 'In Draft',
  'APP-FEE-PEND': 'Application  Fee Pending',
  'UPLD-APP-DOC': 'Upload Application documents',
  'APP-DOC-UPLOADED': 'Application Documents Uploaded',
  'RESUB-APP-DOC': 'Resubmit Application Documents',
  'UPLD-BURSARY-DOC': 'Upload Bursary Documents',
  'BURSARY-DOC-UPLOADED': 'Bursary Document Uploaded',
  'RESUB-BURSARY-DOC': 'Resubmit Bursary Documents',
  'BURSARY-DOC-ACCEPTED': 'Bursary Documents Accepted',
  'UPLD-LOAN-DOC': 'Upload Loan Documents',
  'LOAN-DOC-UPLOADED': 'Loan Document Uploaded',
  'RESUB-LOAN-DOC': 'Resubmit Loan Documents',
  'LOAN-DOC-ACCEPTED': 'Loan Documents Accepted',
  'INTAKE-ASSIGNMENT PENDING': 'Intake Assignment Pending',
  'RMAT-PENDING': 'RMAT Exam is Pending',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
  GRADUATED: 'Graduated',
  COMPLETED: 'Completed',
  EXPELLED: 'Expelled',
  ATTENDED: 'Attended',
  DECEASED: 'Deceased',
  LEAD: 'Lead',
  'INTAKE-ASSIGNMENT-PENDING': 'Intake Assignment Pending',
  'FINANCE-VERIFICATION-PEND': 'Finance Verification Pending',
  MONTHLY_PAYMENT_REJECTED: 'Monthly Payment Rejected',
  'BURSARY-LETTER-PEND': 'Bursary Letter Pending',
  'RPL-FEE-PEND': 'Rpl Fee Pending',
  'RPL-FEE-REJECT': 'Rpl Fee Rejected',
  'RPL-FEE-ACCEPTED': 'Rpl Fee Accepted',
  'RPL-FEE-VER-PEND': 'Rpl Fee Verification Pending',
  DEFERRED: 'Deferred'
}

export const applicationStatusColor: {
  [key: string]: ThemeColor
} = {
  'APP-DRAFT': 'secondary',
  'APP-FEE-PEND': 'warning',
  'APP-FEE-VER-PEND': 'warning',
  'RESUB-APP-FEE-PROOF': 'warning',
  'APP-FEE-ACCEPTED': 'info',
  'APP-ENROLLED': 'info',
  'UPLD-APP-DOC': 'warning',
  'APP-DOC-UPLOADED': 'success',
  'RESUB-APP-DOC': 'warning',
  'APP-DOC-ACCEPTED': 'info',
  'RMAT-PEND': 'warning',
  'RMAT-PASS': 'success',
  'RMAT-FAIL': 'error',
  'ENRL-ACCEPTED': 'info',
  'PROG-FEE-PEND': 'warning',
  'BURSARY-REQUESTED': 'primary',
  'UPLD-BURSARY-DOC': 'warning',
  'BURSARY-DOC-UPLOADED': 'success',
  'RESUB-BURSARY-DOC': 'warning',
  'BURSARY-DOC-ACCEPTED': 'info',
  'BURSARY-PEND': 'warning',
  'BURSARY-APPROVED': 'info',
  'BURSARY-REJECTED': 'error',
  'LOAN-REQUESTED': 'primary',
  'UPLD-LOAN-DOC': 'warning',
  'LOAN-DOC-UPLOADED': 'success',
  'RESUB-LOAN-DOC': 'warning',
  'LOAN-DOC-ACCEPTED': 'info',
  'LOAN-PEND': 'warning',
  'LOAN-APPROVED': 'info',
  'LOAN-REJECTED': 'error',
  'PROG-FEE-VER-PEND': 'warning',
  'RESUB-PROG-FEE-PROOF': 'warning',
  'PROG-FEE-ACCEPTED': 'info',
  'INTAKE-ASSIGNMENT PENDING': 'warning',
  'INTAKE-ASSIGNED': 'primary',
  'PROG-ADMITTED': 'success',
  ENROLLED: 'success',
  'APP-FEE-DOC-VER-PEND': 'warning',
  'APP-FEE-REJECTED': 'error',
  'APP-DOC-VER-PEND': 'warning',
  'APP-DOC-REQUESTED': 'primary',
  'BURSARY-DOC-VER-PEND': 'warning',
  'BURSARY-DOC-REQUESTED': 'primary',
  'LOAN-DOC-VER-PEND': 'warning',
  'LOAN-DOC-REQUESTED': 'primary',
  'PROG-FEE-DOC-VER-PEND': 'warning',
  'DEBIT-ORDER-FORM-PEND': 'warning',
  'DEBIT-ORDER-FORM-DOC-VER-PEND': 'warning',
  'DEBIT-ORDER-FORM-VER-PEND': 'warning',
  'DEBIT-ORDER-FORM-ACCEPTED': 'info',
  'RESUB-DEBIT-ORDER-FORM': 'error',
  'EFT-LETTER-PEND': 'warning',
  'EFT-LETTER-DOC-VER-PEND': 'warning',
  'EFT-LETTER-VER-PEND': 'warning',
  'EFT-LETTER-ACCEPTED': 'info',
  'RESUB-EFT-LETTER': 'error',
  'INTAKE-ASSIGNMENT-PEND': 'warning',
  CANCELLED: 'error',
  SUSPENDED: 'warning',
  GRADUATED: 'primary',
  DEFERRED: 'warning'
}

export const paymentTypeList = [
  {
    name: 'Credit Card',
    code: 'credit'
  },
  {
    name: 'Debit Card',
    code: 'debit'
  },
  {
    name: 'UPI',
    code: 'upi'
  }
]

export const currencyCodeToName: any = {
  ZAR: 'Rands',
  INR: 'INR',
  NGN: 'Naira',
  USD: 'US Dollar'
}

export const studentUrls = {
  application: '/student/preview/',
  enrolment: '/application-enrollment/preview/',
  admission: '/admission/preview/'
}

export const studentTypeActions: IDynamicObject = {
  BURSARY: 'Save & Generate Quote',
  RETAIL: 'Save'
}

interface valueType {
  [key: string]: any
}

export const valueTypeObj: valueType = {
  high: 'green',
  medium: '#1f2b37',
  low: 'red'
}

export interface OverrideDocumentsData {
  documentTypeCode: string
  file?: File | null | undefined
}

export enum StudentTypesEnums {
  bursary = 'BURSARY',
  retail = 'RETAIL'
}

export enum checkPaymentType {
  affordableValue = 'high',
  creditRiskValue = 'high'
}

export enum documentTypeCode {
  acceptacnce = 'ACCEPTANCE-LETTER',
  confirmation = 'CONFIRMATION-LETTER',
  welcome = 'WELCOME-LETTER',
  quote = 'QUOTE',
  declaration = 'DECLARATIONFORM',
  PaymentProof = 'PAYMENTPROOF',
  TermsAndConditions = 'TERMSANDCONDITION',
  TermsAndConditionsCode = 'TERMS&CONDITION',
  Study_Flexi_Calculation = 'STUDY-FLEXI-CALCULATION',
  Study_Flexi_Agreement = 'STUDY-FLEXI-AGREEMENT'
}

export const PaymentMode: any = [
  { name: 'Semester', code: 'SEMESTER' },
  { name: 'Annually', code: 'ANNUALLY' },
  { name: 'Monthly', code: 'MONTHLY' }
]

export const ProgAdmitted: IDynamicObject = {
  'PROG-ADMITTED': 'Enrolled'
}

export enum GoogleAnalyticsScript {
  script1 = 'https://regenesys-rms.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/tod1zk/b/5/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=236dc7e1',
  script2 = 'https://regenesys-rms.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/tod1zk/b/5/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=236dc7e1',
  prodURL = 'https://rms.regenesys.net/'
}

export enum DocumentStatus {
  UploadPending = 'upload pending',
  Approved = 'approved',
  Submitted = 'submitted',
  Rejected = 'rejected',
  Pending = 'PENDING'
}

export interface IEnrollState {
  show: boolean
  response: IEnrollResponseData
}
export interface IEnrollResponseData {
  count: IEnrollCount
  enrolled: IEnrollRowContent[]
  notEnrolled: IEnrollRowContent[]
}

export interface IEnrollCount {
  enrolled: number
  notEnrolled: number
  total: number
}

export interface IEnrollRowContent {
  intakeCoursesCourse: any
  intake: any
  application: any
  id: number
  firstName: string
  lastName: string
  studentCode: string
  intakeCode: string
  lead: any
  programDetails: ICommonParams
  intakeData: {
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
  }
  status: string
  enrolmentDate: Date
}

export interface IEnrollCorporateState {
  show: boolean
  response: IEnrollCorporateResponseData
}

export interface IEnrollCorporateResponseData {
  count: IEnrollCount
  enrolled: IEnrollCorporateRowContent[]
  notEnrolled: IEnrollCorporateRowContent[]
}
export interface IEnrollCorporateRowContent {
  id: number
  applicationCode: string
  SsaStatus: string
  application: {
    id: number
    applicationCode: string
    status: string
    lead: any
    education: {
      id: number
      programCode: string
      programName: string
      studyModeCode: string
      qualificationCode: string
      highSchoolName: string
      agentCode: string
      studentTypeCode: string
      applicationId: number
    }
  }
  groupDetails: {
    id: number
    name: string
    code: string
  }
  intakeData: {
    id: number
    name: string
    code: string
    academicYearOfStudy: number
    academicYearOfProgram: string
    startDate: string
    endDate: string
    studyMode: string
    courses: any[]
  }
  groupCode: string
  status: string
  enrolmentDate: Date
}
export const FileType = ['image/png', 'image/pdf', 'image/jpeg']

export enum FileError {
  fileSizeError = 'File is larger than 500 KB',
  fileTypeError = 'File type must be png, jpeg and pdf'
}
export enum QueryFileSize {
  maxSize = 500 * 1024 // 500KB
}
export const apistatus = { success: 200, success1: 201 }
export const graduationStatus: any = {
  subGraduated: 'SUB-GRADUATED',
  subMarkNotRetrived: 'SUB-MARKS-NOT-RETRIEVED',
  subGraduatedFeesPending: 'SUB-GRADUATED-FEES-PENDING'
}

export const mandatorySponsorModeFeilds = ['GUARDIAN', 'BURSARY']

export const patternForSMARTID =
  /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))((\d{4})(\d{3})|(\d{7}))$/

export const patternForPassport = /^[A-Z0-9]{6,9}$/

export const pddsProgramCode = 'PDDS-Prog'

export enum ErrorMessage {
  discountErrorMessage = 'Discount Code Not Applicable',
  customDiscountMsg = 'Sorry this discount code is not valid.'
}

export enum SuccessMessage {
  discountSuccessMessage = 'Discount Applied Successfully With Discount Percentage ',
  customDiscountSuccessMsg = 'Discount code applied Successfully. You have saved'
}

export const callFunctionOn = {
  onSubmit: 'onSubmit',
  reset: 'reset'
}
export const studentApplicationSubStatus: IDynamicObject = {
  'SUB-DEFERRED-FEES_PENDING': 'FEES_PENDING',
  'SUB-CANCELLED-FEES_PENDING': 'FEES_PENDING'
}
