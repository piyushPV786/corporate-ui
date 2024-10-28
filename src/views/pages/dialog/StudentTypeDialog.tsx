// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@mui/material'

// ** Custom Components and Services
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { ProgramNameField } from 'src/styles/style'
import { getName } from 'src/utils'

// Typescript Interface
import { commonListTypes } from 'src/types/apps/dataTypes'
import { IStudentAggregatorTypes } from 'src/types/apps/aggregatorTypes'

// ** Third Party Library
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { studentTypeActions } from 'src/context/common'

interface IStudentTypeDialogPropsType {
  studentTypeList: commonListTypes[]
  studyModeList: commonListTypes[]
  programList: commonListTypes[]
  studentData: IStudentAggregatorTypes
  updateStudentType: (studentType: string) => void
}

const schema = yup.object().shape({
  studentType: yup.string().required()
})

const StudentTypeDialog = ({
  studentTypeList,
  studentData,
  programList,
  studyModeList,
  updateStudentType
}: IStudentTypeDialogPropsType) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const studentType = studentData?.application?.education?.studentTypeCode ?? ''
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
    defaultValues: { studentType: studentType }
  })

  const handleOpen = () => {
    reset({ studentType: studentType })
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const getStudyModeName = () => {
    const studyModeCode = studentData?.application?.education?.studyModeCode

    return studyModeCode ? getName(studyModeList, studyModeCode) : '-'
  }
  const onSubmit = (data: FieldValues) => {
    reset({}, { keepValues: true })
    updateStudentType(data.studentType)
    handleClose()
  }
  useEffect(() => {
    reset({ studentType: studentType })
  }, [])

  return (
    <Fragment>
      <Box>
        <Button onClick={handleOpen} variant='outlined'>
          {`${!!studentType ? 'Change' : 'Assign'} Student Type`}
        </Button>
      </Box>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='assign-student-type'
      >
        <DialogTitle id='assign-student-type' textAlign='center'>
          {`${!!studentType ? 'Change' : 'Assign'} Student Type`}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container rowSpacing={10} mb={5}>
              <Grid item xs={12}>
                <ProgramNameField container p={5} rowSpacing={5}>
                  <Grid item xs={6}>
                    <Typography variant='body2' color='common.white'>
                      Application ID
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{studentData?.application?.applicationCode}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2' color='common.white'>
                      Student Name
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{`${studentData?.application?.lead?.firstName} ${studentData?.application?.lead?.lastName}`}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2' color='common.white'>
                      Qualification Name
                    </Typography>
                    <Typography color='common.white'>
                      <strong>
                        {studentData?.application?.education?.programName ??
                          (studentData?.application?.education?.programCode &&
                            getName(programList, studentData?.application?.education.programCode)) ??
                          '-'}{' '}
                        - ({studentData?.application?.education?.programCode ?? '-'})
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2' color='common.white'>
                      Study Mode
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{getStudyModeName()}</strong>
                    </Typography>
                  </Grid>
                </ProgramNameField>
              </Grid>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  name='studentType'
                  control={control}
                  options={studentTypeList}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Select Student Type'
                      error={!!errors?.studentType}
                      helperText={errors?.studentType?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={!isDirty || !!errors?.studentType}>
              {studentTypeActions[watch('studentType')] ?? studentTypeActions.RETAIL}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default StudentTypeDialog
