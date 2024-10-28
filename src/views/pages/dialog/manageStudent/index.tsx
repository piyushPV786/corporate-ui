import { Box, Dialog, DialogContent, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { IGroupAPITypes, IGroupTypes, IProgramAPITypes } from 'src/context/types'
import ManageStudentForm from './manageStudentForm'
import { AddEditButton } from './components'

interface IStudentManagementProps {
  programLists: IProgramAPITypes[]
  years: Array<string>
  groups: IGroupTypes[]
  edit: boolean
  individualStudentData?: IGroupAPITypes
  getStudentGroupList: () => {}
}

const StudentManagementDialogue = ({
  programLists,
  years,
  groups,
  edit,
  individualStudentData,
  getStudentGroupList
}: IStudentManagementProps) => {
  const [openDialogue, setOpenDialogue] = useState<boolean>(false)

  const onClickDialogue = () => {
    setOpenDialogue(!openDialogue)
  }

  return (
    <Grid>
      <AddEditButton edit={edit} onClickDialogue={onClickDialogue} individualStudentData={individualStudentData} />
      <Dialog
        fullWidth
        open={openDialogue}
        maxWidth='lg'
        scroll='body'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            onClickDialogue()
          }
        }}
      >
        <DialogContent>
          <Typography textAlign='center' variant='h5'>
            {edit ? 'Edit Students' : 'Manage Students'}
          </Typography>
          <Box p={5}>
            <ManageStudentForm
              programLists={programLists}
              years={years}
              groups={groups}
              edit={edit}
              individualStudentData={individualStudentData}
              onClickDialogue={onClickDialogue}
              getStudentGroupList={getStudentGroupList}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default StudentManagementDialogue
