// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import { Box, Button, Chip, Grid, Typography } from '@mui/material'

// ** Icon Imports
import { ArrowLeft } from 'mdi-material-ui'

// ** Custom Components Imports
import { ThemeColor } from 'src/@core/layouts/types'
import PreviewCard from 'src/views/apps/corporateStudents/preview/PreviewCard'
import PreviewActions from 'src/views/apps/corporateStudents/preview/PreviewActions'
import { applicationStatusColor, messages, status, studentApplicationAllStatus } from 'src/context/common'
import { DashboardService, StudentService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import { IAcceptCorporateStudentParams, ICorporateStudent } from 'src/types/apps/corporatTypes'
import FallbackSpinner from 'src/@core/components/spinner'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { corporateConstant, placeDivContentCenter } from 'src/context/corporateData'

interface IPropsTypes {
  studentCode: any
}
const userStatusObj: { [key: string]: ThemeColor } = {
  [corporateConstant.Enrolled]: 'warning',
  [corporateConstant.REJECT]: 'error',
  [corporateConstant['PROG-ADMITTED']]: 'primary'
}

const CorporateStudentPreview = ({ studentCode }: IPropsTypes) => {
  const router = useRouter()
  const [data, setData] = useState<ICorporateStudent>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getCorporateStudentsDetailById = async () => {
    const response = await DashboardService.getCorporateStudentsDetailByCode(studentCode)
    if (response?.statusCode === status.successCode) {
      setData(response?.data)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    studentCode && getCorporateStudentsDetailById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentCode])

  const corporateApprove = async (params: IAcceptCorporateStudentParams) => {
    const result = await StudentService.acceptCorporateStudent(params)
    if (result?.statusCode === status.successCode) {
      successToast(
        `${studentCode} ${
          params.status === status.approve ? corporateConstant.approveStudent : corporateConstant.rejectStudent
        }`
      )
    } else {
      errorToast(messages.error)
    }
    setIsLoading(false)
    router.push(corporateConstant.list)
  }

  const approveStudent = () => {
    corporateApprove({ code: studentCode, status: status.approve })
  }

  const rejectStudent = (comments: string) => {
    corporateApprove({ code: studentCode, status: status.reject, comments: comments })
  }

  // const checkDocumentApprove = data?.documents?.data?.filter(item => item?.status === documentStatus.salesApproved)
  const isActionTriggered = data?.status !== status.enrolled

  return isLoading ? (
    <FallbackSpinner />
  ) : !!data ? (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography>
          <b>Student Details</b>
        </Typography>
        <Typography className='page-header'>
          <DynamicBreadcrumb asPath={router.asPath} code={studentCode.toString()} />
        </Typography>
        <Typography className='page-header'>
          Student ID: {data?.lead?.studentCode}
          <Chip
            size='small'
            label={
              !!corporateConstant[data.status]
                ? corporateConstant[data.status]
                : studentApplicationAllStatus[data.status]
                  ? studentApplicationAllStatus[data.status]
                  : data.status
            }
            color={userStatusObj[corporateConstant[data.status]] ?? applicationStatusColor[data.status]}
            sx={{ textTransform: 'capitalize', ml: 1 }}
          />
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <PreviewCard studentData={data} getCorporateStudentsDetailById={getCorporateStudentsDetailById} />
      </Grid>
      <Grid item xs={3}>
        <Box className='sticky-sidebar'>
          <PreviewActions
            getCorporateStudentsDetailById={getCorporateStudentsDetailById}
            data={data}
            rejectStudent={rejectStudent}
            approveStudent={approveStudent}
            disableApprove={isActionTriggered}
            disableReject={isActionTriggered}
          />
        </Box>
      </Grid>
    </Grid>
  ) : (
    <Grid container height={300} sx={placeDivContentCenter}>
      <Box>
        <Typography variant='h3'>No Data Found</Typography>
        <Box sx={placeDivContentCenter}>
          <Link href={corporateConstant.list} passHref style={{ alignSelf: 'center' }}>
            <Button startIcon={<ArrowLeft />} variant='contained'>
              Back to List
            </Button>
          </Link>
        </Box>
      </Box>
    </Grid>
  )
}

export default CorporateStudentPreview
