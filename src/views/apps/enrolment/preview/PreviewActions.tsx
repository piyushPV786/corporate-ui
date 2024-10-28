// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { SendOutline } from 'mdi-material-ui'
import { Fragment } from 'react'
import { IStudentPreviewDataTypes } from 'src/types/apps/common'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import EnrollmentNewProgramDialouge from 'src/views/pages/dialog/EnrollmentNewProgramDialouge'
import { Box } from '@mui/material'
import { CommonActivityTab } from 'src/views/dashboards/comments/CommentComponenet'
import { applicationStatus, cancelledApplicationStatus, completedApplicationStatus } from 'src/context/common'

interface IProps {
  approve: () => void
  isApproveDisabled: boolean
  getEnrolmentDetailById: () => void
  data: IStudentPreviewDataTypes
  appCode: any[]
}

const PreviewActions = ({ approve, isApproveDisabled, getEnrolmentDetailById, data, appCode }: IProps) => {
  const isGraduate =
    appCode?.length &&
    appCode?.some(
      i =>
        i.status === applicationStatus ||
        i.status === completedApplicationStatus ||
        i.status === cancelledApplicationStatus
    )

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Link href='/application-enrollment/list/' passHref>
            <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 2 }} variant='outlined'>
              Back to List
            </Button>
          </Link>
          {data?.document?.length > 0 && (
            <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
              <Button
                disabled={isApproveDisabled}
                onClick={() => {
                  approve(), getEnrolmentDetailById()
                }}
                fullWidth
                variant='contained'
                startIcon={<SendOutline />}
              >
                Verify
              </Button>
            </FullPermission>
          )}
          {(data?.application?.status === applicationStatus ||
            data?.application?.status === cancelledApplicationStatus ||
            data?.application?.status === completedApplicationStatus) &&
          isGraduate ? (
            <Box sx={{ mt: 2 }}>
              <EnrollmentNewProgramDialouge
                data={data}
                appCode={appCode}
                getEnrolmentDetailById={getEnrolmentDetailById}
              />
            </Box>
          ) : null}
        </CardContent>
      </Card>
      <CommonActivityTab data={data} getStudentDetailById={getEnrolmentDetailById} />
    </Fragment>
  )
}

export default PreviewActions
