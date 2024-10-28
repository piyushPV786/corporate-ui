// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

import Spinner from 'src/@core/components/spinner'
import navigation from 'src/navigation/vertical'
import { moduleKeys } from 'src/components/common/featureData'

const Home = () => {
  const router = useRouter()
  const nav: any = navigation()
  const navigations = nav?.find((item: { module: string }) => item?.module === moduleKeys.sales)
  useEffect(() => {
    if (navigations) {
      nav[1]?.children ? router?.push(nav[1]?.children[0]?.path) : router?.push(nav[1]?.path)
    } else {
      router?.push('/401')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
