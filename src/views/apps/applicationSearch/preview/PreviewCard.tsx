import * as React from 'react'

// ** Next Import
import ApplicationSearchTable from 'src/views/apps/roles/applicationSearchTable'
import { Address, AddressTypeData, DBMCode, DocumentType } from 'src/context/common'
import { useState } from 'react'
import { getName, DateFormat, compareDates } from 'src/utils'
import { LightBackground, TableCard } from 'src/styles/style'

// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { DataGrid, GridColumns, GridExpandMoreIcon } from '@mui/x-data-grid/'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Box, styled } from '@mui/material'

import {
  ArchiveCheckOutline,
  CardAccountDetailsOutline,
  EarthArrowRight,
  NotebookPlusOutline,
  WebBox
} from 'mdi-material-ui'
import BookEducation from 'mdi-material-ui/BookEducation'
import Account from 'mdi-material-ui/Account'
import FileDocument from 'mdi-material-ui/FileDocument'
import FallbackSpinner from 'src/@core/components/spinner'
import { IAddressExtendedTypes } from 'src/types/apps/admittedStudent'
import CommonCustomHook from 'src/context/CommonAPIS/commonCustomHook'
import PaymentHistoryTable from '../../roles/paymnetHistoryTable'

import CommonDueAmount from 'src/components/commonDueAmount'
import { RplStatus } from 'src/components/common/RplComponents'
import { FinanceService } from 'src/service'

