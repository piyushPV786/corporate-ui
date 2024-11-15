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
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { CommonActivityTab } from 'src/views/dashboards/comments/CommentComponenet'
import EnrollToRetail from './EnrollToRetail'

interface IPropsTypes {
  rejectStudent: (comments: string) => void
  approveStudent: () => void
  data: IDynamicObject
  disableApprove: boolean
  disableReject: boolean
}

const PreviewActions = ({ data }: IPropsTypes) => {
  return (
    <Fragment>
      <Card>
        <CardContent>
          <Link href={corporateConstant.list} passHref>
            <Button fullWidth startIcon={<ArrowLeft />} variant='outlined'>
              Back to List
            </Button>
          </Link>

          <EnrollToRetail />
        </CardContent>
        {/* <CardContent>
          <CorporateReject rejectStudent={rejectStudent} disable={disableReject} />
        </CardContent>

        <CardContent>
          <CorpStudConfirmationDialog submit={approveStudent} disable={disableApprove} />
        </CardContent> */}
      </Card>
      <CommonActivityTab data={data} />
    </Fragment>
  )
}

export default PreviewActions
