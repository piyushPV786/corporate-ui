export const baseApiURL = process.env.NEXT_PUBLIC_BASE_API_URL

export const apiEndPoints = {
  approveEnrolment: 'sales/accept/',
  facilitator: 'facilitator',
  bursaryList: 'bursary',
  bursaryDetail: 'bursary/',
  studentList: 'application',
  studentDetail: 'application/',
  enrolmentList: 'sales',
  enrolmentDetail: 'sales/',
  vipStudent: 'sales/updateVIPComment',
  sendPaymentLink: 'sales/sendPaymentLink',
  updatestudent: 'sales/:appCode/update/basic',
  updatecourse: 'sales/:appCode/update/course',
  updateaddress: 'sales/:appCode/update/address',
  getFileUrl: 'common/document',
  documentTypeList: 'common/document-type',
  uploadFileUrl: 'common/document/upload',
  program: 'programs',
  allPrograms: 'programs/all',
  allIntake: 'intake/all',
  addressList: 'common/address-type',
  qualification: 'common/qualification',
  studyMode: 'common/study-mode',
  socialMedia: 'common/social-media',
  agent: 'common/agent',
  studentType: 'common/student-type',
  admission: 'admissions/',
  enrollStudent: 'admissions/accept/',
  individualDetails: 'finance/aggregate/',
  enrollIndividualDetails: 'enrolment/aggregate/',
  corporateEd: 'corporate-ed',
  projectList: 'project',
  projectDocumentDelete: 'project/projectCode/document',
  venueList: 'projectVenue',
  projectStudentList: 'projectStudent/all',
  projectNotes: 'projectNotes',
  costContract: 'project/cost/',
  installmentAll: 'project/installment/all/',
  installment: 'project/installment',
  venueLogistics: 'project/venueLogistics/',
  countryList: 'common/country',
  projectStudents: 'projectStudent/all',
  updateBursary: 'update/bursaryName',
  uploadBulkStudent: 'projectStudent/upload-student',
  uploadDocument: 'application/document-upload',
  enrolmentEligibility: 'enrolment-eligibility',
  projectStudent: 'projectStudent/',
  downloadStudent: 'projectStudent/student-download',
  downloadTemplate: 'projectStudent/template-download',
  feeConversionRate: 'programs-fee/fee-conversion-rate',
  programs: 'programs',
  gender: 'common/gender',
  nationality: 'common/nationality',
  citizenship: 'common/citizenship',
  corporateStudent: 'corporate-student',
  corporateStudentApprove: 'corporate-student/approve/application',
  corporateStudentApproveDocument: 'corporate-student/approve/document',
  corporateStudentFilterList: 'corporate-student/filter/optionList',
  nationalityStatus: 'common/nationality-status',
  race: 'common/race',
  homelanguage: 'common/homelanguage',
  socioeconomic: 'common/socio-economic-status',
  language: 'common/language',
  disability: 'common/disability',
  emplyoment: 'common/employment-status',
  year: 'common/year',
  companyType: 'common/company-type',
  refreshToken: 'auth/refresh-token',
  studentRecords: 'application/student/Record/all',
  aggreegatStudents: 'student/aggregate/',
  intakeAssign: 'intake-assign',
  intakeUpcoming: 'intake/upcoming/byProgramCode',
  intakeLists: 'intake',
  intakeByGroup: 'intake/byGroup',
  projectStudentDraft: 'projectStudent/draft',
  studentRecord: 'application/student/Record/withAllStatus',
  studentAllRecord: 'academic/studentIntake',
  academicTranscriptStudentList: 'academic/records',
  programsCode: 'programs/code',
  currency: 'common/currency',
  projectContactDetails: 'projectContactDetails',
  projectStudentDocument: 'projectStudent',
  programCourses: 'courses/program/',
  identificationType: 'common/identification-Type',
  isRmatRequired: 'rmat/programCode',
  rmatLink: 'rmat/send-rmat-link',
  rmat: 'rmat/',
  rmatDetails: 'rmat/details',
  rmatExamDetails: 'rmat/exam-details',
  citizenShip: 'common/citizenShip',
  student: 'student',
  studentIntake: 'studentintake',
  allStudentIntake: 'sales/all/student',
  groups: 'groups',
  userDetails: 'user',
  validateCourseIntake: 'courses/validate-group-intake-courses',
  studentManagement: 'student-management',
  corporateStudentManagement: 'corporate-group',
  enrollCorporateGroup: 'corporate-group/enroll/corporateGroup',
  roles: 'roles',
  projectManager: 'user/role/CE_Project_Manager',
  accountManager: 'user/role/CE_Account_Manager',
  courseType: 'common/course-type',
  programmeBusinessUnit: 'common/programme-business-unit',
  requestAccess: 'user/request-access',
  projectDetails: 'project/',
  exemptCourse: 'sales/exempt-course',
  admittedStudents: 'admitted-students/all',
  getStudentDetail: 'application/student-details/:studentCode',
  getStudentDetailAppCode: 'application/student-details-by-appcode/:appCode',
  applicationDetails: 'lead/:leadId/application',
  salesSudents: 'sales/student',
  personalInfo: 'sales',
  contactInfo: 'sales',
  addressInfo: 'sales',
  educationInfo: 'sales',
  unenrollStudent: 'admitted-students/unenroll-student',
  globalSearch: 'application/global-search',
  checkDuplicateProject: 'project/check-duplicate-project',
  enrollProjectStudent: 'projectStudent/status',
  stateByCountry: 'common/state',
  agents: 'user/role',
  reassign: 'sales/reassign-student',
  documentFileType: 'document/',
  assignStudentType: 'application/assign-student-type',
  reUploadDocument: 'update-document',
  studentStatus: 'common/student-status',
  admittedStudent: 'admitted-students',
  statusHistory: 'application/status-history',
  getAuditLog: 'common/get-audit-log',
  getActivityTimeline: 'application/activity-timeline/audit-log',
  graduationList: 'graduate-student',
  ssaList: 'ssa/list',
  assignSSA: 'ssa/assign-ssa',
  feeDetails: 'programs-fee/byProgramCode',
  downloadAcademicTranscript: 'academic/donwload/academic-records',
  downloadAcademicTranscripts: 'academic/donwload/academic-records/student/:studentCode/program/:programCode/all',
  checkDuplicateEmail: 'sales/check-duplicate-email',
  reggieNumberData: 'reggieNumber/getGeneratedReggieNumberData',
  generateReggieStudent: 'reggieNumber',
  discount: 'discount/sales/validDiscount',
  feeModeLists: 'common/fee-mode',
  reggieCheckDuplicateEmail: 'reggieNumber/reggie-data-duplicate-email',
  reggieCheckDuplicateMobile: 'reggieNumber/reggie-data-duplicate-mobile',
  updateDocumentStatus: 'document/:documentCode/active',
  allApplicationRecord: 'application/all-record',
  documentCode: 'common/next-code/DOC',
  documentRemove: 'document/documentCode',
  document: 'document',
  newProgram: 'application/multiple-applicaton',
  studyModeByCode: 'programs-fee/byProgramCode',
  createRpl: 'rpl/create',
  updateRpl: 'rpl',
  newStudent: 'application/get-student-due-payment',
  duePaymentMail: 'application/send-due-payment-mail',
  generateInvoice: 'evolution/create-invoice',
  generateQuote: 'quote-generation/create-pdf',
  getStudentData: 'student-management/registered-student',
  flexiPayData: 'programs-fee/fee/program/:programCode/study-mode/:studyModeCode/flexi-pay',
  downloadQuote: 'document/quote',
  resetStatus: 'application/reset-status',
  updateCredit: 'credit-history',
  loadMasterData: 'master/loadMasterData ',
  addSponsor: 'credit-history/add-sponsor',
  updateSponsor: 'credit-history/update-sponsor',
  checkAndUpdateStatus: 'sales/:applicationCode/update-status',
  graduation: 'graduation',
  finedtechdetails: 'evolution',
  assignGroup: 'corporate-group/assing/corporateGroup',
  allGroup: 'corporate-group/all',
  corporateGroup: 'corporate-group',
  corporateGroupStudents: 'corporate-group/all-student',
  corporateCode: 'corporate-ed/check-duplicate-corporate',
  corporateManager: 'corporate-managers',
  corporateProjectManagerList: 'corporate-managers/all/manager/CE_Project_Manager',
  corporateAccountManagerList: 'corporate-managers/all/manager/CE_Account_Manager'
}

export const allowedDocsForCreditVetting = ['SMARTID', 'PASSPORT']
