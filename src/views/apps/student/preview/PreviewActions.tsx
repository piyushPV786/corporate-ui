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
import { CommonActivityTab } from 'src/views/dashboards/comments/CommentComponenet'

interface IPreviewActionsPropTypes {
  data: IDynamicObject
  getStudentDetailById: () => void
}

const PreviewActions = ({ data, getStudentDetailById }: IPreviewActionsPropTypes) => {
  return (
    <Fragment>
      <Card>
        <CardContent>
          <Link href='/student/list/' passHref>
            <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
              Back to List
            </Button>
          </Link>
        </CardContent>
      </Card>
      <CommonActivityTab data={data} getStudentDetailById={getStudentDetailById} />
    </Fragment>
  )
}

export default PreviewActions
