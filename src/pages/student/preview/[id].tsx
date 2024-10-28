// ** Demo Components Imports
import { useRouter } from 'next/router'
import Preview from 'src/views/apps/student/preview/Preview'

const StudentPreview = () => {
  const router: any = useRouter()
  const id = router.query.id

  return <Preview id={id} />
}

export default StudentPreview
