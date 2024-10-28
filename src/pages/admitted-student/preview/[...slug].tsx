// ** Demo Components Imports
import { useRouter } from 'next/router'
import Preview from 'src/views/apps/admittedStudent/preview/Preview'

const StudentPreview = () => {
  const router: any = useRouter()
  const { slug } = router.query as any
  const [id, appCode] = slug

  if (id) {
    return <Preview id={id} appCode={appCode} />
  }
}

export default StudentPreview
