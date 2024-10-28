import {
  CreditCardOutline,
  HomeOutline,
  AccountBox,
  AccountGroupOutline,
  SchoolOutline,
  ClipboardAccountOutline,
  AccountDetailsOutline,
  NotebookMultiple,
  FaceAgent,
  HomeSearchOutline
} from 'mdi-material-ui'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'
import { GenerateQuote } from 'src/components/icons/generateQuote'
import { GenerateReggieNumber } from 'src/components/icons/generateReggieNumber'

export const enrolmentMenu = {
  [FeatureCodes.EMS.application]: {
    title: 'Applications',
    icon: HomeOutline,
    path: '/student/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.applicationSearch]: {
    title: 'Applications Search',
    icon: HomeSearchOutline,
    path: '/application-search/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.applicationEnrollment]: {
    title: 'Application Enrollment',
    icon: CreditCardOutline,
    path: '/application-enrollment/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.assignIntake]: {
    title: 'Assign Intake',
    icon: ClipboardAccountOutline,
    path: '/assign-intake/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.admission]: {
    title: 'Admission',
    icon: AccountBox,
    path: '/admission/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.studentManagement]: {
    title: 'Student Management',
    icon: AccountDetailsOutline,
    path: '/students-management',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.admittedStudent]: {
    title: 'Admitted Student',
    icon: AccountGroupOutline,
    path: '/admitted-student/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.academicTranscript]: {
    title: 'Academic Transcripts',
    icon: SchoolOutline,
    path: '/academic/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.assignStudentSupport]: {
    title: 'Student Support Administration',
    icon: FaceAgent,
    path: '/Student-Support-Administrative/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.graduateStudent]: {
    title: 'Graduate Student',
    icon: NotebookMultiple,
    path: '/graduate-student',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.generateReggieNumber]: {
    title: 'Generate Reggie Number',
    icon: GenerateReggieNumber,
    path: '/generate-reggie-number',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.generateQuote]: {
    title: 'Generate Quote',
    icon: GenerateQuote,
    path: '/generate-quote',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.corporateStudents]: {
    title: 'Corporate Students',
    icon: FaceAgent,
    path: '/corporate-students/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.corporate]: {
    title: 'Corporate',
    icon: FaceAgent,
    path: '/corporate/management',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.corporateGroup]: {
    title: 'Corporate Groups',
    icon: FaceAgent,
    path: '/corporate-groups/list',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.corporateStudentManagement]: {
    title: 'Corporate Student Management',
    icon: FaceAgent,
    path: '/corporate-students-management',
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.projectManagement]: {
    title: 'Project Management',
    icon: FaceAgent,
    path: '/project/management',
    badgeColor: 'error',
    module: moduleKeys.sales
  }
}
