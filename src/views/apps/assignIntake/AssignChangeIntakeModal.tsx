import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import AlertBox from 'src/layouts/components/Alert'
import { IIntakeData, IProgramList, IUpComingIntake } from 'src/types/apps/invoiceTypes'
import { getName } from 'src/utils'

interface IStudentDetail {
  label: string
  value: string | number | null | undefined
}
interface IProps {
  showAssignChangeDialogue: boolean
  setShowAssignChangeDialogue: () => void
  selectedRows: IIntakeData
  intakeProgramLists: IUpComingIntake[]
  assignIntake: (arg0: string) => void
  programList: IProgramList[]
}
const StudentDetailsIndividual = ({ label, value }: IStudentDetail) => {
  return (
    <Grid item xs={12} sm={4}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
          {label}
        </Typography>
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
          {value}
        </Typography>
      </Box>
    </Grid>
  )
}

const AssignChangeIntakeModal = ({
  showAssignChangeDialogue,
  setShowAssignChangeDialogue,
  selectedRows,
  intakeProgramLists,
  assignIntake,
  programList
}: IProps) => {
  const [intake, setIntake] = useState<any>()
  const handleChange = (event: SelectChangeEvent<string> | any, data: any) => {
    setIntake(data)
  }
  useEffect(() => {
    if (selectedRows?.enrolment?.intake?.code) {
      setIntake(
        intakeProgramLists?.filter(item => {
          return item?.code == selectedRows?.enrolment?.intake?.code
        })
      )
    } else {
      setIntake(null)
    }
  }, [selectedRows, intakeProgramLists])

  return (
    <Dialog
      open={showAssignChangeDialogue}
      maxWidth={'md'}
      fullWidth={true}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        reason != 'backdropClick' && setShowAssignChangeDialogue
      }}
    >
      <DialogTitle align='center'>
        {selectedRows?.enrolment?.intake?.code ? 'Change Intake' : 'Assign Intake'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Box mb={10}>
            <Card sx={{ position: 'relative', backgroundColor: 'primary.dark' }}>
              <CardContent>
                <Grid container mb={3} mt={0} spacing={6}>
                  <StudentDetailsIndividual
                    label='Student Id'
                    value={selectedRows?.lead?.studentCode === null ? '-' : selectedRows?.lead?.studentCode}
                  />
                  <StudentDetailsIndividual
                    label='Student Name'
                    value={`${selectedRows?.lead?.firstName === null ? '-' : selectedRows?.lead?.firstName} ${
                      selectedRows?.lead?.lastName === null ? '-' : selectedRows?.lead?.lastName
                    }`}
                  />
                  <StudentDetailsIndividual
                    label='Qualification Name'
                    value={`${getName(programList, selectedRows?.education?.programCode)}(${
                      selectedRows?.education?.programCode
                    })`}
                  />
                  <StudentDetailsIndividual
                    label='Academic Year'
                    value={
                      selectedRows?.enrolment?.intakeAcademicYear === null
                        ? '-'
                        : (selectedRows?.enrolment?.intakeAcademicYear ?? '-')
                    }
                  />
                  <StudentDetailsIndividual
                    label='Study Mode'
                    value={
                      selectedRows?.education?.studyModeCode === null ? '-' : selectedRows?.education?.studyModeCode
                    }
                  />
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {intakeProgramLists?.length ? (
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={intakeProgramLists ?? []}
                renderOption={(props, option: any) => <li {...props}>{option?.name}</li>}
                value={intake?.length == 1 ? intake && intake[0] : intake}
                onChange={(e, data) => handleChange(e, data)}
                getOptionLabel={(option: any) => {
                  return option?.name ?? ''
                }}
                renderInput={params => {
                  return <TextField {...params} label='Select Intake' value={intake} />
                }}
              />
            </FormControl>
          ) : (
            <AlertBox
              sx={{ mb: 6 }}
              color='warning'
              variant={'filled ' as any}
              message={`There is no intake created for the program ${getName(
                programList,
                selectedRows?.education?.programCode
              )}`}
              severity='warning'
            />
          )}
        </DialogContentText>
        <Box mt={5}>
          {selectedRows?.intakeCode && intake !== selectedRows?.intakeCode ? (
            <Alert severity='warning'>
              <AlertTitle>Unsaved Changes</AlertTitle>
              You have made changes Do you want to save or discord them ?
            </Alert>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
        <Button variant='outlined' onClick={setShowAssignChangeDialogue}>
          CANCEL
        </Button>
        <Button
          disabled={!intake || selectedRows?.enrolment?.intake?.code === intake?.code}
          variant='contained'
          onClick={() => assignIntake(intake)}
        >
          {selectedRows?.enrolment?.intakeCode ? 'Change Intake' : 'ASSIGN INTAKE'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignChangeIntakeModal
