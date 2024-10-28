/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Grid,
  Tooltip,
  Typography,
  styled
} from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'

// ** Custom Components and Services
import AddressInfoUpdateDialogue from 'src/views/pages/dialog/AddressInfo'
import DialogUserInfo from 'src/views/pages/dialog/DialogUserInfo'
import CourseDetails from 'src/views/pages/dialog/CourseDetails'
import {
  AcademicService,
  CommonService,
  StudentService,
  DashboardService,
  DocumentService,
  FinanceService
} from 'src/service'
import { dismissLoadingToast, errorToast, loadingToast, successToast } from 'src/components/Toast'
import {
  allRoles,
  dataMessages,
  messages,
  Address,
  StudentTypesEnums,
  DocumentType,
  DocumentStatus,
  DBMCode,
  AddressTypeData,
  paymentType
} from 'src/context/common'
import { getSelectedDocument, downloadFile, getName, DateFormat, compareDates } from 'src/utils'
import { status } from 'src/context/common'
import { IFileTypePayload, commonListTypes, IUpldateDocRow } from 'src/types/apps/dataTypes'
import { AddressParams, CourseParams, DataParams, StudentParams } from 'src/types/apps/dataTypes'
import DialogForm from 'src/views/pages/dialog/DialogForm'
import Table from 'src/views/apps/roles/Table'
import FallbackSpinner from 'src/@core/components/spinner'
import { DocTypes } from 'src/context/types'
import { LightBackground } from 'src/styles/style'
import { IUploadDocumentParam } from 'src/types/apps/projectTypes'
import DocumentDialog from 'src/views/pages/dialog/DocumentDialog'
import { documentType } from 'src/types/apps/invoiceTypes'
import StudentTypeDialog from 'src/views/pages/dialog/StudentTypeDialog'
import { FullPermission, ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

// ** Icons
import {
  Account,
  ArchiveCheckOutline,
  BookEducation,
  CardAccountDetailsOutline,
  Check,
  Download,
  EarthArrowRight,
  FileDocument,
  StarCircle,
  Upload,
  WebBox
} from 'mdi-material-ui'

// ** Third Party Modules
import { IAddressExtendedTypes } from 'src/types/apps/admittedStudent'
import FinalFeeDialog from 'src/views/pages/dialog/FinalFeeDialog'
import PaymentHistoryTable from '../../roles/paymnetHistoryTable'
import { RplStatus } from 'src/components/common/RplComponents'
import GenerateInvoice from 'src/views/pages/dialog/GenerateInvoice'

import CommonDueAmount from 'src/components/commonDueAmount'
import EditSponsorDialog from 'src/views/pages/dialog/AddEditSponsor'
import SponsorData from './Sponsor'

type Props = /*unresolved*/ any

const PreviewCard = ({ getEnrolmentDetailById, data, setLoading }: Props) => {
  const [studyModes, setStudyModes] = useState<any>([])
  const [studentTypes, setStudentTypes] = useState<any>([])
  const [currencyList, setCurrencyList] = useState<any>([])
  const [programList, setProgramList] = useState<any[]>([])
  const [selectedDocument, setSelectedDocument] = useState<any[]>([])
  const [selDocument, setSelDocument] = useState<Array<string | number>>([])
  const [qualificationList, setQualificationList] = useState<Array<commonListTypes>>([])
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [documentInfoExpand, setDocumentInfoExpand] = useState<boolean>(true)
  const [postalInfoExpand, setPostalinfoExpand] = useState<boolean>(true)
  const [residentialInfoExpand, setResidentialinfoExpand] = useState<boolean>(true)
  const [gender, setGender] = useState<commonListTypes[]>([])
  const [race, setRace] = useState<commonListTypes[]>([])
  const [language, setLanguage] = useState<commonListTypes[]>([])
  const [nationality, setNationality] = useState<commonListTypes[]>([])
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const [nationalityStatus, setNationalityStatus] = useState<commonListTypes[]>([])
  const [country, setCountry] = useState<commonListTypes[]>([])
  const [documentTypeList, setDocumentTypeList] = useState<Array<commonListTypes>>([])
  const [uploadedDoc, setUploadedDoc] = useState<Array<documentType & File[]>>(
    data?.document?.filter((each: any) => {
      if (!data?.application?.bursary?.bursary?.name && each?.documentTypeCode === DocumentType.BursaryLetter) {
        return false
      } else {
        return true
      }
    })
  )
  const [feeDetails, setFeeDetails] = useState<any>([])
  const [isRmat, setRmat] = useState<any>([])
  const [payment, setPaymentDetails] = useState<any>([])
  const [sponserInfoExpand, setSponserInfoExpand] = useState<boolean>(true)
  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.applicationEnrollment,
    PermissionsCodes.full,
    moduleKeys.sales
  )
  const [paymentHistoryInfoExpand, setPaymentHistoryInfoExpand] = useState<boolean>(true)

  const router = useRouter()
  const getQualificationData = async () => {
    const response = await CommonService.getHighestQualification()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setQualificationList(response.data.data)
    }
  }
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && !!response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  const getStudyModeData = async () => {
    const response = await CommonService.getStudyMode()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudyModes(response.data.data)
    }
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }

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

  const getDocumentTypeList = async () => {
    const response = await CommonService.getProjectDocumentTypeList('false')
    if (response && response?.data) {
      const documentTypeList = response?.data
      setDocumentTypeList(documentTypeList)
      {
        /* data?.application?.bursary?.bursary?.name */
      }
    }
  }
  const DarkCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.grey[400],
    padding: 8
  }))

  const getAllCurrencyList = async () => {
    const response = await CommonService.getCurrencyList()
    if (response?.status === status?.successCode) {
      setCurrencyList(response?.data?.data)
    }
  }
  const getFeeDetailsByProgramCode = async (programCode: string) => {
    const result = await FinanceService?.getFeeDetails(programCode)
    if (result) {
      setFeeDetails(result)
    }
  }
  const getFinedtechdetails = async (studentCode: string) => {
    const result = await FinanceService?.getFinedtechdetails(studentCode)
    if (result) {
      setPaymentDetails(result)
    }
  }

  const checkIsRmat = async () => {
    const response = await StudentService.checkIsRmatRequired(data?.application?.education?.programCode)
    if (response?.statusCode === status.successCode) {
      setRmat(response?.data)
    }
  }

  useEffect(() => {
    if (data?.document) {
      setUploadedDoc(
        data?.document?.filter((each: any) => {
          if (!data?.application?.bursary?.bursary?.name && each?.documentTypeCode === DocumentType.BursaryLetter) {
            return false
          } else {
            return true
          }
        })
      )
    }
    if (data?.application?.education?.programCode) {
      getFeeDetailsByProgramCode(data?.application?.education?.programCode)
    }
    if (data?.application?.lead?.studentCode) {
      getFinedtechdetails(data?.application?.lead?.studentCode)
    }
  }, [data])

  useEffect(() => {
    getProgramList()
    getDocumentTypeList()
    getStudyModeData()
    getStudentTypeData()
    getCountryData()
    getQualificationData()
    getAllCurrencyList()
    getNationalityStatus()
    getGenderDetails()
    getRaceDetails()
    getLanguage()
    getIdentificationType()
    getNationalityData()
    checkIsRmat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userDetailUpdate = async (data: StudentParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateStudent(data, appCode)
    if (result?.status === status.successCode) {
      await getEnrolmentDetailById()
      successToast(dataMessages.success)
    } else {
      errorToast(messages.error)
    }
  }

  const userAddressUpdate = async (data: AddressParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateAddress(data, appCode)
    if (result?.status === status.successCode) {
      await getEnrolmentDetailById()
      successToast(dataMessages.success)
    } else {
      errorToast(messages.error)
    }
  }

  const userCourseDetails = async (data: CourseParams, appCode: string) => {
    loadingToast()
    const result = await StudentService.updateCourse(data, appCode)
    if (result?.status === status.successCode) {
      await getEnrolmentDetailById()
      successToast(dataMessages.success)
    } else if (result?.statusCode === status.badRequestCode) {
      errorToast(result?.message)
    } else {
      errorToast(messages.error)
    }
  }

  const setViPStudent = async (param: DataParams) => {
    loadingToast()
    param.applicationCode = data?.application?.applicationCode
    const result = await StudentService.setVipStudent(param)
    if (result?.status === status?.successCode) {
      await getEnrolmentDetailById()
      successToast(messages.vip)
    } else {
      errorToast(messages.error)
    }
  }

  const paymentProof = async (param: any) => {
    const result = await StudentService.appDocuments(param)
    if (result?.status === status?.successCode) {
      if (param?.payload?.documents?.some((item: DocTypes) => item.status == 'APPROVED')) {
        successToast(messages.approve)
      } else {
        successToast(messages.reject)
      }
    } else {
      errorToast(messages.error)
    }
    getEnrolmentDetailById()
  }

  const documentApprove = async (status: string, comment: string) => {
    loadingToast()
    const selectedDoc = {
      appCode: router?.query?.id,
      payload: {
        documents: selectedDocument?.map(item => {
          const param = {
            documentTypeCode: item?.documentTypeCode,
            docCode: item?.code ? item.code : 0,
            status: status,
            comment: comment
          }

          return param
        })
      }
    }
    await paymentProof(selectedDoc)
    setSelDocument([])
    setSelectedDocument([])
    getEnrolmentDetailById()
  }

  const downloadAllFile = async (fileName: string) => {
    const result = await CommonService.getFileUrl(fileName, data?.application?.lead?.studentCode)
    if (result?.data?.data) {
      downloadFile(result?.data?.data, fileName)
    } else {
      errorToast(messages.error)
    }
  }

  const getFileUrl = async () => {
    try {
      loadingToast()
      await Promise.all(
        selectedDocument?.map(item => {
          return downloadAllFile(`${item?.code}${item?.fileExtension?.split('/')?.pop()?.trim()}`)
        })
      )
      setSelDocument([])
      setSelectedDocument([])
      dismissLoadingToast()
    } catch (err) {
      console.log(err)
      errorToast('Something happened wrong')
      dismissLoadingToast()
    }
  }
  const checkMandatoryDocument = async (applicationCode: string) => {
    await StudentService.checkMandatoryDocument(applicationCode)
  }

  const uploadDocument = async (param: IUploadDocumentParam, documentCode: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLoading(true)
    const { file, documentTypeCode } = param as any
    const ext = file?.name?.split('.').pop()?.toLowerCase()

    const documentUpdatePayload = {
      name: file?.name,
      fileExtension: `.${ext}`,
      status: DocumentStatus.Pending,
      documentTypeCode: documentTypeCode,
      applicationCode: data?.application?.applicationCode,
      code: documentCode
    }
    const updateDocumentResponse = await DocumentService?.documentUpdate(documentUpdatePayload)

    if (updateDocumentResponse?.statusCode === status?.successCodeOne) {
      setLoading(false)
      getEnrolmentDetailById()
      checkMandatoryDocument(data?.application?.applicationCode)
      successToast(messages?.documentUploaded)
    } else {
      setLoading(false)
      errorToast(messages?.awsFileNotUploadMessage)
    }
    setLoading(false)
  }

  const reUploadDocument = async (param: IUploadDocumentParam, oldFile: IUpldateDocRow) => {
    setLoading(true)
    const { file } = param
    const ext = file?.name?.split('.').pop()
    const payload = {
      documentTypeCode: oldFile.documentTypeCode,
      fileName: file?.name,
      fileType: `.${ext}`,
      applicationCode: data?.application?.applicationCode,
      studentCode: data?.application?.lead?.studentCode
    }
    const awsResponse = await CommonService?.documentUpload({
      filename: `${oldFile.code}.${ext}`,
      filetype: `.${ext}`,
      file: file,
      studentCode: payload?.studentCode
    })

    if (awsResponse) {
      const response = await DashboardService.reUploadDocument(payload, oldFile.code)
      if (response?.statusCode === status?.successCode && response?.data) {
        const data = response?.data
        const updateDocumentRes = await DocumentService?.updateDocumentStatus(data?.documentCode)
        if (updateDocumentRes?.statusCode === status?.successCode) {
          setLoading(false)
          getEnrolmentDetailById()
          successToast(messages?.documentUploaded)
        } else {
          setLoading(false)
          errorToast(messages?.awsFileNotUploadMessage)
        }
      }
    } else {
      setLoading(false)
      errorToast(messages?.awsFileNotUploadMessage)
    }
    setLoading(false)
  }

  const updateDocumentFileType = async (params: IFileTypePayload, documentTypeCode: string) => {
    loadingToast()
    const response = await DocumentService.getDocumenFileType(documentTypeCode, params)
    if (response?.data?.statusCode === status?.successCode) {
      await getEnrolmentDetailById()
      successToast(messages.documentFileType)
    } else {
      errorToast(messages.error)
    }
  }
  const updateStudentType = async (studentType: string) => {
    loadingToast()
    const response = await StudentService.updateStudentType(data?.application?.applicationCode, studentType)
    if (status.successCodeArr.includes(response?.statusCode)) {
      if (studentType === StudentTypesEnums.bursary) {
        const generateQuoteResponse = await StudentService.generateQuote(data?.application?.applicationCode)
        if (status.successCodeArr.includes(generateQuoteResponse?.statusCode)) {
          await getEnrolmentDetailById()
          successToast(messages.studentTypeUpdate)
        } else {
          errorToast(messages.error)
        }
      } else {
        await getEnrolmentDetailById()
        successToast(messages.studentTypeUpdate)
      }
    } else {
      errorToast(messages.error)
    }
  }
  const generateFinalFee = async (partialPayment: string, discountDetails: any, discountedAmount: any) => {
    loadingToast()
    const payload = {
      amount: partialPayment,
      discountAmount: discountedAmount ? discountedAmount : 0,
      discountCode: discountDetails?.discountCode ? discountDetails?.discountCode : ''
    }
    const response = await StudentService.regenerateQuote(data?.application?.applicationCode, payload)
    if (status.successCodeArr.includes(response?.statusCode)) {
      await getEnrolmentDetailById()
      successToast(messages.generateFinalFee)
    } else {
      errorToast(messages.error)
    }
  }

  const generateInvoice = async (payload: any) => {
    loadingToast()

    const response = await FinanceService.generateInvoice(payload)
    if (status.successCodeArr.includes(response?.statusCode)) {
      await getEnrolmentDetailById()
      successToast(messages.generateInvoice)
    } else {
      errorToast(messages.error)
    }
  }

  const checkPaymentOffline = data?.payment?.some((payment: any) => payment.paymentType === paymentType.offline)

  if (data?.application) {
    const { lead, education, agent, enrolment } = data?.application
    const address = lead?.address
    address?.sort((a: any, b: any) => {
      if (a.addressType === 'POSTAL' && b.addressType !== 'POSTAL') {
        return -1
      } else if (a.addressType !== 'POSTAL' && b.addressType === 'POSTAL') {
        return 1
      } else {
        return 0
      }
    })

    return (
      <Box>
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
                  xs={8}
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
                  {data?.VIPStatus && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title='Vip User'>
                        <StarCircle style={{ color: 'gold', display: 'flex' }} />
                      </Tooltip>
                    </Box>
                  )}
                </Grid>
                <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
                  <Grid item className='text-right'>
                    <DialogUserInfo
                      gender={gender}
                      studentdata={data}
                      nationality={nationality}
                      language={language}
                      documentType={identificationType}
                      nationalityStatus={nationalityStatus}
                      race={race}
                      userDetailUpdate={userDetailUpdate}
                      enrolment='enrolment'
                      setViPStudent={setViPStudent}
                    />
                  </Grid>
                </FullPermission>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={6} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                  <Typography variant='h6' sx={{ wordBreak: 'break-all' }}>
                    {lead?.email}
                  </Typography>
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
                  <Typography variant='h6'>
                    {agent?.firstName ? `${agent?.firstName} ${agent?.lastName}` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Sales Agent Email</label>
                  <Typography variant='h6'> {agent?.email ?? '-'}</Typography>
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
                      <Grid container rowSpacing={6}>
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
                        <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
                          <Grid item xs={4} className='text-right'>
                            <AddressInfoUpdateDialogue
                              studentdata={data}
                              country={country}
                              addressdata={item}
                              userAddressUpdate={userAddressUpdate}
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
                  <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
                    <Grid container spacing={3}>
                      <Grid item>
                        <StudentTypeDialog
                          studentTypeList={studentTypes}
                          studentData={data}
                          studyModeList={studyModes}
                          updateStudentType={updateStudentType}
                          programList={programList}
                        />
                      </Grid>
                      {education?.studentTypeCode === StudentTypesEnums.bursary ? (
                        <Grid item>
                          <FinalFeeDialog
                            studentTypeList={studentTypes}
                            studentData={data}
                            studyModeList={studyModes}
                            generateFinalFee={generateFinalFee}
                            currencyList={currencyList}
                            feeDetails={feeDetails}
                          />
                        </Grid>
                      ) : null}
                      <Grid item>
                        <CourseDetails
                          qualificationList={qualificationList}
                          programList={programList}
                          studyModes={studyModes}
                          studentData={data}
                          userCourseDetails={userCourseDetails}
                        />
                      </Grid>
                    </Grid>
                  </FullPermission>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={6}>
                <Grid item xs={4}>
                  <label>Interested Qualification </label>
                  <Typography variant='h6'>{getName(programList, education?.programCode)}</Typography>
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
                {education?.bursaryName && (
                  <Grid item xs={4}>
                    <label>Bursary Name</label>
                    <Typography variant='h6'>{education?.bursaryName}</Typography>
                  </Grid>
                )}
              </Grid>
              {education?.programCode == DBMCode && (
                <Grid sx={{ mt: 6 }}>
                  <DarkCard>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <label>NQF Level </label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {data?.application?.eligibility?.highestNqfLabel
                            ? data?.application?.eligibility?.highestNqfLabel
                            : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <label>% of Marks</label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {data?.application?.eligibility?.marks ? data?.application?.eligibility?.marks : '-'}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <label>Access Program Required?</label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {data?.application?.eligibility != null
                            ? data?.application?.eligibility?.accessProgram
                              ? 'Yes'
                              : 'No'
                            : '-'}
                        </Typography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                    </Grid>
                  </DarkCard>
                </Grid>
              )}
              <RplStatus data={data} getEnrolmentDetailById={getEnrolmentDetailById} />
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* {data && data?.application?.sponsor?.length > 0 && ( */}
        <Card sx={{ mt: 4.5, mb: 0 }}>
          <Accordion expanded={sponserInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (sponserInfoExpand === true) {
                      setSponserInfoExpand(false)
                    } else if (sponserInfoExpand === false) {
                      setSponserInfoExpand(true)
                    }
                  }}
                >
                  <GridExpandMoreIcon />
                </h1>
              }
            >
              <Grid container justifyContent='space-between' rowSpacing={10}>
                <Grid
                  item
                  onClick={() => {
                    if (sponserInfoExpand === true) {
                      setSponserInfoExpand(false)
                    } else if (sponserInfoExpand === false) {
                      setSponserInfoExpand(true)
                    }
                  }}
                >
                  <h3 className='mt-0 d-flex'>
                    <BookEducation sx={{ mr: 2 }} color='primary' />
                    Sponsor Details
                  </h3>
                </Grid>
                <Grid item>
                  <FullPermission featureCode={FeatureCodes.OMS.AdmittedStudentList}>
                    <EditSponsorDialog
                      applicationCode={data?.application?.applicationCode}
                      country={country}
                      getStudentData={getEnrolmentDetailById}
                      isEdit={false}
                      gender={gender}
                      documentType={identificationType}
                    />
                  </FullPermission>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container p={2} rowGap={3}>
                {data &&
                  data?.application?.sponsor?.length > 0 &&
                  data?.application?.sponsor?.map((sponsor: any, key: any) => {
                    return (
                      <SponsorData
                        key={key}
                        sponsor={sponsor}
                        country={country}
                        getEnrolmentDetailById={getEnrolmentDetailById}
                        applicationCode={data?.application?.applicationCode}
                        gender={gender}
                        identificationType={identificationType}
                      />
                    )
                  })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
        {/* )} */}

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
                  <h3 className='mt-0 d-flex'>
                    <FileDocument sx={{ mr: 2 }} color='primary' />
                    Documents
                  </h3>
                </Grid>
                <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
                  <Grid container xs={8} justifyContent={'end'} alignItems={'center'}>
                    <Grid item>
                      <DocumentDialog
                        documentBtnTitle='Upload Documents'
                        documentBtnProps={{
                          sx: { mr: 2, position: 'relative' },
                          variant: 'outlined',
                          size: 'small',
                          startIcon: <Upload />
                        }}
                        studentData={data}
                        uploadDocumentApi={uploadDocument as any}
                        documentTypeList={documentTypeList}
                        showCommentSection={false}
                        programs={programList}
                      />
                    </Grid>
                    <Grid item sx={{ mr: 2 }}>
                      |
                    </Grid>
                    <Grid item className='text-right'>
                      <DialogForm
                        documentApprove={documentApprove}
                        data={selectedDocument}
                        disabled={!selectedDocument.length}
                      />
                      &nbsp;&nbsp;
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
                    </Grid>
                  </Grid>
                </FullPermission>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Table
                  role={allRoles.enrolment}
                  selectedDocument={selDocument}
                  data={uploadedDoc as any}
                  onSelectionModelChange={(newSelectionModel: Array<string | number>) => {
                    setSelDocument(newSelectionModel)
                    setSelectedDocument(getSelectedDocument(newSelectionModel, data?.document))
                  }}
                  updateDocumentFileType={updateDocumentFileType}
                  documentTypeList={documentTypeList}
                  studentCode={data?.application?.lead?.studentCode}
                  reUploadDocument={reUploadDocument}
                  fullPermission={fullPermission}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>

        <Card sx={{ mt: 4.5, mb: 0 }}>
          <Accordion expanded={paymentHistoryInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (paymentHistoryInfoExpand === true) {
                      setPaymentHistoryInfoExpand(false)
                    } else if (paymentHistoryInfoExpand === false) {
                      setPaymentHistoryInfoExpand(true)
                    }
                  }}
                  style={{ margin: 0 }}
                >
                  <GridExpandMoreIcon />
                </h1>
              }
            >
              <Grid container display={'flex'}>
                <Grid
                  item
                  onClick={() => {
                    if (paymentHistoryInfoExpand === true) {
                      setPaymentHistoryInfoExpand(false)
                    } else if (paymentHistoryInfoExpand === false) {
                      setPaymentHistoryInfoExpand(true)
                    }
                  }}
                  sm={4}
                >
                  <h3 className='mt-0 d-flex'>
                    <ArchiveCheckOutline sx={{ mr: 2 }} color='primary' />
                    Payment History
                  </h3>
                </Grid>
                <Grid item container sx={{ display: 'flex', justifyContent: 'end' }} sm={8}>
                  <Grid item sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }} mr={10}>
                    <GenerateInvoice
                      lead={data?.application}
                      document={data?.document}
                      payment={data?.payment}
                      enrolment={enrolment}
                      paymentFintech={payment}
                      generateInvoice={generateInvoice}
                      feeDetails={feeDetails}
                      isRmat={isRmat}
                      checkPaymentOffline={checkPaymentOffline}
                      studyModeCode={data?.application?.education?.studyModeCode}
                    />
                  </Grid>
                  <Grid item>
                    <CommonDueAmount studentData={data} />
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <PaymentHistoryTable payment={payment} />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      </Box>
    )
  } else {
    return <FallbackSpinner />
  }
}

export default PreviewCard