type Props = /*unresolved*/ any
const PreviewCard = ({ studentData }: Props) => {
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [documentInfoExpand, setDocumentInfoExpand] = useState<boolean>(true)
  const [postalInfoExpand, setPostalinfoExpand] = useState<boolean>(true)
  const [residentialInfoExpand, setResidentialinfoExpand] = useState<boolean>(true)
  const [paymentHistoryInfoExpand, setPaymentHistoryInfoExpand] = useState<boolean>(true)
  const [academicRecordExpand, setAcademicRecordExpand] = useState<boolean>(true)
  const [payment, setPaymentDetails] = useState<any>([])

  const DarkCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.grey[400],
    padding: 8
  }))

  const columns: GridColumns<any> = [
    {
      minWidth: 76,
      flex: 0.1,
      field: 'year',
      headerName: 'Year'
    },
    {
      minWidth: 150,
      flex: 0.15,
      field: 'course',
      headerName: 'Module Code',
      renderCell: ({ value }) => value?.code
    },
    {
      minWidth: 270,
      flex: 0.15,
      field: 'courseName',
      headerName: 'Module Name',
      renderCell: ({ row }) => row?.course?.name
    },
    {
      minWidth: 170,
      flex: 0.1,
      field: 'finalAssessment',
      headerClassName: 'digital-assessment',
      cellClassName: 'digital-assessment',
      renderHeader: () => (
        <Typography sx={{ color: theme => theme.palette.common.white }}>Digital Assessment</Typography>
      )
    },
    {
      minWidth: 130,
      flex: 0.1,
      field: 'finalAssignments',
      headerClassName: 'assignments',
      cellClassName: 'assignments',
      renderHeader: () => <Typography sx={{ color: theme => theme.palette.common.white }}>Assignments</Typography>
    },
    {
      minWidth: 130,
      flex: 0.1,
      field: 'finalExamination',
      headerClassName: 'examination',
      cellClassName: 'examination',
      renderHeader: () => <Typography sx={{ color: theme => theme.palette.common.white }}>Examination</Typography>
    },
    {
      minWidth: 120,
      flex: 0.1,
      field: 'total',
      headerClassName: 'total',
      cellClassName: 'total',
      renderHeader: () => <Typography sx={{ color: theme => theme.palette.common.white }}>Total(100%)</Typography>,
      renderCell: ({ value }) => (value === 0 || value === null ? '-' : value)
    },
    {
      minWidth: 100,
      flex: 0.1,
      field: 'symbol',
      headerName: 'Symbol'
    },
    {
      minWidth: 100,
      flex: 0.1,
      field: 'status',
      headerName: 'Status'
    }
  ]
  const getFinedtechdetails = async (studentCode: string) => {
    const result = await FinanceService?.getFinedtechdetails(studentCode)
    if (result) {
      setPaymentDetails(result)
    }
  }

  React.useEffect(() => {
    getFinedtechdetails(studentData?.application?.lead?.studentCode)
  }, [studentData])
  if (studentData?.application?.id) {
    const { lead, education, agent } = studentData.application
    const { academic } = studentData
    const { masterCommonData } = CommonCustomHook()

    return (
      <React.Fragment>
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
                  <Typography variant='h6'>{getName(masterCommonData?.race, lead?.race)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Home Language</label>
                  <Typography variant='h6'>{getName(masterCommonData?.language, lead?.language)}</Typography>
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
                              {lead?.nationalityStatus
                                ? getName(masterCommonData?.nationalityStatus, lead?.nationalityStatus)
                                : '-'}
                            </span>
                          </Box>
                        </Typography>
                      </Grid>
                      {lead?.nationalityStatus === 'PRSA' || lead?.nationalityStatus === 'SA' ? (
                        <Grid item xs={4}>
                          <label>Permanent Resident</label>
                          <Typography variant='h6'>
                            {lead?.permenantResident
                              ? getName(masterCommonData?.nationality, lead?.permenantResident)
                              : '-'}
                          </Typography>
                        </Grid>
                      ) : null}

                      <Grid item xs={4}>
                        <label>Nationality</label>
                        <Typography variant='h6'>
                          {getName(masterCommonData?.nationality, lead?.nationality)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <label>ID Document Type / ID No</label>
                        <Typography variant='h6'>
                          {`${getName(masterCommonData?.identificationType, lead?.identificationDocumentType)} / ${
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
                          <Typography variant='h6'>{getName(masterCommonData?.country, item?.country)}</Typography>
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
              <Grid container rowGap={5}>
                <Grid item xs={4}>
                  <label>Interested Qualification</label>
                  <Typography>{getName(masterCommonData?.programList, education?.programCode)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Student Type</label>
                  <Typography variant='h6'>
                    {getName(masterCommonData?.studentTypes, education?.studentTypeCode)}
                  </Typography>
                </Grid>
                {education?.studyModeCode && (
                  <Grid item xs={4}>
                    <label>Study Mode</label>
                    <Typography variant='h6'>
                      {getName(masterCommonData?.studyModes, education?.studyModeCode)}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <label>Highest Qualification</label>
                  <Typography variant='h6'>
                    {getName(masterCommonData?.qualificationList, education?.qualificationCode)}
                  </Typography>
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
                    <Typography variant='h6'>
                      {getName(masterCommonData?.socialMedia, education?.socialMediaCode)}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
              {education?.programCode == DBMCode && (
                <Grid sx={{ mt: 6 }}>
                  <DarkCard>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <label>NQF Level </label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {studentData?.application?.eligibility?.highestNqfLabel
                            ? studentData?.application?.eligibility?.highestNqfLabel
                            : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <label>% of Marks</label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {studentData?.application?.eligibility?.marks
                            ? studentData?.application?.eligibility?.marks
                            : '-'}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <label>Access Program Required?</label>
                        <Typography sx={{ color: 'white' }} variant='h6'>
                          {studentData?.application?.eligibility != null
                            ? studentData?.application?.eligibility?.accessProgram
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
              <RplStatus data={studentData} getEnrolmentDetailById={() => null} disable={true} />
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
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <ApplicationSearchTable
                  data={studentData?.document}
                  documentTypeList={masterCommonData?.documentTypeList}
                  studentCode={studentData?.application?.lead?.studentCode}
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
                  <CommonDueAmount studentData={studentData} />
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

        {academic && (
          <Card sx={{ mt: 4.5, mb: 0 }}>
            <Accordion expanded={academicRecordExpand}>
              <AccordionSummary
                expandIcon={
                  <h1
                    onClick={() => {
                      if (academicRecordExpand === true) {
                        setAcademicRecordExpand(false)
                      } else if (academicRecordExpand === false) {
                        setAcademicRecordExpand(true)
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
                      if (academicRecordExpand === true) {
                        setAcademicRecordExpand(false)
                      } else if (academicRecordExpand === false) {
                        setAcademicRecordExpand(true)
                      }
                    }}
                  >
                    <h3 className='mt-0 d-flex'>
                      <NotebookPlusOutline sx={{ mr: 2 }} color='primary' />
                      Academic Records
                    </h3>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <TableCard>
                  <DataGrid
                    autoHeight
                    disableColumnMenu
                    disableColumnFilter
                    disableColumnSelector
                    rows={academic}
                    columns={columns}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0, backgroundColor: '#d4d4d4' } }}
                    disableSelectionOnClick
                  />
                </TableCard>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}
      </React.Fragment>
    )
  } else {
    return <FallbackSpinner />
  }
}

export default PreviewCard
