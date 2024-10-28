import { useRouter } from 'next/router'
import CommonErrorComponent from 'src/components/Common500'

const Error500 = () => {
  const router = useRouter()
  const handleRedirect = () => {
    router.push('/student/list/')
  }

  return <CommonErrorComponent handleRedirect={handleRedirect} />
}
export default Error500
