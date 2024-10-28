// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Components and Services
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { ProgramNameField } from 'src/styles/style'

// Typescript Interface
import { IStudyModeCodeTypes } from 'src/types/apps/dataTypes'

// ** Third Party Library
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IStudentPreviewDataTypes } from 'src/types/apps/common'
import { AcademicService, ApplyService } from 'src/service'
import { status } from 'src/context/common'
import { errorToast, successToast } from 'src/components/Toast'
import { useAuth } from 'src/hooks/useAuth'
import { DateFormat } from 'src/utils'

interface IStudentTypeDialogPropsType {
  data: IStudentPreviewDataTypes
  appCode: any[]
  getEnrolmentDetailById: () => void
}

const schema = yup.object().shape({
  studentType: yup.string().required()
})

const EnrollmentNewProgramDialouge = ({ data, appCode, getEnrolmentDetailById }: IStudentTypeDialogPropsType) => {
  const { application } = data
  const { education } = application
  const auth = useAuth()
  const agentCode = auth?.user?.code

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [programList, setProgramList] = useState<any[]>([])
  const [studyModeList, setStudyModeList] = useState<IStudyModeCodeTypes[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      studentType: '',
      studyMode: ''
    }
  })

  const handleOpen = () => {
    getProgramList()
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
    setStudyModeList([])
    setLoading(false)
  }

  // Get program list
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && !!response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  // Get study mode as per selected program
  const getProgramListByStudyMode = async (code: number | string) => {
    setLoading(true)
    const response = await AcademicService?.getProgramListByCode(code)
    setStudyModeList(response[0]?.studyModes)
    if (!!response?.length) {
      setLoading(false)
    }
  }

  const FilteredProg = programList?.filter(
    (i: { code: string }) => !appCode?.map(ie => ie?.education?.programCode)?.includes(i?.code)
  )

  // post new program
  const onSubmit = async () => {
    setLoading(true)
    const selectedProgram = programList.find(program => program.code === watch('studentType'))
    const selectedProgramName = selectedProgram ? selectedProgram.name : ''
    const newProgramPayload = {
      studentCode: application?.lead?.studentCode,
      education: {
        programCode: watch('studentType'),
        programName: selectedProgramName,
        studyModeCode: watch('studyMode'),
        qualificationCode: education.qualificationCode,
        socialMediaCode: education.socialMediaCode,
        applicationFees: null,
        programFees: education.programFees,
        programMode: education.programMode,
        agentCode: agentCode,
        highSchoolName: education.highSchoolName,
        studentTypeCode: education.studentTypeCode,
        referredById: null,
        isInternationDegree: education.isInternationDegree,
        bursaryName: education.bursaryName,
        bursaryId: education.bursaryId
      }
    }
    const newProgramResponse = await ApplyService?.updateNewProgram(newProgramPayload)

    if (newProgramResponse?.statusCode === 201) {
      setLoading(false)
      successToast(`${application?.lead?.studentCode}  application created successfully in ${selectedProgramName}`)
      handleClose()
    } else {
      // setLoading(false)
      errorToast(`${application?.lead?.studentCode}  application not created successfully`)
    }
    getEnrolmentDetailById()

    // setLoading(false)
  }

  useEffect(() => {
    if (!!studyModeList?.length) {
      setValue('studyMode', studyModeList[0].studyModeCode, { shouldValidate: true })
    }
  }, [studyModeList, setValue])
  useEffect(() => {
    const code = watch('studentType')
    watch('studentType') && getProgramListByStudyMode(code)
  }, [watch('studentType')])

  // const onSubmit = (data: FieldValues) => {
  //   newProgramHandler()
  //   // reset({}, { keepValues: true })
  //   // handleClose()
  // }

  return (
    <Fragment>
      <Tooltip title={'Enrooll new program'}>
        <Button
          fullWidth
          sx={{ textWrap: 'nowrap', fontSize: '12px' }}
          onClick={handleOpen}
          variant='contained'

          // disabled={!isChangeStudentStatus.includes(studentData?.admission?.status)}
        >
          {`Enroll to new program`}
        </Button>
      </Tooltip>

      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='assign-student-type'
      >
        <DialogTitle id='assign-student-type' textAlign='center'>
          {`Enroll to New Qualification`}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
              <CircularProgress color='primary' />
            </Backdrop>
            <Grid container rowSpacing={10} mb={5}>
              <Grid item xs={12}>
                <ProgramNameField container p={5} rowSpacing={5}>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      Student ID
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <span>{application?.lead?.studentCode}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      Name
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <span>{`${application?.lead?.firstName} ${application?.lead?.lastName}`}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      Contact Details
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <Stack spacing={0}>
                        <span>{`${application?.lead?.email}`}</span>
                        <span>{`+ ${application?.lead?.mobileCountryCode} ${application?.lead?.mobileNumber}`}</span>
                      </Stack>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      Date of Birth
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <span>
                        {application?.lead?.dateOfBirth
                          ? `${DateFormat(new Date(application?.lead?.dateOfBirth))}`
                          : `-`}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      Nationality
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <span>{`${application?.lead?.nationality}`}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                    <Typography variant='body2' color='common.white'>
                      National ID
                    </Typography>
                    <Typography variant='body2' color='common.white'>
                      <span>{application?.lead?.identificationNumber}</span>
                    </Typography>
                  </Grid>
                </ProgramNameField>
              </Grid>

              <Grid item xs={12} bgcolor={'#f5f5f5'} sx={{ mt: 3, px: 4, py: 5 }}>
                <Stack
                  sx={{ mb: 5, mt: -7 }}
                  direction='column'
                  justifyContent='center'
                  alignItems='center'
                  spacing={2}
                >
                  <Typography alignContent={'center'} variant='subtitle1'>
                    {`Qualification Details`}{' '}
                  </Typography>
                </Stack>
                <Stack direction={'row'} spacing={4}>
                  {FilteredProg && (
                    <>
                      <Grid item xs={6}>
                        <ControlledAutocomplete
                          name='studentType'
                          control={control}
                          options={FilteredProg}
                          renderInput={params => (
                            <TextField
                              {...params}
                              fullWidth
                              label='Interested Qualification'
                              error={!!errors?.studentType}
                              helperText={errors?.studentType?.message as string | undefined}
                            />
                          )}
                        />
                      </Grid>
                      {!!studyModeList?.length && (
                        <Grid item xs={6}>
                          <FormControl>
                            <FormLabel id='demo-radio-buttons-group-label'>Study Mode</FormLabel>
                            <Controller
                              name='studyMode'
                              control={control}
                              render={({ field }) => (
                                <RadioGroup {...field} row aria-labelledby='demo-radio-buttons-group-label'>
                                  {studyModeList &&
                                    studyModeList?.map(item => {
                                      return (
                                        <>
                                          <FormControlLabel
                                            value={item?.studyModeCode}
                                            control={<Radio />}
                                            label={item?.studyModeCode}
                                          />
                                        </>
                                      )
                                    })}
                                </RadioGroup>
                              )}
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={!isDirty || !!errors?.studentType}>
              {`Enroll`}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default EnrollmentNewProgramDialouge
