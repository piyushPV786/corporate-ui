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

type params = {
  corporateGroupDetailsOpen: boolean
  handleCloseCorporateGroupDetails: () => void
  corporateGroup: any
}

const CorporateGroupInformation = ({
  corporateGroupDetailsOpen,
  handleCloseCorporateGroupDetails,
  corporateGroup
}: params) => {
  return (
    <Dialog
      open={corporateGroupDetailsOpen}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleCloseCorporateGroupDetails
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
          {corporateGroup?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Grid container spacing={2} sx={{ pl: 5 }}>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Corporate Group Code' secondary={corporateGroup?.code} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='No of Students' secondary={corporateGroup?.studentCout ?? '-'} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Project Name' secondary={corporateGroup?.project?.name} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Intake Name' secondary={corporateGroup?.intake?.name} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant='contained' onClick={handleCloseCorporateGroupDetails}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CorporateGroupInformation
