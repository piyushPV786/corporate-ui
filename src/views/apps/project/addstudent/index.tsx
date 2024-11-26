// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { FieldValues, useForm } from 'react-hook-form'
import CardContent from '@mui/material/CardContent'
import 'react-phone-input-2/lib/material.css'
import { NationalAddressDetail } from './nationalAddress'
import _ from 'lodash'
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { errorToast, successToast } from 'src/components/Toast'
import { AddStudent, AddStudentMessages, messages, status } from 'src/context/common'
import { IAddProjectstudentType, IProjectStudentDTOTypes } from 'src/context/types'
import { EducationalDetail } from './educationalDetail'
import { PersonalInformationDetail } from './personalnformation'
import { DashboardService } from 'src/service'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { schema } from './schema'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { formatDateYMD } from 'src/utils'

const intialState = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  mobileCountryCode: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  race: '',
  ifOtherSpecifyRace: '',
  homeLanguage: '',
  homeLanguageSpecified: '',
  street: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  addressType: 'POSTAL',
  highestQualification: '',
  highSchoolName: '',
  isInternationalDegree: ''
}

interface IstudentPreview {
  projectCode: string
}

const AddStudentPreview = ({ projectCode }: IstudentPreview) => {
  const router: any = useRouter()
  const studentCode = router.query.studentId
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isMobileValid, setIsMobileValid] = useState('')
  const [studentDetails, setStudentDetails] = useState<IProjectStudentDTOTypes>()

  const {
    control,
    register,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  })

  const projectStudent = async (payload: IAddProjectstudentType) => {
    const AddResponse = await DashboardService?.addProjectStudent(payload)
    if (AddResponse?.status === status.successCodeOne) {
      successToast(`${payload.lead.firstName} ${payload.lead.lastName} Submitted Sucessfully`)
      router.push(`${AddStudent.BackToList}${projectCode}`)

      return AddResponse
    }
  }

  // const projectDraft = async (payload: IAddstudentDraftType) => {
  //   const AddDraftresponse = await DashboardService?.addProjectStudentDraft(payload)
  //   if (AddDraftresponse?.status === status.successCodeOne) {
  //     successToast(AddStudentMessages.sucessDraftMsg)

  //     router.push(`${AddStudent.BackToList}${projectCode}`)

  //     return AddDraftresponse.data.data.code
  //   }
  // }
  const enrollProjectStudentDraft = async (payload: IAddProjectstudentType, code: string) => {
    const enrollDraftResponse = await DashboardService?.enrollProjectStudentDraft(payload, code)
    if (status.successCodeArr.includes(enrollDraftResponse?.statusCode)) {
      successToast(AddStudentMessages.enrollDraftMsg)
      router.push(`${AddStudent.BackToList}${projectCode}`)
    } else {
      errorToast(messages.error)
    }
  }

  // const handleEdit = async (payload: IAddstudentDraftType, code: string) => {
  //   const EditResponse = await DashboardService?.editProjectDraft(payload, code)
  //   if (EditResponse?.status === status.successCode) {
  //     successToast(AddStudentMessages.editMsg)
  //     router.push(`${AddStudent.BackToList}${projectCode}`)
  //     getProjectStudentByIdDetails()
  //   }
  // }

  const getProjectStudentByIdDetails = async () => {
    const projectStudentData = await DashboardService?.getProjectStudentById(studentCode)
    if (projectStudentData?.status === status.successCode) {
      const tempObject: IDynamicObject = {}
      for (const key in intialState) {
        tempObject[key] = projectStudentData?.data?.data[key]
      }
      const {
        contactNumberCountryCode,
        contactNumber,
        alternativeContactCountryCode,
        alternativeContact,
        whatsappNumberCountryCode,
        whatsappNumber
      } = projectStudentData?.data?.data

      const dataObject = {
        ...tempObject,
        contactNumber:
          !!contactNumberCountryCode && !!contactNumber ? `${contactNumberCountryCode}${contactNumber}` : '',
        alternativeContact:
          !!alternativeContactCountryCode && !!alternativeContact
            ? `${alternativeContactCountryCode}${alternativeContact}`
            : '',
        whatsappNumber:
          !!whatsappNumberCountryCode && !!whatsappNumber ? `${whatsappNumberCountryCode}${whatsappNumber}` : ''
      }

      reset(dataObject)
      setIsLoading(false)
      setStudentDetails(projectStudentData?.data?.data)
    }
  }

  const createStudentPayload = (data: any) => {
    const leadPayload = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber.slice(data.mobileNumberCountryCode.length),
      mobileCountryCode: data.mobileNumberCountryCode,
      dateOfBirth: data.dateOfBirth ? formatDateYMD(data.dateOfBirth) : '',
      nationalityStatus: data.nationalityStatus,
      permenantResident: data.permanentResident,
      identificationNumber: data.identificationNumber,
      identificationDocumentType: data.identificationDocumentType,
      gender: data.gender,
      nationality: data.nationality,
      language: data.homeLanguage,
      race: data.race,
      isAgreedTermsAndConditions: true,
      passportExpiryDate: data.passportExpiryDate ? formatDateYMD(data.passportExpiryDate) : ''
    }

    const addressPayload = {
      street: data.postalAddress,
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipCode,
      addressType: 'POSTAL'
    }

    const educationPayload = {
      qualificationCode: data.highestQualification,
      agentCode: null,
      highSchoolName: data.highSchoolName,
      studentTypeCode: 'CORPORATE',
      referredById: null,
      isInternationDegree: data.isInternationalDegreeHolder
    }

    return {
      projectCode: projectCode,
      lead: _.omitBy(leadPayload, value => _.isNil(value) || value === ''),
      address: _.omitBy(addressPayload, value => _.isNil(value) || value === ''),
      education: _.omitBy(educationPayload, value => _.isNil(value) || value === '')
    }
  }

  const onSubmit = async (data: FieldValues) => {
    reset({}, { keepValues: true })
    const payload = createStudentPayload(data)
    if (!!studentDetails?.code) {
      await enrollProjectStudentDraft(payload as any, studentDetails?.code)
    } else {
      await projectStudent(payload as any)
    }
  }

  // const handleSubmitDraft = async () => {
  //   const Data: any = watch()
  //   reset({}, { keepValues: true })

  //   const payload = createStudentPayload(Data)

  //   if (!!studentCode) {
  //     await handleEdit(payload as any, Data.code)
  //   } else {
  //     const code = await projectDraft(payload as any)
  //     !!code &&
  //       documentPayloadList.map(async item => {
  //         const docResponse: IProjectStudentDocument | undefined = await uploadFile(item, code)
  //         if (docResponse?.response) {
  //           successToast('Documents are Uploaded')
  //         } else {
  //           docResponse?.documentCode && deleteDocument(code, docResponse.documentCode)
  //         }
  //       })
  //   }

  //   reset()
  // }

  useEffect(() => {
    if (studentCode) {
      getProjectStudentByIdDetails()
    } else {
      reset(intialState)
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isLoading ? (
    <Box>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box>
              <Typography variant='h5' gutterBottom>
                Add Student
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  '& .breadcrumb': {
                    color: theme => theme.palette.primary.main
                  }
                }}
              >
                <span className='breadcrumb'>Dashboard /Project Management</span> / Add Student
              </Typography>
            </Box>
          </Grid>
          <Grid item md={9} xs={12}>
            <Grid container rowSpacing={5}>
              <PersonalInformationDetail
                errors={errors}
                register={register}
                watch={watch}
                clearErrors={clearErrors}
                setValue={setValue}
                isMobileValid={isMobileValid}
                setIsMobileValid={setIsMobileValid}
                control={control}
              />
              {/* <ContactDetail register={register} control={control} errors={errors} setValue={setValue} watch={watch} /> */}

              <NationalAddressDetail
                control={control}
                errors={errors}
                watch={watch}
                setValue={setValue}
                register={register}
                clearErrors={clearErrors}
              />

              <EducationalDetail
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
                clearErrors={clearErrors}
              />
            </Grid>
          </Grid>
          <Grid item md={3} xs={12}>
            <Box className='sticky-sidebar'>
              <Card>
                <CardContent>
                  <Link href={`${AddStudent.BackToList}${projectCode}?tab=students`} passHref>
                    <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
                      Back to List
                    </Button>
                  </Link>

                  {/* <Button
                    fullWidth
                    component='a'
                    onClick={handleSubmitDraft}
                    sx={{ mb: 3.5 }}
                    variant='outlined'
                    disabled={!isDirty || isDraftButtonDisabled}
                  >
                    Save As Draft
                  </Button> */}

                  <Button
                    fullWidth
                    variant='contained'
                    type='submit'
                    disabled={(!isDirty || !isValid) && isMobileValid.length > 0}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default AddStudentPreview
