import {
  NotebookMultiple,
  BadgeAccount,
  AccountSupervisor,
  FileMultiple,
  NoteMultipleOutline,
  ClipboardTextClock
} from 'mdi-material-ui'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'
import ExamSchedule from 'src/components/icons/ExamSchedule'
import { ExamAttendance } from 'src/components/icons/examAttendance'

const redirectUrl = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const assessmentMenu = {
  [FeatureCodes.AAMS.academicTranscripts]: {
    title: 'Academic Transcripts',
    icon: BadgeAccount,
    path: `${redirectUrl}assessment/academic-transcripts`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.admittedStudent]: {
    title: 'Admitted Student',
    icon: AccountSupervisor,
    path: `${redirectUrl}assessment/admitted-student/list`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.moduleAcademicReport]: {
    title: 'Module Academic Records',
    icon: FileMultiple,
    path: `${redirectUrl}assessment/module-academic-records`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.assessmentDashboard]: {
    title: 'Assessment Dashboard',
    icon: NoteMultipleOutline,
    path: `${redirectUrl}assessment/assessment-dashboard`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },

  [FeatureCodes.AAMS.examRoomManagement]: {
    title: 'Exam Room Management',
    icon: ClipboardTextClock,
    path: `${redirectUrl}assessment/exam-room-management`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.viewAndDownloadGraduation]: {
    title: 'View & Download Graduation List',
    icon: NotebookMultiple,
    path: `${redirectUrl}assessment/view-and-download-graduation-list`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.examSchedule]: {
    title: 'Exam Schedule',
    icon: ExamSchedule,
    path: `${redirectUrl}assessment/exam-schedule`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  },
  [FeatureCodes.AAMS.viewExamAttendance]: {
    title: 'View Exam Attendance',
    icon: ExamAttendance,
    path: `${redirectUrl}assessment/view-exam-attendance`,
    badgeColor: 'error',
    module: moduleKeys.assessment
  }
}
