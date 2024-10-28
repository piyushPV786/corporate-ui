import {
  SchoolOutline,
  NotebookMultiple,
  AccountSupervisor,
  FrequentlyAskedQuestions,
  CompassOutline,
  ChartTimeline,
  AccountCogOutline,
  AccountAlertOutline
} from 'mdi-material-ui'
import { Vip } from 'src/components/icons/vip'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'

const redirectUri = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const operationMenu = {
  [FeatureCodes.OMS.classManagement]: {
    title: 'Class Management',
    icon: AccountCogOutline,
    path: `${redirectUri}operation/class-management`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.attendanceManagement]: {
    title: 'Attendance Management',
    icon: AccountSupervisor,
    path: `${redirectUri}operation/attendance-management`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.AdmittedStudentList]: {
    title: 'Admitted Student',
    icon: SchoolOutline,
    path: `${redirectUri}operation/admitted-students-list`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.queryDashboard]: {
    title: 'Query Dashboard',
    icon: FrequentlyAskedQuestions,
    path: `${redirectUri}operation/query-dashboard`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.viewAndDownloadGraduation]: {
    title: 'View & Download Graduation List',
    icon: NotebookMultiple,
    path: `${redirectUri}operation/view-and-download-graduation-list`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.VIPStudents]: {
    title: 'VIP Students',
    icon: Vip,
    path: `${redirectUri}operation/vip-students`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.orientationSchedule]: {
    title: 'Orientation Schedule',
    icon: CompassOutline,
    path: `${redirectUri}operation/orientation-schedule`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.throughputReport]: {
    title: 'Throughput Report',
    icon: ChartTimeline,
    path: `${redirectUri}operation/throughput-report`,
    badgeColor: 'error',
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.riskDashboard]: {
    title: 'Risk Dashboard',
    icon: AccountAlertOutline,
    path: `${redirectUri}operation/risk-dashboard`,
    module: moduleKeys.operation
  },
  [FeatureCodes.OMS.UnenrolledStudent]: {
    title: 'Unenrolled Student',
    icon: SchoolOutline,
    path: `${redirectUri}operation/unenrolledStudent`,
    badgeColor: 'error',
    module: moduleKeys.operation
  }
}
