import { enrolmentMenu } from './menues/enrolmentMenu'
import { financeMenu } from './menues/financeMenu'
import { academicMenu } from './menues/academicMenu'
import { operationMenu } from './menues/operationMenu'
import { userManagementMenu } from './menues/userManageMenu'
import { assessmentMenu } from './menues/assessmentMenu'

const mainObject = (mainObject: any) => {
  const sortedObjects = Object.keys(mainObject)
    .map(key => ({ key, innerObject: mainObject[key] }))
    .sort((a, b) => a.innerObject.title.localeCompare(b.innerObject.title))
    .reduce((acc: any, curr) => {
      acc[curr.key] = curr.innerObject

      return acc
    }, {})

  return sortedObjects
}

export const MenuData: any = {
  ...mainObject(enrolmentMenu),
  ...mainObject(academicMenu),
  ...mainObject(assessmentMenu),
  ...mainObject(financeMenu),
  ...mainObject(operationMenu),
  ...mainObject(userManagementMenu)
}
