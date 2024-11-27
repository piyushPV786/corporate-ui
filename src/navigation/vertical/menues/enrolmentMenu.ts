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

const redirectUri = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const enrolmentMenu = {
  [FeatureCodes.EMS.application]: {
    title: 'Applications',
    icon: HomeOutline,
    path: `${redirectUri}enrolment/student/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.applicationSearch]: {
    title: 'Applications Search',
    icon: HomeSearchOutline,
    path: `${redirectUri}enrolment/application-search/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.applicationEnrollment]: {
    title: 'Application Enrollment',
    icon: CreditCardOutline,
    path: `${redirectUri}enrolment/application-enrollment/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.assignIntake]: {
    title: 'Assign Intake',
    icon: ClipboardAccountOutline,
    path: `${redirectUri}enrolment/assign-intake/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.admission]: {
    title: 'Admission',
    icon: AccountBox,
    path: `${redirectUri}enrolment/admission/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.studentManagement]: {
    title: 'Student Management',
    icon: AccountDetailsOutline,
    path: `${redirectUri}enrolment/students-management`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.admittedStudent]: {
    title: 'Admitted Student',
    icon: AccountGroupOutline,
    path: `${redirectUri}enrolment/admitted-student/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.academicTranscript]: {
    title: 'Academic Transcripts',
    icon: SchoolOutline,
    path: `${redirectUri}enrolment/academic/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.assignStudentSupport]: {
    title: 'Student Support Administration',
    icon: FaceAgent,
    path: `${redirectUri}enrolment/Student-Support-Administrative/list`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.graduateStudent]: {
    title: 'Graduate Student',
    icon: NotebookMultiple,
    path: `${redirectUri}enrolment/graduate-student`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.generateReggieNumber]: {
    title: 'Generate Reggie Number',
    icon: GenerateReggieNumber,
    path: `${redirectUri}enrolment/generate-reggie-number`,
    badgeColor: 'error',
    module: moduleKeys.sales
  },
  [FeatureCodes.EMS.generateQuote]: {
    title: 'Generate Quote',
    icon: GenerateQuote,
    path: `${redirectUri}enrolment/generate-quote`,
    badgeColor: 'error',
    module: moduleKeys.sales
  }
}
