export const FeatureCodes = {
  EMS: {
    application: 'APPLICATIONS',
    applicationSearch: 'APPLICATION-SEARCH',
    applicationEnrollment: 'APP-ENROLMENT',
    assignIntake: 'ASSIGN-INTAKE',
    admission: 'ADMISSION',
    studentManagement: 'STUDENT-MANAGEMENT',
    admittedStudent: 'ADMITTED-STUDENT-EMS',
    academicTranscript: 'ACADEMIC-TRANSCRIPT-EMS',
    assignStudentSupport: 'ASSIGN-STUDENT-SUPPORT',
    corporateStudents: 'CORPORATE-STUDENT',
    corporate: 'CORPORATE',
    corporateStudentManagement: 'CORPORATE-STUDENT-MANAGEMENT',
    projectManagement: 'PROJECT-MANAGEMENT',
    graduateStudent: 'GRADUATE-STUDENT',
    generateReggieNumber: 'GENERATE-REGGIE-NUMBER',
    generateQuote: 'GENERATE-QUOTE',
    corporateGroup: 'CORPORATE-GROUP'
  },
  AMS: {
    qualificationAndModule: 'QUALIFICATION-MODULE',
    groups: 'GROUPS',
    RMATConfiguration: 'RMAT-CONFIG',
    academicIntake: 'ACADEMIC-INTAKE',
    academicTranscripts: 'ACADEMIC-TRANSCRIPT-ADS', //In both AMS and ADS
    admittedStudent: 'ADMITTED-STUDENT-ADS', //In both AMS and ADS
    moduleAcademicReport: 'MODULE-ACADEMIC-REPORT', //In both AMS and ADS
    assessmentDashboard: 'ASSESSMENT-DASHBOARD', //In both AMS and ADS
    manageDepartments: 'MANAGE-DEPARTMENT',
    examRoomManagement: 'EXAM-ROOM-MANAGEMENT', //In both AMS and ADS
    viewAndDownloadGraduation: 'VIEW-AND-DOWNLOAD-GRADUATION', //In both AMS and ADS
    manageVenues: 'MANAGE-VENUE',
    examSchedule: 'EXAM-SCHEDULE', //In both AMS and ADS
    courseProfile: 'COURSE-PROFILE',
    manageSchedules: 'MANAGE-SCHEDULE',
    classManagement: 'CLASS-MANAGEMENT-ADS',
    manageFacilitator: 'MANAGE-FACILITATOR',
    viewExamAttendance: 'EXAM-ATTENDENCE' //In both AMS and ADS
  },
  FMS: {
    applicationProofOfPayment: 'APP-PROOF-PAYMENT',
    discount: 'DISCOUNT',
    fees: 'FEES',
    admittedStudent: 'ADMITTED-STUDENT-FMS',
    manageConversionRate: 'MANAGE-CONVERSION-RATE',
    monthlyPaymentStudent: 'MONTHLY-PAYMENT-STUDENT',
    bursaryApplications: 'BURSARY-APPLICATION',
    VIPStudents: 'VIP-STUDENT-FMS',
    manageOtherFees: 'MANAGE-OTHER-FEES'
  },
  OMS: {
    classManagement: 'CLASS-MANAGEMENT-OMS',
    attendanceManagement: 'ATTENDANCE-MANAGEMENT',
    AdmittedStudentList: 'ADMITTED-STUDENT-OMS',
    UnenrolledStudent: 'UNENROLLED-STUDENT',
    viewAndDownloadGraduation: 'VIEW-AND-DOWNLOAD-GRADUATION-OMS',
    queryDashboard: 'QUERY-DASHBOARD',
    ACFormDashboard: 'ACFORM-DASHBOARD',
    VIPStudents: 'VIP-STUDENT-OMS',
    orientationSchedule: 'ORIENTATION-SCHEDULE',
    throughputReport: 'THROUGHPUT-REPORT',
    riskDashboard: 'RISK-DASHBOARD'
  },
  UMS: {
    dashboard: 'UMS-DASHBOARD',
    manageUserRoleAndPermission: 'MANAGE-USER-ROLE-AND-PERMISSION'
  },
  AAMS: {
    academicTranscripts: 'ACADEMIC-TRANSCRIPT-AMS',
    admittedStudent: 'ADMITTED-STUDENT-AMS',
    moduleAcademicReport: 'MODULE-ACADEMIC-REPORT-AMS',
    assessmentDashboard: 'ASSESSMENT-DASHBOARD-AMS',
    examRoomManagement: 'EXAM-ROOM-MANAGEMENT-AMS',
    viewAndDownloadGraduation: 'VIEW-AND-DOWNLOAD-GRADUATION-AMS',
    examSchedule: 'EXAM-SCHEDULE-AMS',
    viewExamAttendance: 'EXAM-ATTENDENCE-AMS'
  },
  CES: {
    corporateStudents: 'CORPORATE-STUDENT',
    corporate: 'CORPORATE',
    corporateStudentManagement: 'CORPORATE-STUDENT-MANAGEMENT',
    projectManagement: 'PROJECT-MANAGEMENT',
    corporateGroup: 'CORPORATE-GROUP',
    corporateManager: 'CORPORATE-MANAGER'
  }
}

