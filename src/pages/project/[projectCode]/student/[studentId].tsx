import { useRouter } from 'next/router'
import StudentPreview from 'src/views/apps/project/projectstudent/Preview'

const ProjectStudentPreview = () => {
  const router = useRouter()
  const { projectCode, studentId } = router.query

  return <StudentPreview id={Number(studentId)} projectCode={String(projectCode)} />
}

export default ProjectStudentPreview
