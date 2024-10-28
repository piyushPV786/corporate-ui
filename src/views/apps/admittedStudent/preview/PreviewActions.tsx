import React from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import DialogStatusChange from 'src/views/pages/dialog/DialogStatusChange'
import { IStatusItem } from 'src/types/apps/dataTypes'
import { IAdmittedStudentTypes } from 'src/types/apps/admittedStudent'
import { CircularProgress } from '@mui/material'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import EcommerceActivityTimeline from 'src/views/dashboards/ecommerce/EcommerceActivityTimeline'

type Props = {
  studentData?: IAdmittedStudentTypes
  studentStatus?: IStatusItem
  getStudentData: () => void
}

const PreviewActions = ({ studentData, studentStatus, getStudentData }: Props) => {
  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Link href='/admitted-student/list/' passHref>
            <Button fullWidth sx={{ mb: 3.5 }} startIcon={<ArrowLeft />} variant='outlined'>
              BACK TO STUDENT LIST
            </Button>
          </Link>
          <FullPermission featureCode={FeatureCodes.EMS.admittedStudent}>
            <DialogStatusChange
              studentData={studentData}
              studentStatus={studentStatus}
              getStudentData={getStudentData}
            />
          </FullPermission>
        </CardContent>
      </Card>
      {studentData ? <EcommerceActivityTimeline data={studentData} /> : <CircularProgress />}
    </React.Fragment>
  )
}

export default PreviewActions
