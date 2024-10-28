// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import FileDocumentEdit from 'mdi-material-ui/FileDocumentEdit'

// import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Controller, useForm } from 'react-hook-form'

// ** Icons Imports
// import Close from 'mdi-material-ui/Close'

import { Autocomplete, TextField } from '@mui/material'
import { DashboardService } from 'src/service'
import { IListOfCommonTypes } from 'src/types/apps/dataTypes'
import { successToast } from 'src/components/Toast'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

interface Ieducational {
  studentData: any
  getStudentDetailById: any
  listOf: IListOfCommonTypes
}

const EditEductionDetail = ({ studentData, getStudentDetailById, listOf }: Ieducational) => {
  const { handleSubmit, control, reset } = useForm()
  const [show, setShow] = useState(false)

  const onSubmit = async (data: any) => {
    const payload = {
      highestQualification: data?.highestQualification,
      highestQualificationCompletedYear: data?.highestQualificationCompletedYear
    }

    const response = await DashboardService.addUpdateStudentEducationInfo(payload, studentData?.code)

    if (response?.code) {
      getStudentDetailById(studentData?.id)

      successToast(`Student Education Info updated successfully`)
    }
    reset()
    setShow(false)
  }
  const onClose = () => {
    setShow(false)
  }

  useEffect(() => {
    !!studentData &&
      reset({
        highestQualification: studentData?.highestQualification,
        highestQualificationCompletedYear: studentData?.highestQualificationCompletedYear
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData])

  return (
    <Grid>
      <Box display='block'>
        <Button size='small' startIcon={<FileDocumentEdit />} variant='contained' onClick={() => setShow(true)}>
          Edit Details
        </Button>
      </Box>
      <Dialog
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && onClose()
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Education
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <ControlledAutocomplete
                  control={control}
                  name='highestQualification'
                  options={listOf?.highestQualification ?? []}
                  renderInput={params => <TextField {...params} label='Higher Qualification' />}
                />
              </Grid>

              <Grid item sm={12} xs={12}>
                <Controller
                  name='highestQualificationCompletedYear'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={listOf?.year ?? []}
                      onChange={(e, data) => field.onChange(data)}
                      renderInput={params => <TextField {...params} label='Completed year' />}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}
export default EditEductionDetail
