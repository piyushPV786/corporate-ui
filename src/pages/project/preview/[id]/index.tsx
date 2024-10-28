import { useRouter } from 'next/router'
import Preview from 'src/views/apps/project/Preview'

const ProjectPreview = () => {
  const router: any = useRouter()
  const code = router.query.id

  return <Preview code={code} />
}

export default ProjectPreview
