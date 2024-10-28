// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import { ProgramNameField } from 'src/styles/style'
import { useForm } from 'react-hook-form'
import AlertBox from 'src/layouts/components/Alert'
import { SchoolOutline } from 'mdi-material-ui'
import { getSelectedEnrollStudent } from 'src/utils'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { errorToast, successToast } from 'src/components/Toast'
import { messages } from 'src/context/common'
import { IGraduatePayloadTypes } from 'src/context/types'
import { DashboardService } from 'src/service'
import { GridRowId } from '@mui/x-data-grid'
import { IRecordsType } from 'src/types/apps/dataTypes'

type props = {
  academicYear: number
  programName: string
  selectedRows: GridRowId[]
  data: IRecordsType[]
}

const DialogGraduateStudent = ({ data, selectedRows, academicYear, programName }: props) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [selectedStudents, setSelectedStudents] = useState<IDynamicObject[]>([])

  const handleClickOpen = () => {
    setOpen(true)
    const selectedData = getSelectedEnrollStudent(selectedRows, data)
    setSelectedStudents(selectedData)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const { handleSubmit, reset } = useForm()

  const graduateStudent = async (payload: IGraduatePayloadTypes) => {
    const result = await DashboardService.editGraduateStudent(payload)
    if (result) {
      successToast('The selected student graduated successfully.')
      handleClose()
    } else {
      errorToast(messages.error)
    }
  }

  const onSubmit = () => {
    reset({}, { keepValues: true })
    const payload = {
      studentCode: selectedStudents?.map(item => item?.lead?.studentCode)
    }
    graduateStudent(payload)
    setOpen(false)
  }

  const customTitle = (
    <Box display={'flex'} justifyContent={'space-between'}>
      <Box>
        <Typography style={{ fontSize: '15px', color: '#e3a326' }}>
          Please double-check the selected <strong>academic year</strong>, <strong>qualification name</strong> and
          <strong>student details</strong>. You cant undo the changes once the student has graduated.
        </Typography>

        <Typography></Typography>
      </Box>
    </Box>
  )

  return (
    <Fragment>
      <Box>
        <Button
          fullWidth
          onClick={handleClickOpen}
          variant='contained'
          startIcon={<SchoolOutline />}
          disabled={!selectedRows.length}
        >
          Graduate Student
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title' sx={{ display: 'flex', justifyContent: 'center' }}>
          Graduate Student
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <ProgramNameField container spacing={7} mb={8} ml={0} pb={8}>
              <Grid item xs={4} display='grid'>
                <label>Academic Year</label>
                <Typography color={theme => theme.palette.common.white}>{academicYear}</Typography>
              </Grid>
              <Grid item xs={4} display='grid'>
                <label>Qualification Name</label>
                <Typography color={theme => theme.palette.common.white}>{programName}</Typography>
              </Grid>
              <Grid item xs={4} display='grid'>
                <label>No of Student Selected</label>
                <Typography color={theme => theme.palette.common.white}>{selectedRows?.length}</Typography>
              </Grid>
            </ProgramNameField>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Grid item xs={10}>
                <AlertBox
                  sx={{ mb: 6 }}
                  color='warning'
                  variant={'filled ' as any}
                  message={customTitle as unknown as string}
                  severity='warning'
                />
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit'>
              Graduate
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default DialogGraduateStudent
