import * as React from 'react'

// ** Next Import
import DialogForm from 'src/views/pages/dialog/DialogForm'
import Table from 'src/views/apps/roles/Table'
import { StudentService, CommonService, AcademicService, DocumentService } from 'src/service'
import { errorToast, loadingToast, successToast } from 'src/components/Toast'
import { AddressTypeData, DocumentType, allRoles, dataMessages, feeModeCode, messages } from 'src/context/common'
import { status, Address } from 'src/context/common'
import { useState, useEffect } from 'react'
import { getSelectedDocument, downloadFile, getName, DateFormat, compareDates } from 'src/utils'
import {
  StudentParams,
  commonListTypes,
  AddressParams,
  CourseParams,
  IFileTypePayload,
  DataParams
} from 'src/types/apps/dataTypes'
import DialogUserInfo from 'src/views/pages/dialog/DialogUserInfo'
import CourseDetails from 'src/views/pages/dialog/CourseDetails'
import AddressInfoUpdateDialogue from 'src/views/pages/dialog/AddressInfo'
import { LightBackground } from 'src/styles/style'

// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { GridExpandMoreIcon } from '@mui/x-data-grid/'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { CardAccountDetailsOutline, Check, Download, EarthArrowRight } from 'mdi-material-ui'
import BookEducation from 'mdi-material-ui/BookEducation'
import Account from 'mdi-material-ui/Account'
import FileDocument from 'mdi-material-ui/FileDocument'
import { CreditCardCheck, WebBox } from 'mdi-material-ui'
import CustomChip from 'src/@core/components/mui/chip'
import FallbackSpinner from 'src/@core/components/spinner'
import { IPayment } from 'src/context/types'
import { PaymentProof } from 'src/types/apps/invoiceTypes'
import { IAddressExtendedTypes } from 'src/types/apps/admittedStudent'
import { ConfirmationDialog } from 'src/components/Dialog'
import { Backdrop, CircularProgress } from '@mui/material'
import { FullPermission, ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

const isBursaryButtonDisabled = ['APP-FEE-PEND']

type Props = /*unresolved*/ any
const PreviewCard = ({ studentData, getStudentDetailById }: Props) => {
  const [selectedDocument, setSelectedDocument] = useState<any[]>([])
  const [selDocument, setSelDocument] = useState<any[]>([])
  const [qualificationList, setQualificationList] = useState<Array<commonListTypes>>([])
  const [studyModes, setStudyModes] = useState<Array<commonListTypes>>([])
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [documentInfoExpand, setDocumentInfoExpand] = useState<boolean>(true)
  const [postalInfoExpand, setPostalinfoExpand] = useState<boolean>(true)
  const [residentialInfoExpand, setResidentialinfoExpand] = useState<boolean>(true)
  const [programList, setProgramList] = useState<any[]>([])
  const [studentTypes, setStudentTypes] = useState<any>([])
  const [socialMedia, setSocialMedia] = useState<any>([])
  const [applicationInfoExpand, setApplicationInfoExpand] = useState<boolean>(true)
  const [gender, setGender] = useState<commonListTypes[]>([])
  const [race, setRace] = useState<commonListTypes[]>([])
  const [language, setLanguage] = useState<commonListTypes[]>([])
  const [nationality, setNationality] = useState<commonListTypes[]>([])
  const [nationalityStatus, setNationalityStatus] = useState<commonListTypes[]>([])
  const [country, setCountry] = useState<commonListTypes[]>([])
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const [documentTypeList, setDocumentTypeList] = useState<Array<commonListTypes>>([])
  const [isZeroBursaryDialog, setIsZeroBursaryDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  // const [agent, setAgent] = useState<any>([])

  const fullPermission = ModuleFeaturePermission(FeatureCodes.EMS.application, PermissionsCodes.full, moduleKeys.sales)

  const getQualificationData = async () => {
    const response = await CommonService.getHighestQualification()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setQualificationList(response.data.data)
    }
  }
  const getStudyModeData = async () => {
    const response = await CommonService.getStudyMode()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudyModes(response.data.data)
    }
  }

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && !!response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }
  const getSocialMediaData = async () => {
    const response = await CommonService.getSocialMedia()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setSocialMedia(response.data.data)
    }
  }

  // const getAgentData = async () => {
  //   const response = await UserManagementService.getAgents('Sales')
  //   if (!!response?.length) {
  //     setAgent(response)
  //   }
  // }

  const getCountryData = async () => {
    const response = await CommonService.getCountryLists()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setCountry(response.data.data)
    }
  }
  const getGenderDetails = async () => {
    const response = await CommonService.getGenderList()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setGender(response.data.data)
    }
  }
  const getRaceDetails = async () => {
    const response = await CommonService.getRace()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setRace(response.data.data)
    }
  }
  const getLanguage = async () => {
    const response = await CommonService.getLanguage()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setLanguage(response.data.data)
    }
  }

  const getNationalityData = async () => {
    const response = await CommonService.getNationalityList()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setNationality(response.data.data)
    }
  }
  const getNationalityStatus = async () => {
    const response = await CommonService.getNationalityStatus()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setNationalityStatus(response.data.data)
    }
  }

  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
    }
  }

  const userDetailUpdate = async (data: StudentParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateStudent(data, appCode)
    if (result?.status === 200) {
      await getStudentDetailById()
      successToast(dataMessages.success)
    } else {
      errorToast(messages.error)
    }
  }
  const userAddressUpdate = async (data: AddressParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateAddress(data, appCode)
    if (result?.status === 200) {
      await getStudentDetailById()
      successToast(dataMessages.success)
    } else {
      errorToast(messages.error)
    }
  }
  const userCourseDetails = async (data: CourseParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateCourse(data, appCode)
    if (result?.status === 200) {
      await getStudentDetailById()
      successToast(dataMessages.success)
    } else {
      errorToast(messages.error)
    }
  }
  const paymentProof = async (param: PaymentProof) => {
    const payloadStatus: Array<string> = param?.payload?.documents?.map(item => item.status)
    const result = await StudentService.paymentProofUpdate(param)
    if (result?.status === status?.successCode) {
      if (payloadStatus?.includes(status.approve)) {
        successToast(messages.approve)
        await getStudentDetailById()
      } else {
        successToast(messages.reject)
      }
    } else {
      errorToast(messages.error)
    }
    getStudentDetailById()
  }
  const documentApprove = async (status: string, comment: string) => {
    loadingToast()
    const selectedDoc = {
      appCode: studentData?.application?.applicationCode,
      payload: {
        documents: selectedDocument?.map(item => {
          const param = {
            appCode: studentData?.application?.applicationCode,
            docCode: item?.code ? item.code : 0,
            status: status,
            comment: comment
          }

          return param
        })
      }
    }
    paymentProof(selectedDoc)
    setSelDocument([])
    setSelectedDocument([])
    getStudentDetailById()
  }

  const downloadAllFile = async (fileName: string) => {
    loadingToast('Downloading...')
    const result = await CommonService.getFileUrl(fileName, studentData.studentCode)
    if (!!result) {
      downloadFile(result?.data?.data, fileName)
      successToast(messages.fileDownloadedMessage)
    } else {
      errorToast(messages.error)
    }
  }
  const getFileUrl = async () => {
    await Promise.all(
      selectedDocument?.map(item => {
        return downloadAllFile(`${item?.code}.${item?.fileExtension?.split('/')?.pop()?.trim()}`)
      })
    )
    setSelDocument([])
    setSelectedDocument([])
  }

  useEffect(() => {
    getStudyModeData()
    getQualificationData()
    getProgramList()
    getStudentTypeData()
    getSocialMediaData()
    getNationalityStatus()
    getGenderDetails()
    getRaceDetails()
    getLanguage()
    getCountryData()
    getNationalityData()
    getIdentificationType()
    getDocumentTypeList()

    // getAgentData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData])

  const getDocumentTypeList = async () => {
    const response = await CommonService.getProjectDocumentTypeList('false')
    if (response) {
      setDocumentTypeList(response.data)
    }
  }

  const updateDocumentFileType = async (params: IFileTypePayload, documentTypeCode: string) => {
    loadingToast('Updating..')
    const response = await DocumentService.getDocumenFileType(documentTypeCode, params)
    if (response?.data?.statusCode === status?.successCode) {
      await getStudentDetailById()
      successToast(messages.FileTypeMessage)
    }
  }
  const handleZeroAppBursary = () => {
    setIsZeroBursaryDialog(true)
  }
  const closeZeroAppBursaryDialog = () => {
    setIsZeroBursaryDialog(false)
  }
  const handleSubmitZeroAppBursaryDialog = async () => {
    closeZeroAppBursaryDialog()
    setLoading(true)

    const result = await StudentService.zeroAppFee(studentData?.application?.applicationCode)
    if (status.successCodeArr.includes(result?.statusCode)) {
      await getStudentDetailById()
      setLoading(false)
      successToast(`${studentData?.application?.applicationCode} Application Fee is Zero by Bursary`)
    } else {
      setLoading(false)
      errorToast(messages.error)
    }
  }

  if (studentData?.application?.id) {
    const { lead, education, agent } = studentData.application
    const { payment } = studentData

    const setViPStudent = async (param: DataParams) => {
      param.applicationCode = studentData?.application?.applicationCode
      const result = await StudentService.setVipStudent(param)
      if (result?.status === status?.successCode) {
        successToast(messages.vip)
        getStudentDetailById()
      } else {
        errorToast(messages.error)
      }
    }

    return (
      <React.Fragment>
        <>
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress></CircularProgress>
          </Backdrop>
        </>

        <Card>
          <Accordion expanded={studentInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (studentInfoExpand === true) {
                      setStudentInfoExpand(false)
                    } else if (studentInfoExpand === false) {
                      setStudentInfoExpand(true)
                    }
                  }}
                >
                  <GridExpandMoreIcon />
                </h1>
              }
            >
              <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid
                  item
                  onClick={() => {
                    if (studentInfoExpand === true) {
                      setStudentInfoExpand(false)
                    } else if (studentInfoExpand === false) {
                      setStudentInfoExpand(true)
                    }
                  }}
                >
                  <h3 className='mt-0 d-flex'>
                    <Account sx={{ mr: 2 }} color='primary' />
                    Personal Information
                  </h3>
                </Grid>
                <Grid item>
                  <Grid container columnSpacing={2}>
                    <FullPermission featureCode={FeatureCodes.EMS.application}>
                      <Grid item>
                        <Button
                          onClick={handleZeroAppBursary}
                          disabled={
                            !isBursaryButtonDisabled.includes(studentData?.application?.status) ||
                            !studentData?.application?.education ||
                            loading
                          }
                          variant='contained'
                        >
                          Zero Application Fee by Bursary
                        </Button>
                        <ConfirmationDialog
                          show={isZeroBursaryDialog}
                          message={messages.zeroAppFeeBursaryWarning}
                          cancel={closeZeroAppBursaryDialog}
                          submit={handleSubmitZeroAppBursaryDialog}
                        />
                      </Grid>

                      <Grid item className='text-right'>
                        <DialogUserInfo
                          gender={gender}
                          studentdata={studentData}
                          nationality={nationality}
                          language={language}
                          documentType={identificationType}
                          nationalityStatus={nationalityStatus}
                          race={race}
                          setViPStudent={setViPStudent}
                          userDetailUpdate={userDetailUpdate}
                          enrolment='application'
                        />
                      </Grid>
                    </FullPermission>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                  <label>First Name</label>
                  <Typography variant='h6'>{lead?.firstName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Middle Name</label>
                  <Typography variant='h6'>{lead?.middleName ? lead?.middleName : '-'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Last Name</label>
                  <Typography variant='h6'>{lead?.lastName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>E-Mail</label>
                  <Typography variant='h6'>{lead?.email}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Contact Number</label>
                  <Typography variant='h6'>{`+${lead?.mobileCountryCode} ${lead?.mobileNumber}`}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Gender</label>
                  <Typography variant='h6'>
                    {lead?.gender ? (lead?.gender === 'M' ? 'Male' : 'Female') : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Date of Birth (DD/MM/YYYY)</label>

                  <Typography variant='h6'>{lead?.dateOfBirth ? DateFormat(lead?.dateOfBirth) : '-'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Race</label>
                  <Typography variant='h6'>{getName(race, lead?.race)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Home Language</label>
                  <Typography variant='h6'>{getName(language, lead?.language)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Sales Agent Name</label>
                  <Typography variant='h6'>{agent ? `${agent?.firstName} ${agent?.lastName}` : '-'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Sales Agent Email</label>
                  <Typography variant='h6'>{agent ? agent?.email : '-'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <LightBackground>
                    <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12}>
                        <Typography sx={{ mb: 2 }} display='flex'>
                          <WebBox sx={{ mr: 2, fontSize: ' 2rem' }} color='primary' />
                          <Box sx={{ pt: 2 }}>
                            Nationality Status:{' '}
                            <span style={{ fontWeight: 'bold' }}>
                              {lead?.nationalityStatus ? getName(nationalityStatus, lead?.nationalityStatus) : '-'}
                            </span>
                          </Box>
                        </Typography>
                      </Grid>
                      {lead?.nationalityStatus === 'PRSA' || lead?.nationalityStatus === 'SA' ? (
                        <Grid item xs={4}>
                          <label>Permanent Resident</label>
                          <Typography variant='h6'>
                            {lead?.permenantResident ? getName(nationality, lead?.permenantResident) : '-'}
                          </Typography>
                        </Grid>
                      ) : null}

                      <Grid item xs={4}>
                        <label>Nationality</label>
                        <Typography variant='h6'>{getName(nationality, lead?.nationality)}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <label>ID Document Type / ID No</label>
                        <Typography variant='h6'>
                          {`${getName(identificationType, lead?.identificationDocumentType)} / ${
                            lead?.identificationNumber
                          }`}
                        </Typography>
                        {lead?.identificationDocumentType === DocumentType?.PassPort && (
                          <Box
                            sx={{
                              borderLeft: theme =>
                                compareDates(new Date(lead?.passportExpiryDate), new Date()) === -1
                                  ? `5px solid ${theme.palette.error.main}`
                                  : `5px solid ${theme.palette.success.main}`
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor:
                                  compareDates(new Date(lead?.passportExpiryDate), new Date()) === -1
                                    ? `#FFEAEB`
                                    : `#F4FFF0`,
                                paddingLeft: 2
                              }}
                            >
                              <Typography
                                variant='h6'
                                color={theme =>
                                  compareDates(new Date(lead?.passportExpiryDate), new Date()) === -1
                                    ? theme.palette.error.main
                                    : theme.palette.success.main
                                }
                              >
                                <label>Date of Expiry : </label>
                                {DateFormat(lead?.passportExpiryDate)}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </LightBackground>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>

        <Grid container display='flex' justifyContent='space-between'>
          {lead?.address?.length > 0 &&
            lead?.address.map((item: IAddressExtendedTypes) => (
              <Grid key={item.addressType} xs={5.9}>
                <Card sx={{ mt: 4.5, mb: 0 }}>
                  <Accordion expanded={item.addressType === Address.Postal ? postalInfoExpand : residentialInfoExpand}>
                    <AccordionSummary
                      expandIcon={
                        <h1
                          onClick={() => {
                            if (item.addressType === Address.Postal) {
                              if (postalInfoExpand === true) {
                                setPostalinfoExpand(false)
                              } else if (postalInfoExpand === false) {
                                setPostalinfoExpand(true)
                              }
                            } else {
                              if (residentialInfoExpand === true) {
                                setResidentialinfoExpand(false)
                              } else if (residentialInfoExpand === false) {
                                setResidentialinfoExpand(true)
                              }
                            }
                          }}
                          style={{ margin: 0 }}
                        >
                          <GridExpandMoreIcon />
                        </h1>
                      }
                    >
                      <Grid container rowSpacing={10}>
                        <Grid
                          item
                          xs={8}
                          onClick={() => {
                            if (item.addressType === Address.Postal) {
                              if (postalInfoExpand === true) {
                                setPostalinfoExpand(false)
                              } else if (postalInfoExpand === false) {
                                setPostalinfoExpand(true)
                              }
                            } else {
                              if (residentialInfoExpand === true) {
                                setResidentialinfoExpand(false)
                              } else if (residentialInfoExpand === false) {
                                setResidentialinfoExpand(true)
                              }
                            }
                          }}
                        >
                          <h3 className='mt-0 d-flex'>
                            {item.addressType === Address.Postal ? (
                              <CardAccountDetailsOutline sx={{ mr: 2 }} color='primary' />
                            ) : (
                              <EarthArrowRight sx={{ mr: 2 }} color='primary' />
                            )}
                            {getName(AddressTypeData, item.addressType)} Address
                          </h3>
                        </Grid>
                        <FullPermission featureCode={FeatureCodes.EMS.application}>
                          <Grid item xs={4} className='text-right'>
                            <AddressInfoUpdateDialogue
                              studentdata={studentData}
                              addressdata={item}
                              userAddressUpdate={userAddressUpdate}
                              country={country}
                            />
                          </Grid>
                        </FullPermission>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={4}>
                          <label>Address</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6'>{item?.street}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>City</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6'>{item?.city}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>Country</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6'>{getName(country, item?.country)}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>State</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6'>{item?.stateName ?? item?.state}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>Zip Code</label>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6'>{item?.zipcode}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Card sx={{ mt: 4.5, mb: 0 }}>
          <Accordion expanded={educationInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (educationInfoExpand === true) {
                      setEducationInfoExpand(false)
                    } else if (educationInfoExpand === false) {
                      setEducationInfoExpand(true)
                    }
                  }}
                >
                  <GridExpandMoreIcon />
                </h1>
              }
            >
              <Grid container display={'flex'} justifyContent={'space-between'}>
                <Grid
                  item
                  xs={8}
                  onClick={() => {
                    if (educationInfoExpand === true) {
                      setEducationInfoExpand(false)
                    } else if (educationInfoExpand === false) {
                      setEducationInfoExpand(true)
                    }
                  }}
                >
                  <h3 className='mt-0 d-flex'>
                    <BookEducation sx={{ mr: 2 }} color='primary' />
                    Education and Qualification details
                  </h3>
                </Grid>
                <Grid item>
                  <Grid container spacing={3}>
                    <FullPermission featureCode={FeatureCodes.EMS.application}>
                      <Grid item>
                        <CourseDetails
                          qualificationList={qualificationList}
                          programList={programList}
                          studyModes={studyModes}
                          studentData={studentData}
                          userCourseDetails={userCourseDetails}
                        />
                      </Grid>
                    </FullPermission>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowGap={5}>
                <Grid item xs={4}>
                  <label>Interested Qualification</label>
                  <Typography>{getName(programList, education?.programCode)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Student Type</label>
                  <Typography variant='h6'>{getName(studentTypes, education?.studentTypeCode)}</Typography>
                </Grid>
                {education?.studyModeCode && (
                  <Grid item xs={4}>
                    <label>Study Mode</label>
                    <Typography variant='h6'>{getName(studyModes, education?.studyModeCode)}</Typography>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <label>Highest Qualification</label>
                  <Typography variant='h6'>{getName(qualificationList, education?.qualificationCode)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>High School Name</label>
                  <Typography variant='h6'>{education?.highSchoolName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Are you an international degree holder?</label>
                  <Typography variant='h6'>{education?.isInternationDegree ? 'Yes' : 'No'}</Typography>
                </Grid>

                {education?.socialMediaCode ? (
                  <Grid item xs={4}>
                    <label>Social Media</label>
                    <Typography variant='h6'>{getName(socialMedia, education?.socialMediaCode)}</Typography>
                  </Grid>
                ) : null}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>

        <Card sx={{ mt: 4.5, mb: 0 }}>
          <Accordion expanded={documentInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (documentInfoExpand === true) {
                      setDocumentInfoExpand(false)
                    } else if (documentInfoExpand === false) {
                      setDocumentInfoExpand(true)
                    }
                  }}
                  style={{ margin: 0 }}
                >
                  <GridExpandMoreIcon />
                </h1>
              }
            >
              <Grid container display={'flex'} justifyContent={'space-between'}>
                <Grid
                  item
                  onClick={() => {
                    if (documentInfoExpand === true) {
                      setDocumentInfoExpand(false)
                    } else if (documentInfoExpand === false) {
                      setDocumentInfoExpand(true)
                    }
                  }}
                >
                  <Box>
                    <h3 className='mt-0 d-flex' style={{ margin: 0 }}>
                      <FileDocument sx={{ mr: 2 }} color='primary' />
                      Documents
                    </h3>
                  </Box>
                </Grid>
                <FullPermission featureCode={FeatureCodes.EMS.application}>
                  <Grid item className='text-right'>
                    <Button
                      sx={{ mr: 2 }}
                      variant='contained'
                      size='small'
                      onClick={() => getFileUrl()}
                      startIcon={<Download />}
                      disabled={!selectedDocument.length}
                    >
                      Download All
                    </Button>
                    <Button
                      sx={{ mr: 2 }}
                      variant='contained'
                      size='small'
                      onClick={() => documentApprove('APPROVED', '')}
                      startIcon={<Check />}
                      disabled={!selectedDocument.length}
                    >
                      Verify
                    </Button>
                    <DialogForm
                      documentApprove={documentApprove}
                      disabled={!selectedDocument.length}
                      data={selectedDocument}
                    />
                  </Grid>
                </FullPermission>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Table
                  role={allRoles.application}
                  selectedDocument={selDocument}
                  data={studentData?.document}
                  onSelectionModelChange={(newSelectionModel: Array<string | number>) => {
                    setSelDocument(newSelectionModel)
                    setSelectedDocument(getSelectedDocument(newSelectionModel, studentData?.document))
                  }}
                  updateDocumentFileType={updateDocumentFileType}
                  documentTypeList={documentTypeList}
                  studentCode={studentData.application?.lead?.studentCode}
                  fullPermission={fullPermission}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
        {payment.map(
          (item: IPayment, index: number) =>
            item.feeModeCode === feeModeCode.Application && (
              <Card key={`${item.feeModeCode}${index}`} sx={{ mt: 4.5, mb: 0 }}>
                <Accordion expanded={applicationInfoExpand}>
                  <AccordionSummary
                    expandIcon={
                      <h1
                        onClick={() => {
                          if (applicationInfoExpand === true) {
                            setApplicationInfoExpand(false)
                          } else if (applicationInfoExpand === false) {
                            setApplicationInfoExpand(true)
                          }
                        }}
                        style={{ margin: 0 }}
                      >
                        <GridExpandMoreIcon />
                      </h1>
                    }
                  >
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between' }} container>
                      <Grid
                        item
                        xs={6}
                        onClick={() => {
                          if (applicationInfoExpand === true) {
                            setApplicationInfoExpand(false)
                          } else if (applicationInfoExpand === false) {
                            setApplicationInfoExpand(true)
                          }
                        }}
                      >
                        <h3 className='mt-0 d-flex'>
                          <CreditCardCheck sx={{ mr: 2 }} color='primary' />
                          Application Payment Details
                        </h3>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={4}>
                        <label>Module Fee</label>
                        <Typography>
                          <CustomChip size='small' color='success' label={item?.paymentStatus} />
                          {` R ${item.totalAmount}`}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <label>Payment Type</label>
                        <Typography>{item?.paymentType ?? 'Offline'}</Typography>
                      </Grid>
                      {item?.feeModeCode && (
                        <Grid item xs={4}>
                          <label>Payment Mode </label>
                          <Typography>{item?.feeModeCode}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Card>
            )
        )}
      </React.Fragment>
    )
  } else {
    return <FallbackSpinner />
  }
}

export default PreviewCard
