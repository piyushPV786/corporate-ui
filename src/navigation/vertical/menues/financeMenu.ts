import {
  HomeOutline,
  FileMultiple,
  PercentOutline,
  CashMultiple,
  Receipt,
  CurrencyEur,
  AlignVerticalBottom,
  RepeatOnce
} from 'mdi-material-ui'
import { Vip } from 'src/components/icons/vip'

import { FeatureCodes, moduleKeys } from 'src/components/common/featureData'

const redirectUri = process.env.NEXT_PUBLIC_USER_REDIRECT_URL

export const financeMenu = {
  [FeatureCodes.FMS.applicationProofOfPayment]: {
    title: 'Application Proof of Payments',
    icon: HomeOutline,
    path: `${redirectUri}finance/student/list`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.discount]: {
    title: 'Discount',
    icon: PercentOutline,
    children: [
      {
        title: 'Management',
        path: `${redirectUri}finance/discount/management`
      },
      {
        title: 'Sales',
        path: `${redirectUri}finance/discount/sales`
      }
    ],
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.fees]: {
    title: 'Fees',
    icon: CashMultiple,
    path: `${redirectUri}finance/fees`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.admittedStudent]: {
    title: 'Admitted Student',
    icon: Receipt,
    path: `${redirectUri}finance/admitted-student`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.manageConversionRate]: {
    title: 'Manage Conversion Rate ',
    icon: CurrencyEur,
    path: `${redirectUri}finance/conversion-rates/list`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.monthlyPaymentStudent]: {
    title: 'Financial Approval',
    icon: AlignVerticalBottom,
    path: `${redirectUri}finance/financial-approval`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.bursaryApplications]: {
    title: 'Bursary Applications',
    icon: RepeatOnce,
    path: `${redirectUri}finance/bursary-applicants/list`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.VIPStudents]: {
    title: 'VIP Students',
    icon: Vip,
    path: `${redirectUri}finance/vip-Students`,
    badgeColor: 'error',
    module: moduleKeys.finance
  },
  [FeatureCodes.FMS.manageOtherFees]: {
    title: 'Manage Other Fees',
    icon: FileMultiple,
    path: `${redirectUri}finance/manage-other-fees`,
    badgeColor: 'error',
    module: moduleKeys.finance
  }
}
