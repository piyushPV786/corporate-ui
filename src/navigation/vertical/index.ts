import { ModuleFeaturePermission } from 'src/components/common'
import { MenuData } from './data'
import { MenuTitles, PermissionsCodes } from 'src/components/common/featureData'

interface IMenu {
  title?: string
  icon?: any
  path?: string
  badgeColor?: string
  name?: string
  sectionTitle?: string
  module?: string
}

const navigation = (): any => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const keys = Object.keys(MenuData)
  const menu: IMenu[] = []
  keys.filter(item => {
    const value = MenuData[`${item}`]
    const permission = ModuleFeaturePermission(item, [PermissionsCodes.view, PermissionsCodes.full], value.module)
    if (permission) {
      const menuTitleCheck = menu.find((item: any) => item?.module === value?.module)
      if (!menuTitleCheck) {
        menu.push({ sectionTitle: MenuTitles[value.module] })
      }
      menu.push(value)
    }
  })

  return menu
}

export default navigation
