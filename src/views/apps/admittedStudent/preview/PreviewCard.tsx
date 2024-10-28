// ** Next Import
import { styled, Theme, Tooltip } from '@mui/material'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import DialogForm from 'src/views/pages/dialog/ExemptCourseDialog'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BookEducation from 'mdi-material-ui/BookEducation'
import Account from 'mdi-material-ui/Account'
import { Address, AddressTypeData, status } from 'src/context/common'
import { AcademicService, CommonService, StudentService } from 'src/service'
import React, { useState, useEffect } from 'react'
import FallbackSpinner from 'src/@core/components/spinner'
import { Accordion, AccordionDetails, AccordionSummary, Chip } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { IAcademicApi } from 'src/context/types'
import { CardAccountDetailsOutline, EarthArrowRight, NotebookPlusOutline } from 'mdi-material-ui'
import { ICommonParams } from 'src/types/apps/common'
import { getName, roundToTwoDecimalPlaces } from 'src/utils'
import { IAddressExtendedTypes } from 'src/types/apps/admittedStudent'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'

type Props = /*unresolved*/ any

const PreviewCard = ({ studentData, getStudentData }: Props) => {
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [data, setData] = useState<any>([])
  const [postalInfoExpand, setPostalinfoExpand] = useState<boolean>(true)
  const [residentialInfoExpand, setResidentialinfoExpand] = useState<boolean>(true)
  const [programList, setProgramList] = useState<any[]>([])
  const [edit, setEdit] = useState<boolean>(false)
  const [countryList, setCountryList] = useState<ICommonParams[]>([])
  const [exemptCourseList, setExemptCourseList] = useState<commonListTypes[]>([])
  const [academicRecordExpand, setAcademicRecordExpand] = useState<boolean>(true)

  const academicData = { ...studentData }
  const academics = academicData?.academic?.map(({ course }: any) => course?.code)
  const filteredData = academicData?.academic?.filter(
    ({ course }: any, index: number) => !academics.includes(course?.code, index + 1)
  )

  const exemptedCourse = academicData?.academic?.filter((item: any) => item?.isExempt)

  const courseData = academicData?.academic

  const AcademicTypography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.common.white
  }))

  const getStudentDetailById = async () => {
    let count = 0
    let counter = 0
    studentData?.academic?.forEach((element: IAcademicApi) => {
      if (element.status === 'Exempted') {
        count = count + 1
      }
      counter = counter + 1
    })

    if (count > 0) {
      setEdit(true)
    }
    if (!!exemptCourseList && exemptCourseList?.length > 0) {
      setEdit(true)
    }

    if (counter == studentData?.academic.length) {
      setData(studentData)
    } else {
      setData([])
    }
  }

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }
  const getCountry = async () => {
    const response = await CommonService.getCountryLists()

    setCountryList(response?.data?.data)
  }
  const getExemptedCourses = async () => {
    const response = await StudentService.getExemptCourse(studentData?.application?.applicationCode)

    if (response?.statusCode === status.successCode) {
      setExemptCourseList(response?.data)
    }
  }
  const getData = () => {
    getStudentDetailById()
    getExemptedCourses()
    getStudentData()
  }
  useEffect(() => {
    if (!!studentData) {
      getStudentDetailById()
      getCountry()
      getProgramList()
      getExemptedCourses()
    }
  }, [studentData])

  useEffect(() => {
    if (!!exemptCourseList && exemptCourseList?.length > 0) {
      setEdit(true)
    } else {
      setEdit(false)
    }
  }, [exemptCourseList])

  const TableCard = styled(Card)(() => ({
    '& .digital-assessment': {
      backgroundColor: 'rgba(106, 118, 124, .1)'
    },
    '& .final-digital-assessment': {
      backgroundColor: 'rgba(106, 118, 124, .1)'
    },
    '& .assignments': {
      backgroundColor: 'rgba(42, 107, 100, .1)'
    },
    '& .examination': {
      backgroundColor: 'rgba(91, 70, 78, .1)'
    },
    '& .total': {
      backgroundColor: 'rgba(75, 183, 74, .1)'
    }
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
      renderCell: ({ row }) => (
        <Tooltip title={`${row.course?.name || '-'}`}>
          <Typography variant='body2' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.course?.name ? row.course?.name : '-'}
          </Typography>
        </Tooltip>
      )
    },
    {
      minWidth: 170,
      flex: 0.1,
      field: 'finalAssessment',
      headerClassName: 'digital-assessment',
      cellClassName: 'digital-assessment',
      renderHeader: () => <AcademicTypography>Digital Assessment</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 130,
      flex: 0.1,
      field: 'finalAssignments',
      headerClassName: 'assignments',
      cellClassName: 'assignments',
      renderHeader: () => <AcademicTypography>Assignments</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 130,
      flex: 0.1,
      field: 'finalExamination',
      headerClassName: 'examination',
      cellClassName: 'examination',
      renderHeader: () => <AcademicTypography>Examination</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 120,
      flex: 0.1,
      field: 'finalTotalMarks',
      headerClassName: 'total',
      cellClassName: 'total',
      renderHeader: () => <AcademicTypography>Total(100%)</AcademicTypography>,
      renderCell: ({ row }: any) => {
        return (
          <>
            <Typography variant='body2'>
              {row?.finalAssignments > 0 &&
              row?.finalAssessment > 0 &&
              row?.finalExamination > 0 &&
              row?.finalTotalMarks > 0
                ? roundToTwoDecimalPlaces(row?.finalTotalMarks)
                : '-'}
            </Typography>
          </>
        )
      }
    },
    {
      minWidth: 100,
      flex: 0.1,
      field: 'symbol',
      headerName: 'Symbol',
      renderCell: ({ value }: any) => (value ? (value !== '--' ? value : '-') : '-')
    },
    {
      minWidth: 100,
      flex: 0.1,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ value }: any) => (value ? (value !== '--' ? value : '-') : '-')
    }
  ]

  if (data?.application?.id) {
    const applicationCode = data?.application?.applicationCode
    const { address } = data?.application?.lead

    return (
      <Box>
        {data && (
          <Card sx={{ mb: 0 }}>
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
                      Basic Information
                    </h3>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    <label>First Name</label>
                    <Typography>{data?.application?.lead?.firstName}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Last Name</label>
                    <Typography>{data?.application?.lead?.lastName}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Email</label>
                    <Typography>{data?.application?.lead.email}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Contact Number</label>
                    <Typography>
                      {`+${data?.application?.lead.mobileCountryCode} ${data?.application?.lead.mobileNumber}`}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        <Grid container display='flex' justifyContent='space-between'>
          {address?.length > 0 &&
            address?.map((item: IAddressExtendedTypes) => (
              <Grid key={item.addressType} xs={5.9}>
                <Card key={item.addressType} sx={{ mt: 4.5, mb: 0 }}>
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
                          <Typography variant='h6'>{getName(countryList, item?.country)}</Typography>
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

        {data && (
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
                  <FullPermission featureCode={FeatureCodes.EMS.admittedStudent}>
                    <Grid item className='text-right'>
                      <DialogForm
                        Courses={!!courseData.length ? courseData : []}
                        edit={edit}
                        getStudentDetailById={getData}
                        applicationCode={applicationCode}
                        exemptedCourse={exemptedCourse}
                      />
                    </Grid>
                  </FullPermission>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid item className='text-right'></Grid>
                <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    <label>Qualification Name</label>
                    <Typography> {getName(programList, data.application?.education?.programCode)}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <label>Student Type</label>
                    <Typography>{data.application?.education?.studentTypeCode}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Study Mode</label>
                    <Typography>{data?.application?.education.studyModeCode}</Typography>
                  </Grid>
                  {exemptedCourse.length > 0 ? (
                    <Grid item xs={12}>
                      <label>Exempted Modules</label>
                      <Grid container spacing={1}>
                        {exemptedCourse?.map((item: any) => (
                          <Grid item key={item.id}>
                            <Chip label={item?.course?.name} color='error' />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}

        {data && (
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
                    rows={filteredData}
                    columns={columns}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0, backgroundColor: '#d4d4d4' } }}
                    disableSelectionOnClick
                  />
                </TableCard>
              </AccordionDetails>
            </Accordion>
          </Card>
        )}
      </Box>
    )
  } else {
    return <FallbackSpinner />
  }
}

export default PreviewCard
