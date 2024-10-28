import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

interface IBreadcrumbList {
  href: string
  text: string
  last?: boolean
}
interface IDynamicBreadcrumbPropsTypes {
  asPath: string
  code?: string
}

export default function DynamicBreadcrumb({ asPath, code }: IDynamicBreadcrumbPropsTypes) {
  const breadcrumbList: Array<IBreadcrumbList> = []

  const asPathNestedRoutes = asPath
    ?.split('?')[0]
    .split('/')
    .filter(value => value.length > 0)

  const crumbList = asPathNestedRoutes.map((subpath, idx) => {
    const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/')
    if (asPathNestedRoutes?.length === 2) {
      return {
        href,
        text: asPathNestedRoutes?.slice(0, 2)?.map(item => item.charAt(0).toUpperCase() + item.slice(1) + ' ')
      }
    } else {
      return {
        href,
        text: subpath
      }
    }
  })

  crumbList.map((values, index, array) => {
    let href = ''
    if (values.href === `${array[0].href}/preview`) {
      href = `${process.env.NEXT_PUBLIC_BASE_URL}${array[0].href}/list`
    } else if (values.href === array[0].href) {
      href = `${process.env.NEXT_PUBLIC_BASE_URL}`
    } else {
      href = values.href
    }

    let text = ''
    if (values.text === 'preview') {
      text = `${array[0].text} list`
    } else if (values.text === code) {
      text = `${array[index - 1].text}`
    } else if (values.text === 'list') {
      text = `${array[0].text} list`
    } else if (values.text === array[0].text) {
      text = 'Dashboard'
    } else {
      text = Array.isArray(values.text) ? values.text.join('') : String(values.text)
    }

    breadcrumbList.push({ href: href, text: text })
  })

  return (
    <Breadcrumbs aria-label='breadcrumb' className='page-breadcrumb'>
      {breadcrumbList.map((crumb: IBreadcrumbList, idx: number) => (
        <Crumb {...crumb} key={idx} last={idx === breadcrumbList.length - 1} />
      ))}
    </Breadcrumbs>
  )
}

function Crumb({ text, href, last = false }: IBreadcrumbList) {
  if (last) {
    return (
      <Typography color='text.primary' variant='h6' sx={{ textTransform: 'capitalize' }}>
        {text}
      </Typography>
    )
  }

  return (
    <Link underline='hover' sx={{ fontWeight: '500', textTransform: 'capitalize' }} color='success' href={href}>
      {text}
    </Link>
  )
}
