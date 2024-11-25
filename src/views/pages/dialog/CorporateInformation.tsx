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
  conformationOpen: boolean
  handleCloseConfirmationPopup: () => void
  selectedRows: any
}

const CorporateInformation = ({ conformationOpen, handleCloseConfirmationPopup, selectedRows }: params) => {
  return (
    <Dialog
      open={conformationOpen}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleCloseConfirmationPopup
        }
      }}
      maxWidth={'sm'}
      fullWidth={true}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {' '}
        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
          {selectedRows?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <List>
                <ListItem>
                  <ListItemText primary='Company Code' secondary={selectedRows?.code} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Email' secondary={selectedRows?.email || '-'} />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                <ListItem>
                  <ListItemText primary='Company Type' secondary={selectedRows?.companyType} />
                </ListItem>
                <ListItem>
                  <ListItemText primary='Contact Number' secondary={selectedRows?.phoneNumber || '-'} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              background: '#f7f7f7',
              padding: '0.5rem',
              borderRadius: 10,
              boxShadow: '1px 6px 6px 0px #b5b3b3fc'
            }}
          >
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', fontSize: '1rem !important', fontWeight: 'bold' }}>
                Contact Information
              </Typography>
            </Grid>
            {selectedRows?.corporateAddress?.map((item: any) => (
              <Grid item xs={6} key={item?.addressType}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={item?.addressType === 'POSTAL' ? 'Postal Address' : 'Physical Address'}
                      secondary={`${item?.address1} ${item?.address2} ${item?.country} ${item?.state} - ${item?.pincode}`}
                    />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant='contained' onClick={handleCloseConfirmationPopup}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CorporateInformation
