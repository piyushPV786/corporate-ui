// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { Button, Card, CardContent } from '@mui/material'

// ** Custom Services and Components
// import CorporateReject from 'src/views/pages/dialog/CorporateReject'
import { corporateConstant } from 'src/context/corporateData'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'

import { Fragment } from 'react'

import { CommonActivityTab } from 'src/views/dashboards/comments/CommentComponenet'
import EnrollToRetail from './EnrollToRetail'
import { applicationStatus, cancelledApplicationStatus, completedApplicationStatus } from 'src/context/common'

const PreviewActions = ({ data, getCorporateStudentsDetailById }: any) => {
  return (
    <Fragment>
      <Card>
        <CardContent>
          <Link href={corporateConstant.list} passHref>
            <Button fullWidth startIcon={<ArrowLeft />} variant='outlined'>
              Back to List
            </Button>
          </Link>
          {(data?.status === applicationStatus || data?.status === cancelledApplicationStatus || data?.status ===completedApplicationStatus) && (
            <EnrollToRetail studentCode={data?.lead?.studentCode} />
          )}
        </CardContent>
        {/* <CardContent>
          <CorporateReject rejectStudent={rejectStudent} disable={disableReject} />
        </CardContent>

        <CardContent>
          <CorpStudConfirmationDialog submit={approveStudent} disable={disableApprove} />
        </CardContent> */}
      </Card>
      <CommonActivityTab data={data} getCorporateStudentsDetailById={getCorporateStudentsDetailById} />
    </Fragment>
  )
}

export default PreviewActions