export const moduleKeys = {
  finance: 'finance',
  admin: 'admin',
  sales: 'sales',
  admission: 'admission',
  academics: 'academics',
  assessment: 'assessment',
  corporateSales: 'corporatesales',
  operation: 'operation',
  adminSales: 'adminsales',
  adminFinance: 'adminfinance',
  adminAdmission: 'adminadmission',
  adminAcademics: 'adminacademics',
  adminAssessment: 'adminassessment',
  adminOperation: 'adminoperation',
  user: 'usermanagement',
  corporate: 'corporate'
}

export const RoleCodes: any = {}
RoleCodes[moduleKeys.finance] = 'Finance'
RoleCodes[moduleKeys.admin] = 'Admin'
RoleCodes[moduleKeys.sales] = 'Sales'
RoleCodes[moduleKeys.admission] = 'Admission'
RoleCodes[moduleKeys.academics] = 'Academics'
RoleCodes[moduleKeys.assessment] = 'Assessment'
RoleCodes[moduleKeys.operation] = 'Operation'
RoleCodes[moduleKeys.adminSales] = 'Admin_Sales'
RoleCodes[moduleKeys.adminFinance] = 'Admin_Finance'
RoleCodes[moduleKeys.adminAdmission] = 'Admin_Admission'
RoleCodes[moduleKeys.adminAcademics] = 'Admin_Academics'
RoleCodes[moduleKeys.adminAssessment] = 'Admin_Assessment'
RoleCodes[moduleKeys.adminOperation] = 'Admin_Operation'

export const ModuleCodes: any = {}

ModuleCodes[moduleKeys.finance] = 'FMS'
ModuleCodes[moduleKeys.academics] = 'ADS'
ModuleCodes[moduleKeys.assessment] = 'AAMS'
ModuleCodes[moduleKeys.sales] = 'EMS'
ModuleCodes[moduleKeys.operation] = 'OMS'
ModuleCodes[moduleKeys.user] = 'UMS'
ModuleCodes[moduleKeys.corporate] = 'CES'

export const PermissionsCodes: any = {
  view: 'VIEW',
  none: 'NONE',
  full: 'FULL'
}

export const MenuTitles: any = {}
MenuTitles[moduleKeys.finance] = 'Finance Management'
MenuTitles[moduleKeys.academics] = 'Academic Delivery System'
MenuTitles[moduleKeys.operation] = 'Operations Management'
MenuTitles[moduleKeys.sales] = 'Enrolment Management'
MenuTitles[moduleKeys.user] = 'User Management'
MenuTitles[moduleKeys.assessment] = 'Assessment Management System'
MenuTitles[moduleKeys.corporate] = 'Corporate Education System'

export const url = {
  corporate: 'corporate',
  corporateStudents: 'corporate-students',
  corporateStudentManagement: 'corporate-students-management',
  projectManagement: 'project',
  corporateGroup: 'corporate-groups'
}

export const UrlToModule: any = {}
UrlToModule[url.corporate] = FeatureCodes.CES.corporate
UrlToModule[url.corporateStudents] = FeatureCodes.CES.corporateStudents
UrlToModule[url.corporateStudentManagement] = FeatureCodes.CES.corporateStudentManagement
UrlToModule[url.projectManagement] = FeatureCodes.CES.projectManagement
UrlToModule[url.corporateGroup] = FeatureCodes.CES.corporateGroup
