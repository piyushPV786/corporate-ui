import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { IconButton } from '@mui/material'
import { Close } from 'mdi-material-ui'
import styles from '../studentManagement/student.module.css'
import StudentHeader from './StudentHeader'
import TabDetails from './TabDetails'
import { IEnrollCorporateState } from 'src/context/common'

interface IEnrollAndUnenrollStudentListProps {
  EnrolledStudent: IEnrollCorporateState
  handleClose: () => void
}

const EnrollAndUnenrollCorporateStudentList = ({
  EnrolledStudent,
  handleClose
}: IEnrollAndUnenrollStudentListProps) => {
  const response = EnrolledStudent?.response
  const count = EnrolledStudent?.response?.count

  return (
    <>
      <Dialog
        open={EnrolledStudent.show}
        onClose={(event, reason) => {
          reason !== 'backdropClick' && handleClose()
        }}
        fullWidth
        maxWidth='lg'
        scroll='body'
      >
        <DialogTitle className={styles.title}>Bulk Enrollment Status</DialogTitle>
        <IconButton
          onClick={handleClose}
          color='primary'
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <Close fontSize='large' />
        </IconButton>
        <DialogContent>
          <StudentHeader count={count} />
          <TabDetails response={response} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EnrollAndUnenrollCorporateStudentList
