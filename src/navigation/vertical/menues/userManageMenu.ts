import { HomeOutline, ShieldPlusOutline } from 'mdi-material-ui'
import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'

const redirectUri = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const userManagementMenu = {
  [FeatureCodes.UMS.dashboard]: {
    title: 'Dashboard',
    icon: HomeOutline,
    path: `${redirectUri}user-management/dashboard`,
    badgeColor: 'error',
    module: moduleKeys.user
  },
  [FeatureCodes.UMS.manageUserRoleAndPermission]: {
    title: 'Manage User Roles & Permissions',
    icon: ShieldPlusOutline,
    path: `${redirectUri}user-management/manage-permission`,
    badgeColor: 'error',
    module: moduleKeys.user
  }
}
