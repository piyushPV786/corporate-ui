import { useRouter } from 'next/router'
import Preview from 'src/views/apps/corporateStudents/preview/Preview'

const CorporateStudentPreview = () => {
  const router = useRouter()
  const id = router.query.id

  return <Preview studentCode={id} />
}

export default CorporateStudentPreview
