// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { errorToast, successToast } from 'src/components/Toast'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { Tooltip, styled, Card, RadioGroup, FormControlLabel, Radio, Backdrop, CircularProgress } from '@mui/material'

import { PencilOutline } from 'mdi-material-ui'
import { DashboardService } from 'src/service'
import { dataMessages, status } from 'src/context/common'
import { DDMMYYYDateFormat } from 'src/utils'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const EligibilityCriteriaDialog = ({ studentData, getData }: any) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [loadingStates, setLoadingStates] = useState<boolean>(false)

  const DarkCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.grey[400],
    padding: 15
  }))

  const { watch, handleSubmit, reset, control } = useForm()
  const NQFLevelWatch = watch('NQFLevel')
  const marksWatch = watch('marks')
  const onSubmit = async (data: FieldValues) => {
    const payload = {
      highestNqfLabel: Number(data?.NQFLevel),
      marks: Number(NQFLevelWatch) == 8 ? 0 : Number(data?.marks),
      accessProgram:
        (Number(NQFLevelWatch) == 9 && Number(marksWatch) < 65) || Number(NQFLevelWatch) == 8 ? true : false,
      applicationCode: studentData?.application?.applicationCode
    }
    const res = studentData?.application?.eligibility
      ? await DashboardService.updateEnrolmentEligibility(payload)
      : await DashboardService.createEnrolmentEligibility(payload)
    setLoadingStates(true)

    if (res?.status == status?.successCode || res?.status == status?.successCodeOne) {
      getData()
      successToast(dataMessages?.success)
      setLoadingStates(false)
    } else {
      errorToast(dataMessages?.error)
      setLoadingStates(false)
    }
    setShow(false)
  }

  const handleOpen = () => {
    reset({
      NQFLevel: String(studentData?.application?.eligibility?.highestNqfLabel) || '',
      marks: studentData?.application?.eligibility?.marks || ''
    })
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
  }

  return (
    <Grid>
      <Box display='flex' justifyContent='flex-end'>
        <Tooltip title={`Edit Address`}>
          <Box>
            <IconButton
              onClick={handleOpen}
              size='small'
              component='a'
              color='primary'
              sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
              disabled={
                studentData?.application?.status == 'APP-ENROLLED' ||
                studentData?.application?.status == 'ENRL-ACCEPTED'
              }
            >
              <PencilOutline />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setShow(false)
          }
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {loadingStates ? (
            <Backdrop
              open={loadingStates}
              sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }}
            >
              <CircularProgress color='inherit' />
            </Backdrop>
          ) : (
            <DialogContent sx={{ pb: 6, px: { xs: 6, sm: 12 }, pt: { xs: 5, sm: 10.5 }, position: 'relative' }}>
              <IconButton
                size='small'
                onClick={() => setShow(false)}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Close />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Eligibility Criteria Check
                </Typography>
              </Box>
              <Grid>
                <DarkCard>
                  <Grid container spacing={5}>
                    <Grid item xs={4}>
                      <label>Student ID </label>
                      <Typography sx={{ color: 'white' }} variant='h6'>
                        {studentData?.application?.lead?.studentCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>Name</label>
                      <Typography sx={{ color: 'white' }} variant='h6'>
                        {`${studentData?.application?.lead?.firstName} ${studentData?.application?.lead?.middleName} ${studentData?.application?.lead?.lastName}`}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <label>Contact Details</label>
                      <Typography sx={{ color: 'white' }} variant='h6'>
                        {studentData?.application?.lead?.email}
                      </Typography>
                      <Typography sx={{ color: 'white' }} variant='h6'>
                        {`+${studentData?.application?.lead?.mobileCountryCode}${studentData?.application?.lead?.mobileNumber}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>Date of Birth</label>
                      <Typography sx={{ color: 'white' }} variant='h6'>
                        {DDMMYYYDateFormat(studentData?.application?.lead?.dateOfBirth)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>Highest Qulaification</label>
                      <Typography
                        sx={{ color: 'white' }}
                        variant='h6'
                      >{`${studentData?.application?.education?.programCode}-${studentData?.application?.education?.programName}`}</Typography>
                    </Grid>
                  </Grid>
                </DarkCard>
              </Grid>
              <Box sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant='h6'>MBA Academic Details</Typography>
              </Box>

              <Grid container columnGap={17} sx={{ mt: 10, mb: 15 }}>
                <Grid item xs={4}>
                  <label>NQF Level</label>
                  <Controller
                    name='NQFLevel'
                    control={control}
                    rules={{ required: true }}
                    defaultValue={studentData?.application?.eligibility?.highestNqfLabel || ''}
                    render={({ field }) => {
                      return (
                        <RadioGroup {...field}>
                          <Grid container sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                              <FormControlLabel value='9' control={<Radio />} label='NQF Level-9 ' />
                            </Grid>
                            <Grid item xs={6}>
                              <FormControlLabel value='8' control={<Radio />} label='NQF Level-8' />
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      )
                    }}
                  />
                </Grid>
                {NQFLevelWatch != 8 && (
                  <Grid item xs={2}>
                    <label>% of Marks</label>
                    <Controller
                      rules={{ required: watch('NQFLevel') == '9' ? true : false }}
                      name='marks'
                      control={control}
                      defaultValue={studentData?.application?.eligibility?.marks || ''}
                      render={({ field }) => <TextField fullWidth type='number' sx={{ mt: 2 }} {...field} />}
                    />
                  </Grid>
                )}

                <Grid item xs={4} sx={{ borderLeft: `5px solid ${'green'}`, pl: 3 }}>
                  <label>Access Program Required?</label>
                  <Typography variant='h5' sx={{ mt: 2 }}>
                    {(Number(NQFLevelWatch) == 9 && Number(marksWatch) < 65) || Number(NQFLevelWatch) == 8
                      ? 'Yes'
                      : 'No'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
          )}

          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ mr: 2 }}
              type='submit'
              disabled={NQFLevelWatch == 'undefined' || !NQFLevelWatch}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default EligibilityCriteriaDialog
