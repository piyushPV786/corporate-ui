// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { CourseParams, IAllProgramApiTypes, IResultDetailsTypes, commonListTypes } from 'src/types/apps/dataTypes'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Popper, TextField, Tooltip } from '@mui/material'
import AlertBox from 'src/layouts/components/Alert'
import { PencilOutline } from 'mdi-material-ui'
import { getName } from 'src/utils'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { StudyModeType } from 'src/context/common'
import { PopperChildrenProps } from 'react-popper'

const PopperMy = (props: any) => {
  return (
    <Popper
      {...props}
      open={true} // or props.open if dynamic
      sx={{ maxHeight: 200, overflow: 'scroll', overflowX: 'hidden' }}
      placement='bottom'
    >
      {(popperProps: PopperChildrenProps) => (
        <div ref={popperProps.ref} style={popperProps.style} data-placement={popperProps.placement}>
          {/* Render your component here */}
          {props.children}
        </div>
      )}
    </Popper>
  )
}
export interface IStudenData {
  application: Application
  payment: Payment[]
  document: IDocument[]
  admission: Admission
  affordableRank: string
  creditRisk: string
}

export interface Admission {
  length: boolean
  VIPType: string
  isActive: boolean
  id: number
  enrolmentCode: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  mobileCountryCode: string
  dateOfBirth: Date
  identificationNumber: string
  applicationCode: string
  studentCode: string
  status: string
  VIPStatus: null
  VIPComment: null
  address: Address[]
  education: EducationElement[]
  document: AdmissionDocument[]
  rmat: Array<IResultDetailsTypes>
}

export interface Address {
  isActive: boolean
  id: number
  createdBy?: null
  createdAt: Date
  updatedBy?: null
  updatedAt: Date
  deletedBy?: null
  deletedAt: null
  street: string
  country: string
  state: string
  city: string
  zipcode: number
  addressType: string
}

export interface AdmissionDocument {
  isActive: boolean
  id: number

  name: string
  status: string
  documentTypeCode: string
  Comments: null
}

export interface EducationElement {
  isActive: boolean
  id: number

  programCode: string
  studyModeCode: string
  studyTypeCode: string
  studentTypeCode: string
}

export interface Application {
  isActive: boolean
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: null
  applicationCode: string
  programCode: string
  studentCode: string
  status: string
  subStatus: string
  enrolmentCode: string
  lead: Lead
  address: Address[]
  rmat: any
  enrolment: {
    enrolmentRmat: []
  }
  education: ApplicationEducation
  agent: [
    {
      name: string
      emailAddress: string
    }
  ]
  eligibility: any
}

export interface ApplicationEducation {
  isActive: boolean
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: null
  programCode: string
  studyModeCode: string
  qualificationCode: string
  socialMediaCode: string
  bursaryName: string
  programFees: null
  highSchoolName: string
  agentCode: string
  studentTypeCode: string
  isInternationDegree: boolean
}

export interface Lead {
  student: any
  isActive: boolean
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt: null
  leadCode: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  mobileNumber: string
  studentCode: string
  mobileCountryCode: string
  dateOfBirth: Date
  identificationNumber: string
  identificationDocumentType: string
  gender: string
  nationality: string
  language: string
  race: string
}

export interface IDocument {
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  id: number
  createdBy: null
  updatedBy: null
  name: string
  code: string
  filePath: null
  fileExtension: null | string
  status: string
  documentTypeCode: string
  comment: null | string
  applicationCode: string
  enrolmentCode: null
  studentCode: null
  projectCode: null
}

export interface Payment {
  isActive: boolean
  id: number

  transactionId: string
  totalAmount: string
  feeModeCode: string
  discountTypeCode: null
  discountCode: null
  discounAmount: string
  totalPaidAmount: string
  paymentStatus: string
  referenceNumber: string
  paymentType: null
  applicationCode: string
  enrolemntCode: null
  studentCode: null
  documentCode: string
  currencyCode: string
  bankName: string
  paymentDate: Date
  comments: null
}
const defaultValues = {
  qualification: '',
  program: '',
  studyMode: '',
  highSchoolName: ''
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})
const findStudyMode = (qualificationCode: string, programList: IAllProgramApiTypes[]) => {
  const selectedProgram = programList.find(program => program.code === qualificationCode)

  const programStudyModes = selectedProgram?.studyModeCodes?.split(',')?.map(studyMode => studyMode)

  return programStudyModes
}

