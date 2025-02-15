// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { SendOutline } from 'mdi-material-ui'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { AddStudent, intakeStatue } from 'src/context/common'
import { Box, Tooltip } from '@mui/material'

import ChangeStatus from './ChangeStatus'
import { IProjectStudentTypes } from 'src/types/apps/projectTypes'

type Props = {
  projectCode: string
  enrollStudentById: () => void
  disableSubmit: boolean
  student: IProjectStudentTypes
  getStudentDetail: () => Promise<void>
}

const PreviewActions = ({ enrollStudentById, disableSubmit, projectCode, student, getStudentDetail }: Props) => {
  return (
    <Card sx={{ mt: 13 }}>
      <CardContent>
        <Link href={`${AddStudent.BackToList}${projectCode}?tab=students`} passHref>
          <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
            Back to List
          </Button>
        </Link>
        {student?.status !== intakeStatue.intakeAssignedPending && (
          <ChangeStatus applicationCode={student?.applicationCode} getStudentDetail={getStudentDetail} />
        )}
        <Tooltip title={disableSubmit ? 'Upload Documents to Submit' : ''}>
          <Box>
            <Link href={`${AddStudent.BackToList}${projectCode}`} passHref>
              <Button
                fullWidth
                onClick={enrollStudentById}
                sx={{ mb: 3.5 }}
                variant='contained'
                startIcon={<SendOutline />}
                disabled={disableSubmit}
              >
                Submit
              </Button>
            </Link>
          </Box>
        </Tooltip>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
