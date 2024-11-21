// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { PermissionsCodes, UrlToModule } from 'src/components/common/featureData'
import { ModuleFeaturePermission } from 'src/components/common'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  let permission = true

  const routePath = router.route.split('/')[1]

  auth.user &&
    auth.user.roles?.map(item =>
      item.roleFeaturePermission.map(data => {
        if (data.feature.code === UrlToModule[routePath]) {
          permission = ModuleFeaturePermission(data.feature.code, [PermissionsCodes.view, PermissionsCodes.full])

          return

          //no return console
        }
      })
    )

  // User is logged in, build ability for the user based on his role
  if (auth.user && auth.user.roles && auth.user.isActive && !ability && permission) {
    setAbility(buildAbilityFor())
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
