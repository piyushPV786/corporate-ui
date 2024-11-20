import { useAuth } from '../../hooks/useAuth'
import { PermissionsCodes, moduleKeys } from './featureData'
import React from 'react'

export const ModuleFeaturePermission = (feature: any, permission: any, module?: any) => {
  console.log(module)
  const auth = useAuth()
  let currentModuleRoleFeatures: any = []
  auth?.user?.roles?.forEach((item: any) => {
    const feature = item?.roleFeaturePermission
    currentModuleRoleFeatures = [...currentModuleRoleFeatures, ...feature]
  })

  const currentFeaturePermission = currentModuleRoleFeatures?.find((item: any) => {
    return item?.feature?.code === feature && permission.includes(item?.permission?.code)
  })

  return !!currentFeaturePermission
}

export const ViewPermission = (props: any) => {
  const currentModule = moduleKeys.sales
  const featurePermission = [PermissionsCodes?.view, PermissionsCodes?.full]
  const currentFeaturePermission = ModuleFeaturePermission(props?.featureCode, featurePermission, currentModule)
  if (currentFeaturePermission) {
    return <>{props.children}</>
  }

  return <></>
}

export const FullPermission = (props: any) => {
  const currentModule = moduleKeys.sales
  const featurePermission = [PermissionsCodes?.full]
  const currentFeaturePermission = ModuleFeaturePermission(props?.featureCode, featurePermission, currentModule)
  if (currentFeaturePermission) {
    return <>{props.children}</>
  }

  return <></>
}
