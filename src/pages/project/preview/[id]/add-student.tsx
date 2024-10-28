import { useRouter } from 'next/router'

import Preview from 'src/views/apps/project/addstudent/index'

const ProjectStudentPreview = () => {
  const router: any = useRouter()
  const id = router.query.id

  return <Preview projectCode={id} />
}

export default ProjectStudentPreview
