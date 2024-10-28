import {
  AccountGroupOutline,
  SchoolOutline,
  HeadSnowflakeOutline,
  AccountMultiplePlus,
  FileMultiple,
  HomeAnalytics,
  ClipboardTextClock,
  MapMarkerRadius,
  AccountCogOutline
} from 'mdi-material-ui'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'

const redirectUrl = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const academicMenu = {
  [FeatureCodes.AMS.qualificationAndModule]: {
    title: 'Qualification & Modules',
    icon: SchoolOutline,
    children: [
      {
        title: 'Undergraduate',
        path: `${redirectUrl}academic/undergraduate-qualification`
      },
      {
        title: 'Postgraduate',
        path: `${redirectUrl}academic/postgraduate-qualification`
      },
      {
        title: 'Short Course / Skill',
        path: `${redirectUrl}academic/skill-qualification`
      }
    ],
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.groups]: {
    title: 'Groups',
    icon: AccountGroupOutline,
    path: `${redirectUrl}academic/groups`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.RMATConfiguration]: {
    title: 'RMAT Configuration',
    icon: HeadSnowflakeOutline,
    path: `${redirectUrl}academic/rmat-configuration`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.academicIntake]: {
    title: 'Academic Intake',
    icon: AccountMultiplePlus,
    path: `${redirectUrl}academic/academic-intake`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },

  // [FeatureCodes.AMS.academicTranscripts]: {
  //   title: 'Academic Transcripts',
  //   icon: BadgeAccount,
  //   path: `${redirectUrl}academic/academic-transcripts`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  // [FeatureCodes.AMS.admittedStudent]: {
  //   title: 'Admitted Student',
  //   icon: AccountSupervisor,
  //   path: `${redirectUrl}academic/admitted-student/list`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },

  // [FeatureCodes.AMS.moduleAcademicReport]: {
  //   title: 'Module Academic Records',
  //   icon: FileMultiple,
  //   path: `${redirectUrl}academic/module-academic-records`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  // [FeatureCodes.AMS.assessmentDashboard]: {
  //   title: 'Assessment Dashboard',
  //   icon: NoteMultipleOutline,
  //   path: `${redirectUrl}academic/assessment-dashboard`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  [FeatureCodes.AMS.manageDepartments]: {
    title: 'Manage Departments',
    icon: HomeAnalytics,
    path: `${redirectUrl}academic/manage-department`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },

  // [FeatureCodes.AMS.examRoomManagement]: {
  //   title: 'Exam Room Management',
  //   icon: ClipboardTextClock,
  //   path: `${redirectUrl}academic/exam-room-management`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  // [FeatureCodes.AMS.viewAndDownloadGraduation]: {
  //   title: 'View & Download Graduation List',
  //   icon: NotebookMultiple,
  //   path: `${redirectUrl}academic/view-and-download-graduation-list`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  [FeatureCodes.AMS.manageVenues]: {
    title: 'Manage Venues',
    icon: MapMarkerRadius,
    path: `${redirectUrl}academic/manage-venues`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },

  // [FeatureCodes.AMS.examSchedule]: {
  //   title: 'Exam Schedule',
  //   icon: ExamSchedule,
  //   path: `${redirectUrl}academic/exam-schedule`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // },
  [FeatureCodes.AMS.courseProfile]: {
    title: 'Course Profile',
    icon: FileMultiple,
    path: `${redirectUrl}academic/course-profile`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.manageSchedules]: {
    title: 'Manage Schedules',
    icon: ClipboardTextClock,
    path: `${redirectUrl}academic/manage-schedules`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.classManagement]: {
    title: 'Class Management',
    icon: AccountCogOutline,
    path: `${redirectUrl}academic/class-management`,
    badgeColor: 'error',
    module: moduleKeys.academics
  },
  [FeatureCodes.AMS.manageFacilitator]: {
    title: 'Manage Facilitator & Invigilator',
    icon: AccountCogOutline,
    path: `${redirectUrl}academic/manage-facilitator-and-invigilator`,
    badgeColor: 'error',
    module: moduleKeys.academics
  }

  // [FeatureCodes.AMS.viewExamAttendance]: {
  //   title: 'View Exam Attendance',
  //   icon: ExamAttendance,
  //   path: `${redirectUrl}academic/view-exam-attendance`,
  //   badgeColor: 'error',
  //   module: moduleKeys.academics
  // }
}
