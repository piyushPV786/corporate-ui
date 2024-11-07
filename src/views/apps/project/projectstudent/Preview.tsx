// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Box, Grid } from '@mui/material'

// ** Custom Components/Services Imports
import PreviewCard from 'src/views/apps/project/projectstudent/PreviewCard'
import PreviewActions from 'src/views/apps/project/projectstudent/PreviewActions'
import { DashboardService, StudentService } from 'src/service'
import { status } from 'src/context/common'
import FallbackSpinner from 'src/@core/components/spinner'
import { IProjectStudentTypes } from 'src/types/apps/projectTypes'
import { errorToast, successToast } from 'src/components/Toast'

interface IStudentPreviewProps {
  id: number | string | any
  projectCode: string
}

const StudentPreview = ({ id, projectCode }: IStudentPreviewProps) => {
  const [studentDetail, setStudentDetail] = useState<IProjectStudentTypes>()

  const getStudentDetailById = async () => {
    const response = await DashboardService.getProjectStudentById(id)
    if (response?.status === status?.successCode && response?.data?.data) {
      setStudentDetail(response?.data?.data)
    }
  }
  const enrollStudentById = async () => {
    if (!!studentDetail) {
      const response = await StudentService.enrollProjectStudent(studentDetail?.code)
      if (status.successCodeArr.includes(response?.statusCode)) {
        successToast(`${studentDetail.firstName} ${studentDetail.lastName} Application Submitted Successfully`)
      }
    } else {
      errorToast('Student Code is not available')
    }
  }
  useEffect(() => {
    getStudentDetailById()
  }, [id])

  return !!studentDetail ? (
    <Grid container spacing={6}>
      <Grid item xl={9} md={8} xs={12}>
        <PreviewCard
          studentId={id}
          studentDetail={studentDetail}
          getStudentDetailById={getStudentDetailById}

          //projectCode={projectCode}
        />
      </Grid>
      <Grid item xl={3} md={4} xs={12}>
        <Box className='sticky-sidebar'>
          <PreviewActions
            enrollStudentById={enrollStudentById}
            disableSubmit={studentDetail?.documents?.data?.length === 0}
            projectCode={projectCode}
          />
        </Box>
      </Grid>
    </Grid>
  ) : (
    <FallbackSpinner />
  )
}

export default StudentPreview