const CourseDetails = ({
  studentData,
  userCourseDetails,
  qualificationList,
  programList,
  studyModes
}: {
  studentData: IStudenData
  userCourseDetails: (params: CourseParams, applicationCode: string) => void
  qualificationList: commonListTypes[]
  programList: IAllProgramApiTypes[]
  studyModes: commonListTypes[]
}) => {
  const educationData = studentData?.application?.education
  const [show, setShow] = useState<boolean>(false)
  const [filteredStudyModes, setFilteredStudyModes] = useState<Array<string> | undefined>()
  const studyModeList = studyModes.filter(item => filteredStudyModes?.includes(item.code))
  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues,
    mode: 'all'
  })

  const isDataChange =
    educationData?.qualificationCode !== watch('qualification') ||
    educationData?.programCode !== watch('program') ||
    educationData?.studyModeCode !== watch('studyMode') ||
    educationData?.highSchoolName !== watch('highSchoolName')

  const onClose = () => {
    setShow(false)
    reset(defaultValues)
  }
  const onSubmit = async (data: any) => {
    reset({}, { keepValues: true })
    const params: CourseParams = {
      programCode: data?.program,
      studyModeCode: data?.studyMode,
      qualificationCode: data?.qualification,
      isInternationDegree: educationData?.isInternationDegree,
      highSchoolName: data?.highSchoolName,
      programName: getName(programList, data?.program)
    }

    userCourseDetails(params, studentData?.application?.applicationCode)
    setShow(false)
    reset(defaultValues)
  }

  const openCourseDialog = async () => {
    await setFilteredStudyModes(findStudyMode(educationData?.programCode, programList))
    reset({
      qualification: educationData?.qualificationCode,
      program: educationData?.programCode,
      studyMode: educationData?.studyModeCode,
      highSchoolName: educationData?.highSchoolName
    })
    setShow(true)
  }
  const handleStudyModes = (qualificationCode: string) => {
    console.log('findStudyMode(qualificationCode, programList))', findStudyMode(qualificationCode, programList))
    setFilteredStudyModes(findStudyMode(qualificationCode, programList))
    studyModeList.length === 0 && setValue('studyMode', '')
  }

  useEffect(() => {
    !!watch('program') ? handleStudyModes(watch('program')) : setFilteredStudyModes([])
  }, [watch('program')])

  return !!studentData ? (
    <Grid>
      <Box display='block'>
        <Tooltip title='Edit Education and Qualification Details'>
          <Box>
            <IconButton
              onClick={openCourseDialog}
              size='small'
              component='a'
              color='primary'
              sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
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
            onClose()
          }
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={onClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Close />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Education and Qualification Details
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={8}>
                <ControlledAutocomplete
                  name='program'
                  control={control}
                  options={programList}
                  rules={{ required: 'Qualification is required' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Qualification'
                      helperText={errors?.program?.message as string | undefined}
                      error={Boolean(errors?.program as any)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledAutocomplete
                  fullWidth
                  name='studyMode'
                  control={control}
                  options={studyModeList}
                  rules={{ required: 'Study Mode is required' }}
                  groupBy={option => (option.code == StudyModeType.Online ? 'Online -' : ' Contact -')}
                  PopperComponent={PopperMy}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Study Mode'
                      helperText={errors?.studyMode?.message as string | undefined}
                      error={Boolean(errors?.studyMode as any)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={8}>
                {qualificationList && (
                  <ControlledAutocomplete
                    name='qualification'
                    control={control}
                    rules={{ required: 'Qualification is required' }}
                    options={qualificationList}
                    renderInput={params => {
                      return (
                        <TextField
                          {...params}
                          label='Highest Qualification'
                          helperText={errors.qualification?.message as string | undefined}
                          error={Boolean(errors.qualification)}
                        />
                      )
                    }}
                  />
                )}
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='highSchoolName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='High School Name'
                      error={!!errors.highSchoolName}
                      helperText={errors.highSchoolName && (errors.highSchoolName?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={8} xs={12}>
                <InputLabel>Are you an international degree holder? </InputLabel>
                <Typography variant='h6'>{educationData?.isInternationDegree ? 'Yes' : 'No'}</Typography>
              </Grid>
            </Grid>
            {isDataChange ? (
              <AlertBox
                sx={{ mb: 6 }}
                color='warning'
                variant={'filled ' as any}
                header='Unsaved Changes'
                message='You have made changes. Do you want to save or cancel them?'
                severity='warning'
              />
            ) : null}
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit' disabled={!isDataChange}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  ) : (
    <div>no data found</div>
  )
}

export default CourseDetails
