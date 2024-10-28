// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { Fragment } from 'react'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import ResetStatusComponent from 'src/components/ResetStatusComponent'
import EcommerceActivityTimeline from 'src/views/dashboards/ecommerce/EcommerceActivityTimeline'

interface IPreviewActionsPropTypes {
  data: IDynamicObject
  getApplicationDetails: () => void
}

const PreviewActions = ({ data, getApplicationDetails }: IPreviewActionsPropTypes) => {
  return (
    <Fragment>
      <Card>
        <CardContent>
          <Link href='/application-search/list/' passHref>
            <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
              Back to List
            </Button>
          </Link>
          <ResetStatusComponent studentdata={data} getApplicationDetails={getApplicationDetails} />
        </CardContent>
      </Card>
      <EcommerceActivityTimeline data={data} />
    </Fragment>
  )
}

export default PreviewActions
