// ** Next Import
import { getSelectedDocument, downloadFile, getName, DateFormat, compareDates } from 'src/utils'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ArchiveCheckOutline, Check, Download, WebBox } from 'mdi-material-ui'
import CardAccountMail from 'mdi-material-ui/CardAccountMail'
import BookEducation from 'mdi-material-ui/BookEducation'
import Account from 'mdi-material-ui/Account'
import CustomChip from 'src/@core/components/mui/chip'
import FileDocument from 'mdi-material-ui/FileDocument'
import DialogForm from 'src/views/pages/dialog/DialogForm'
import Table from 'src/views/apps/roles/Table'
import {
  allRoles,
  documentStatus,
  messages,
  paymentType,
  Address,
  feeModeCode,
  DocumentType,
  DBMCode
} from 'src/context/common'
import { StudentService, AcademicService, CommonService, FinanceService, DocumentService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import { status } from 'src/context/common'
import React, { useState, useEffect } from 'react'
import { IFileTypePayload, commonListTypes } from 'src/types/apps/dataTypes'
import FallbackSpinner from 'src/@core/components/spinner'
import { CreditCardCheck } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { IPayment, DocTypes } from 'src/context/types'
import { LightBackground } from 'src/styles/style'
import { IAddressExtendedTypes } from 'src/types/apps/admittedStudent'
import { FullPermission, ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'
import PaymentHistoryTable from '../../roles/paymnetHistoryTable'
import EligibilityCriteriaDialog from 'src/views/pages/dialog/EligibilityCriteriaDialog'
import { RplStatus } from 'src/components/common/RplComponents'

import CommonDueAmount from 'src/components/commonDueAmount'

type Props = /*unresolved*/ any

const PreviewCard = ({ id, data, getData }: Props) => {
  const [selectedDocument, setSelectedDocument] = useState<any[]>([])
  const [programData, setProgramData] = useState<null | any>({})
  const [selDocument, setSelDocument] = useState<any[]>([])
  const [qualificationList, setQualificationList] = useState<Array<commonListTypes>>([])
  const [studentTypes, setStudentTypes] = useState<Array<commonListTypes>>([])
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [documentInfoExpand, setDocumentInfoExpand] = useState<boolean>(true)
  const [postalInfoExpand, setPostalinfoExpand] = useState<boolean>(true)
  const [residentialInfoExpand, setResidentialinfoExpand] = useState<boolean>(true)
  const [paymentInfoExpand, setPaymentInfoExpand] = useState<boolean>(true)
  const [paidApplicationAmountInRand, setPaidApplicationAmountInRand] = useState<number>(0)
  const [race, setRace] = useState<commonListTypes[]>([])
  const [language, setLanguage] = useState<commonListTypes[]>([])
  const [nationality, setNationality] = useState<commonListTypes[]>([])
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const [nationalityStatus, setNationalityStatus] = useState<commonListTypes[]>([])
  const [country, setCountry] = useState<commonListTypes[]>([])
  const [studyModes, setStudyModes] = useState<commonListTypes[]>([])
  const [documentTypeList, setDocumentTypeList] = useState<Array<commonListTypes>>([])
  const [paymentHistoryInfoExpand, setPaymentHistoryInfoExpand] = useState<boolean>(true)

  const [payment, setPaymentDetails] = useState<any>([])

  const fullPermission = ModuleFeaturePermission(FeatureCodes.EMS.admission, PermissionsCodes.full, moduleKeys.sales)

  const router = useRouter()
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramData(response?.data?.data)
    }
  }
  const getQualificationData = async () => {
    const response = await CommonService.getHighestQualification()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setQualificationList(response.data.data)
    }
  }
  const getStudentTypeData = async () => {
    const response = await CommonService.getStudentType()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudentTypes(response.data.data)
    }
  }
  const getStudyModeData = async () => {
    const response = await CommonService.getStudyMode()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setStudyModes(response.data.data)
    }
  }
  const getCountryData = async () => {
    const response = await CommonService.getCountryLists()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setCountry(response.data.data)
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

  const getFinedtechdetails = async (studentCode: string) => {
    const result = await FinanceService?.getFinedtechdetails(studentCode)
    if (result) {
      setPaymentDetails(result)
    }
  }

  const DarkCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.grey[400],
    padding: 8
  }))

  useEffect(() => {
    getQualificationData()
    getStudentTypeData()
    getNationalityStatus()

    getRaceDetails()
    getLanguage()
    getIdentificationType()
    getCountryData()
    getNationalityData()
    getStudyModeData()
    getDocumentTypeList()
  }, [])

  useEffect(() => {
    if (id) {
      getProgramList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const paymentProof = async (param: any) => {
    const result = await StudentService.admissionDocs(param)
    if (result?.status === status?.successCode) {
      if (param?.payload?.documents?.some((item: DocTypes) => item.status == 'APPROVED')) {
        successToast(messages.approve)
      } else {
        successToast(messages.reject)
      }
    } else {
      errorToast(messages.error)
    }
    getData()
  }

  const documentApprove = async (status: string, comment: string) => {
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
    getData()
  }

  const documentFilterData = (documents: any) => {
    const result = documents?.filter(
      (item: any) =>
        item?.status === documentStatus?.salesApproved ||
        item?.status === documentStatus?.admissionApproved ||
        item?.status === documentStatus?.admissionReject ||
        item?.status === documentStatus?.FinanceVerified
    )

    return result
  }

  const downloadAllFile = async (fileName: string) => {
    const result = await CommonService.getFileUrl(fileName, data?.application?.lead?.studentCode)
    downloadFile(result?.data?.data, fileName)
  }
  const getFileUrl = async () => {
    await Promise.all(
      selectedDocument?.map(item => {
        return downloadAllFile(`${item?.code}${item?.fileExtension?.split('/')?.pop()?.trim()}`)
      })
    )
    setSelDocument([])
    setSelectedDocument([])
  }

  useEffect(() => {
    if (data?.payment?.length) {
      data?.payment?.forEach((element: any) => {
        convertCurrency(element)
      })
    }
    if (data?.application?.lead?.studentCode) {
      getFinedtechdetails(data?.application?.lead?.studentCode)
    }
  }, [data])

  const convertCurrency = async (element: any) => {
    setPaidApplicationAmountInRand(element?.totalAmount)

    if (element?.currencyCode) {
      const response = await FinanceService.getCurrencyRate(element?.currencyCode)
      if (response?.data?.data) {
        const result = response?.data?.data
        const rate = parseInt(result?.rate)
        const randAmount: number = parseInt(element?.totalAmount) / rate
        setPaidApplicationAmountInRand(randAmount)
      }
    }
  }

  const getDocumentTypeList = async () => {
    const response = await CommonService.getProjectDocumentTypeList('false')
    if (response) {
      setDocumentTypeList(response.data)
    }
  }

  const updateDocumentFileType = async (params: IFileTypePayload, documentTypeCode: string) => {
    const response = await DocumentService.getDocumenFileType(documentTypeCode, params)
    if (response?.data?.statusCode === status?.successCode) {
      getData()
    }
  }

  if (data?.application) {
    const { lead, education, agent } = data?.application

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
                      {lead?.nationalityStatus === 'PRSA' ? (
                        <Grid item xs={4}>
                          <label>Permanent Resident</label>
                          <Typography variant='h6'>South Africa</Typography>
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
                            <CardAccountMail sx={{ mr: 2 }} color='primary' />
                            {item.addressType} Address
                          </h3>
                        </Grid>
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
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={2}>
                <Grid item xs={4}>
                  <label>Interested Qualification </label>
                  <Typography variant='h6'>{getName(programData, education?.programCode)}</Typography>
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

                      <Grid item xs={2}>
                        <EligibilityCriteriaDialog
                          studentData={data}
                          getData={getData}
                          edit={data?.application?.eligibility != null}
                        />
                      </Grid>
                    </Grid>
                  </DarkCard>
                </Grid>
              )}
              <RplStatus data={data} getEnrolmentDetailById={getData} />
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
                    <h3 className='mt-0 d-flex'>
                      <FileDocument sx={{ mr: 2 }} color='primary' />
                      Documents
                    </h3>
                  </Box>
                </Grid>

                <FullPermission featureCode={FeatureCodes.EMS.admission}>
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
                  role={allRoles.admission}
                  selectedDocument={selDocument}
                  data={documentFilterData(data?.document)}
                  onSelectionModelChange={(newSelectionModel: Array<string | number>) => {
                    setSelDocument(newSelectionModel)
                    setSelectedDocument(getSelectedDocument(newSelectionModel, data?.document))
                  }}
                  selectCriteria={documentStatus.salesApproved.toLowerCase()}
                  updateDocumentFileType={updateDocumentFileType}
                  documentTypeList={documentTypeList}
                  studentCode={data.application?.lead?.studentCode}
                  fullPermission={fullPermission}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>

        {Object.keys(payment).length > 0 &&
          payment.map(
            (item: IPayment) =>
              item.feeModeCode === feeModeCode.Program && (
                <Card sx={{ mt: 4.5, mb: 0 }} key={item.feeModeCode}>
                  <Accordion expanded={paymentInfoExpand}>
                    <AccordionSummary
                      expandIcon={
                        <h1
                          onClick={() => {
                            if (paymentInfoExpand === true) {
                              setPaymentInfoExpand(false)
                            } else if (paymentInfoExpand === false) {
                              setPaymentInfoExpand(true)
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
                            if (paymentInfoExpand === true) {
                              setPaymentInfoExpand(false)
                            } else if (paymentInfoExpand === false) {
                              setPaymentInfoExpand(true)
                            }
                          }}
                        >
                          <h3 className='mt-0 d-flex'>
                            <CreditCardCheck sx={{ mr: 2 }} color='primary' />
                            Qualification Payment Details
                          </h3>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4}>
                          <label>Module Fee</label>
                          <Typography>
                            <CustomChip size='small' color='success' label={item?.paymentStatus} />/ R{' '}
                            {paidApplicationAmountInRand}
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>Status</label>
                          <Typography>{item?.paymentStatus}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                          <label>Amount</label>
                          <Typography>{item?.totalAmount}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <label>
                            {item?.paymentType === paymentType.online ? 'Transition Id' : 'Reference number'}
                          </label>
                          <Typography>
                            {item?.paymentType === paymentType.online ? item?.transactionId : item?.referenceNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <label>Payment Type</label>
                          <Typography>{item?.paymentType}</Typography>
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
              <Grid container display={'flex'} justifyContent={'space-between'}>
                <Grid
                  item
                  onClick={() => {
                    if (paymentHistoryInfoExpand === true) {
                      setPaymentHistoryInfoExpand(false)
                    } else if (paymentHistoryInfoExpand === false) {
                      setPaymentHistoryInfoExpand(true)
                    }
                  }}
                >
                  <h3 className='mt-0 d-flex'>
                    <ArchiveCheckOutline sx={{ mr: 2 }} color='primary' />
                    Payment History
                  </h3>
                </Grid>
                <Grid>
                  <CommonDueAmount studentData={data} />
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
