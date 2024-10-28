// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material'

// ** Custom Services/Component
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { IExamDetailsTypes, IResultDetailsTypes } from 'src/types/apps/dataTypes'

const examLevelLabels: IDynamicObject = {
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
  level4: 'Level 4',
  level5: 'Level 5',
  level6: 'Level 6'
}
const examLevels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6']
interface IPropsType {
  examDetails: IResultDetailsTypes
  marks: IExamDetailsTypes
}

const RmatDetailDialog = ({ examDetails, marks }: IPropsType) => {
  const [show, setShow] = useState<boolean>(false)
  const marksDetails: IDynamicObject = marks
  const openDialog = () => {
    setShow(true)
  }
  const onClose = () => {
    setShow(false)
  }

  return (
    <Grid>
      <Box display='block'>
        <Button color='warning' onClick={openDialog} sx={{ textDecoration: 'underline' }}>
          View Result
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='md'
        open={show}
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && onClose()
        }}
      >
        <DialogContent sx={{ p: 10, position: 'relative' }}>
          {marksDetails ? (
            <Fragment>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5'>RMAT Details-Attempt</Typography>
              </Box>
              <Grid container rowSpacing={10}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={4}>
                      <label>Link Sent on</label>
                      <Typography variant='h6' pt={2}>
                        {new Date(examDetails?.createdAt).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <label>Exam Completion</label>
                      <Typography variant='h6' pt={2}>
                        {new Date(marksDetails?.createdAt).toLocaleString('en-GB')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid
                    container
                    sx={{
                      backgroundColor: theme => theme.palette.customColors.darkBg,
                      color: theme => theme.palette.common.white,
                      borderRadius: '8px'
                    }}
                  >
                    <Grid item xs={8} p={5}>
                      <Grid container rowSpacing={8}>
                        {examLevels.map(item => (
                          <Grid key={item} item xs={4}>
                            <label>{examLevelLabels[item]}</label>
                            <Typography variant='h6' color='inherit' pt={2}>
                              {!!marksDetails[item] ? marksDetails[item] : '-'}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        borderLeft: '2px solid white',
                        display: 'grid',
                        placeContent: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <label>Total Marks</label>
                      <Typography variant='h5' color='inherit' pt={2}>
                        {!!marksDetails?.totalmarks ? marksDetails?.totalmarks : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Fragment>
          ) : (
            <Typography> No Marks Details</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 8, justifyContent: 'center' }}>
          <Button variant='outlined' color='primary' onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RmatDetailDialog
