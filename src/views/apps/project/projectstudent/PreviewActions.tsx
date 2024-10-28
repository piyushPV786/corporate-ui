// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { SendOutline } from 'mdi-material-ui'

// ** Icons Imports
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { AddStudent } from 'src/context/common'
import { Box, Tooltip } from '@mui/material'

type Props = { projectCode: string; enrollStudentById: () => void; disableSubmit: boolean }

const PreviewActions = ({ enrollStudentById, disableSubmit, projectCode }: Props) => {
  return (
    <Card sx={{ mt: 13 }}>
      <CardContent>
        <Link href={`${AddStudent.BackToList}${projectCode}`} passHref>
          <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
            Back to List
          </Button>
        </Link>
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
