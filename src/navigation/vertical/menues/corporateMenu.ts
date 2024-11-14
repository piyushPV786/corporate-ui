import { FaceAgent } from 'mdi-material-ui'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'

export const corporateMenu = {
  [FeatureCodes.CES.corporateStudents]: {
    title: 'Corporate Student Application',
    icon: FaceAgent,
    path: '/corporate-students/list',
    badgeColor: 'error',
    module: moduleKeys.corporate
  },
  [FeatureCodes.CES.corporate]: {
    title: 'Corporate',
    icon: FaceAgent,
    path: '/corporate/management',
    badgeColor: 'error',
    module: moduleKeys.corporate
  },
  [FeatureCodes.CES.corporateGroup]: {
    title: 'Corporate Groups',
    icon: FaceAgent,
    path: '/corporate-groups/list',
    badgeColor: 'error',
    module: moduleKeys.corporate
  },
  [FeatureCodes.CES.corporateStudentManagement]: {
    title: 'Corporate Student Management',
    icon: FaceAgent,
    path: '/corporate-students-management',
    badgeColor: 'error',
    module: moduleKeys.corporate
  },
  [FeatureCodes.CES.projectManagement]: {
    title: 'Project Management',
    icon: FaceAgent,
    path: '/project/management',
    badgeColor: 'error',
    module: moduleKeys.corporate
  },
  [FeatureCodes.CES.corporateManager]: {
    title: 'Corporate Manager',
    icon: FaceAgent,
    path: '/corporate-manager',
    badgeColor: 'error',
    module: moduleKeys.corporate
  }
}
