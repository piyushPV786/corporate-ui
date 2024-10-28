// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Account from 'mdi-material-ui/Account'
import DialogPersonalInfo from 'src/views/pages/dialog/StudentPresonalInfo'
import EducationDialog from 'src/views/pages/dialog/StudentEducationInfo'
import AddressDialogue from 'src/views/pages/dialog/StudentAddressInfo'
import ContactDialog from 'src/views/pages/dialog/StudentContactInfo'
import { CommonService, StudentService } from 'src/service'
import { status } from 'src/context/common'
import { useState, useEffect } from 'react'
import { AccountDetails, CardAccountDetailsOutline, SchoolOutline } from 'mdi-material-ui'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import FallbackSpinner from 'src/@core/components/spinner'
import { DocumentDetail } from '../addstudent/documentDetails'
import { IdocumentDataType } from 'src/types/apps/invoiceTypes'
import { IListOfCommonTypes } from 'src/types/apps/dataTypes'
import { downloadFile, getName } from 'src/utils'
import { IProjectStudentTypes } from 'src/types/apps/projectTypes'

type Props = {
  studentId: number
  studentDetail: IProjectStudentTypes
  getStudentDetailById: () => void
  projectCode: string
}

const PreviewCard = ({ studentId, studentDetail, getStudentDetailById, projectCode }: Props) => {
  const [studentInfoExpand, setStudentInfoExpand] = useState<boolean>(true)
  const [educationInfoExpand, setEducationInfoExpand] = useState<boolean>(true)
  const [addressInfoExpand, setAddressInfoExpand] = useState<boolean>(true)
  const [selectedDocument, setSelectedDocument] = useState<Array<IdocumentDataType>>([])
  const [listOf, setListOf] = useState<IListOfCommonTypes>({
    race: [],
    language: [],
    nationality: [],
    gender: [],
    citizenship: [],
    socioeconomic: [],
    disability: [],
    country: [],
    highestQualification: [],
    idType: [],
    year: []
  })

  const getCommonList = async () => {
    const response = await Promise.all([
      CommonService.getRace(),
      CommonService.getLanguage(),
      CommonService.getNationalityList(),
      CommonService.getGenderList(),
      CommonService.getCitizenShipList(),
      CommonService.getSocioEconomicList(),
      CommonService.getDisability(),
      CommonService.getCountryLists(),
      CommonService.getHighestQualification(),
      CommonService.identificationType({ projectIdentificationType: true }),
      CommonService.getYear()
    ])
    if (!!response?.length) {
      Object.keys(listOf).map((element, index) =>
        setListOf(prev => ({
          ...prev,
          [element]: response[index]?.data?.data ?? []
        }))
      )
    }
  }

  const deleteDocument = async (id: number | string, documentCode: string) => {
    await StudentService.deleteProjectStudent(id, documentCode)
  }

  const documentDelete = () => {
    selectedDocument?.map(item => {
      item?.code && deleteDocument(studentDetail?.code, item?.code)
    })
    getStudentDetailById()
  }

  const downloadDocument = async (fileName: string) => {
    //Need to change the api in future as it is for studentcode
    const result = await CommonService.getFileUrl(fileName, projectCode)
    downloadFile(result?.data?.data, fileName)
  }
  const getFileUrl = async () => {
    await Promise.all(
      selectedDocument?.map(item => {
        return downloadDocument(`${item?.code}.${item?.fileExtension?.split('/')?.pop()?.trim()}`)
      })
    )
    setSelectedDocument([])
  }

  const onSubmitdocument = async (payload: any) => {
    const documentResponse = await StudentService?.addProjectStudentDocument(payload, studentDetail?.code)
    if (documentResponse?.status === status.successCodeOne) {
      const fileName = `${documentResponse?.data?.data?.code}.${payload.file.type.split('/').pop()}`

      //Need to change the api in future as it is for studentcode
      const response = await CommonService?.documentUpload({
        filename: fileName,
        filetype: payload.file.type,
        file: payload.file,
        studentCode: projectCode
      })
      if (response) {
        getStudentDetailById()
      } else {
        deleteDocument(studentDetail?.code, documentResponse?.data?.data?.code)
      }
    }
  }

  useEffect(() => {
    if (studentId) {
      getCommonList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  if (!!studentDetail) {
    return (
      <Box>
        <Grid container rowSpacing={10}>
          <Grid item xs={6}>
            <Typography className='page-header'>
              <Box sx={{ pl: 3, pb: 5 }}>
                <Typography variant='h5' gutterBottom>
                  View/Manage Student
                </Typography>
                <Typography
                  variant='h6'
                  sx={{
                    '& .breadcrumb': {
                      color: theme => theme.palette.primary.main
                    }
                  }}
                >
                  <span className='breadcrumb'>Dashboard /Project Management / MMl: FLP 2023</span> /
                  {`${studentDetail.firstName} ${studentDetail.lastName}`}
                </Typography>
              </Box>
            </Typography>
          </Grid>
        </Grid>
        <Card sx={{ mt: 4.5, mb: 0 }}>
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
                <Grid item className='text-right'>
                  <DialogPersonalInfo
                    studentData={studentDetail}
                    getStudentDetailById={getStudentDetailById}
                    listOf={listOf}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10}>
                <Grid item xs={4}>
                  <label>First Name</label>
                  <Typography>{studentDetail?.firstName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Middle Name</label>
                  <Typography>{studentDetail?.middleName || '-'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Last Name</label>
                  <Typography>{studentDetail?.lastName || ''}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Gender</label>
                  <Typography>{getName(listOf?.gender, studentDetail?.gender)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Date of Birth</label>
                  <Typography>{new Date(studentDetail?.dateOfBirth).toLocaleDateString('es-CL')}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Nationality</label>
                  <Typography>{getName(listOf?.nationality, studentDetail?.nationality)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Citizenship</label>
                  <Typography>{getName(listOf?.citizenship, studentDetail?.citizenship)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Race/ Equity Code</label>
                  <Typography>{getName(listOf?.race, studentDetail?.race)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Home Language</label>
                  <Typography>{getName(listOf?.language, studentDetail?.homeLanguage)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Socio Economic Status code</label>
                  <Typography> {getName(listOf?.socioeconomic, studentDetail?.socioEconomicStatusCode)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Disability</label>
                  <Typography>{getName(listOf?.disability, studentDetail?.disability)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Medical Issue</label>
                  <Typography>{studentDetail?.medicalIssueIfAny ? 'Yes' : 'No'}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
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
                    <AccountDetails sx={{ mr: 2 }} color='primary' />
                    Contact Details
                  </h3>
                </Grid>
                <Grid item className='text-right'>
                  <ContactDialog studentData={studentDetail} getStudentDetailById={getStudentDetailById} />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10}>
                <Grid item xs={4}>
                  <label>Email</label>
                  <Typography>{studentDetail?.email}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Contact Number</label>
                  <Typography>{studentDetail?.contactNumber}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Alternative Number</label>
                  <Typography>{studentDetail?.alternativeContact ?? '-'}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <label>Home Phone</label>
                  <Typography>{studentDetail?.homePhone ?? '-'}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <label>WhatsApp Number</label>
                  <Typography>{studentDetail?.whatsappNumber ?? '-'}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
        <Card sx={{ mt: 4.5, mb: 0 }}>
          <Accordion expanded={addressInfoExpand}>
            <AccordionSummary
              expandIcon={
                <h1
                  onClick={() => {
                    if (addressInfoExpand === true) {
                      setAddressInfoExpand(false)
                    } else if (addressInfoExpand === false) {
                      setAddressInfoExpand(true)
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
                    if (addressInfoExpand === true) {
                      setAddressInfoExpand(false)
                    } else if (addressInfoExpand === false) {
                      setAddressInfoExpand(true)
                    }
                  }}
                >
                  <h3 className='mt-0 d-flex'>
                    <CardAccountDetailsOutline sx={{ mr: 2 }} color='primary' />
                    National ID and Address
                  </h3>
                </Grid>
                <Grid item xs={4} className='text-right'>
                  <AddressDialogue
                    studentData={studentDetail}
                    getStudentDetailById={getStudentDetailById}
                    listOf={listOf}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                  <label>Street Address</label>
                  <Typography>{studentDetail?.streetAddress}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Town</label>
                  <Typography>{studentDetail?.town}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Suburb</label>
                  <Typography>{studentDetail?.suburb}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Country</label>
                  <Typography>{getName(listOf?.country, studentDetail?.country)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Province</label>
                  <Typography>{studentDetail?.province}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Zip Code</label>
                  <Typography>{studentDetail?.zipCode}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    py={2}
                    px={6}
                    rowSpacing={4}
                    sx={{ backgroundColor: theme => theme.palette.grey[200], borderRadius: 2 }}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h6'>
                        <strong>National ID</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>ID Type</label>
                      <Typography>{getName(listOf?.idType, studentDetail?.idType)}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>ID No</label>
                      <Typography>{studentDetail?.idNo}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>

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
                    <SchoolOutline sx={{ mr: 2 }} color='primary' />
                    Education Details
                  </h3>
                </Grid>
                <Grid item className='text-right'>
                  <EducationDialog
                    studentData={studentDetail}
                    getStudentDetailById={getStudentDetailById}
                    listOf={listOf}
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={10}>
                <Grid item xs={6}>
                  <label>Highest Qualification</label>
                  <Typography>{getName(listOf?.highestQualification, studentDetail?.highestQualification)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <label>Completed Year</label>
                  <Typography>{studentDetail?.highestQualificationCompletedYear}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
        <Card sx={{ mt: 4.5, mb: 0 }}>
          <DocumentDetail
            addAllProjectStudentDocumentApi={onSubmitdocument}
            documentData={studentDetail?.documents?.data ?? []}
            documentDelete={documentDelete}
            documentDownload={getFileUrl}
            setSelectedDocument={setSelectedDocument}
            studentCode={projectCode}
            isDownloadable
          />
        </Card>
      </Box>
    )
  } else {
    return <FallbackSpinner />
  }
}

export default PreviewCard
