import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { getFullName, getName } from 'src/utils'

interface ICommonListStateType {
  programList: commonListTypes[]
  corporateList: commonListTypes[]
  courseTypeList: commonListTypes[]
  accountManagerList: commonListTypes[]
  projectManagerList: commonListTypes[]
}

type params = {
  projectDetailsOpen: boolean
  handleCloseProjectDetails: () => void
  project: any
  commonList: ICommonListStateType
}

const ProjectInformation = ({ projectDetailsOpen, handleCloseProjectDetails, project, commonList }: params) => {
  return (
    <Dialog
      open={projectDetailsOpen}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleCloseProjectDetails
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '750px'
        }
      }}
      fullWidth={true}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {' '}
        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
          {project?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Grid container spacing={2} sx={{ pl: 5 }}>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Project Code' secondary={project?.code} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='Account Manager'
                    secondary={getFullName(commonList.accountManagerList, project?.accountManager) ?? '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='No of Students'
                    secondary={project?.noOfStudent == 0 ? '-' : project?.noOfStudent}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Corporate Name' secondary={project?.corporateEd?.name ?? '-'} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='Qualification Name'
                    secondary={getName(commonList.programList, project?.program) ?? '-'}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText
                    primary='Project Manager'
                    secondary={getFullName(commonList.projectManagerList, project?.projectManager) ?? '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary='Course Type'
                    secondary={getName(commonList.courseTypeList, project?.courseType) ?? '-'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant='contained' onClick={handleCloseProjectDetails}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProjectInformation
