// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, InputLabel, Theme, Typography } from '@mui/material'

// ** Custom Service/Components
import { getFullName, getName } from 'src/utils'
import { AcademicService, CommonService, DashboardService } from 'src/service'
import {
  accordionExpandInitialState,
  corporateConstant,
  corporatePreviewNames,
  corporateStudentPreviewCardSections
} from 'src/context/corporateData'

// import Table from 'src/views/apps/roles/Table'
// import { allRoles, documentStatus } from 'src/context/common'
import { ICorporateStudent } from 'src/types/apps/corporatTypes'
import FallbackSpinner from 'src/@core/components/spinner'
import { commonListTypes } from 'src/types/apps/dataTypes'

// ** Icon Imports
import { GridExpandMoreIcon } from '@mui/x-data-grid'

// import { Check, Download, FileDocument } from 'mdi-material-ui'
// import { IdocumentDataType } from 'src/types/apps/invoiceTypes'

interface IPropsTypes {
  studentData: ICorporateStudent
  getCorporateStudentsDetailById: () => void
}

const PreviewCard = ({ studentData }: IPropsTypes) => {
  // const [selectedDocument, setSelectedDocument] = useState<Array<IdocumentDataType>>([])
  // const [selDocument, setSelDocument] = useState<Array<string | number>>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [commonList, setCommonList] = useState<{ [key: string]: Array<commonListTypes> }>()
  const [accordionExpand, setAccordionExpand] = useState<{ [key: string]: boolean }>(accordionExpandInitialState)

  const getCommonList = async () => {
    const [
      nationality,
      race,
      language,
      employeStatus,
      highestQualification,
      gender,
      country,
      states,
      program,
      projectManager,
      accountManager
    ] = await Promise.all([
      CommonService.getNationalityList(),
      CommonService.getRace(),
      CommonService.getLanguage(),
      CommonService.getEmployeStatus(),
      CommonService.getHighestQualification(),
      CommonService.getGenderList(),
      CommonService.getCountryLists(),
      CommonService.getStatesByCountry(studentData?.lead?.address?.[0]?.country),
      AcademicService.getAllProgramList(),
      DashboardService.getCorporateProjectManagerList(),
      DashboardService.getCorporateAccountManagerList()
    ])
    setCommonList(prev => ({
      ...prev,
      nationality: nationality?.data?.data,
      race: race?.data?.data,
      language: language?.data?.data,
      socioEconomicStatusCode: employeStatus?.data?.data,
      qualificationCode: highestQualification?.data?.data,
      gender: gender?.data?.data,
      country: country?.data?.data,
      state: states?.data?.map((state: any) => ({
        ...state,
        code: state.isoCode || state.code
      })),
      program: program?.data?.data,
      projectManager: projectManager?.data?.data,
      accountManager: accountManager?.data?.data
    }))
    setIsLoading(true)
  }
  useEffect(() => {
    getCommonList()
  }, [])

  // const downloadAllFile = async (fileName: string) => {
  //   const result = await CommonService.getFileUrl(fileName, studentData.lead.studentCode)
  //   downloadFile(result?.data?.data, fileName)
  // }
  // const getFileUrl = async () => {
  //   await Promise.all(
  //     selectedDocument?.map(item => {
  //       return downloadAllFile(item?.name)
  //     })
  //   )
  //   setSelDocument([])
  //   setSelectedDocument([])
  // }

  // const documentApprove = async (docStatus: IDocumentsStatusType, comment?: string) => {
  //   const documentPayload: ICorporateStudentDocumentApproveParams[] = []
  //   selectedDocument?.map(item => {
  //     const param = {
  //       docCode: item.code ?? '',
  //       documentTypeCode: item.documentTypeCode ?? '',
  //       status: docStatus,
  //       comments: comment ?? item.comments ?? ''
  //     }
  //     documentPayload.push(param)
  //   })

  //   documentApproveAPI(documentPayload, docStatus)

  //   setSelDocument([])
  //   setSelectedDocument([])
  //   getCorporateStudentsDetailById()
  // }
  const handleExpand = (index: string) => setAccordionExpand(prev => ({ ...prev, [index]: !prev[index] }))

  const lead: Record<string, any> = studentData
  const dateBirth = new Date(lead.lead?.dateOfBirth)
  const address = lead.lead?.address?.[0] || {}

  return isLoading ? (
    <Box>
      {corporateStudentPreviewCardSections.map(section => {
        const parentName = section?.sectionSubItems?.parentName

        return (
          <Accordion
            key={section.id}
            expanded={accordionExpand[section.slug]}
            onClick={() => handleExpand(section.slug)}
            sx={{
              backgroundColor: theme => (section.isDarkBg ? theme.palette.primary.dark : null),
              borderRadius: 1,
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              },
              my: 2
            }}
          >
            <AccordionSummary
              expandIcon={
                <GridExpandMoreIcon
                  sx={{ color: (theme: Theme) => (section.isDarkBg ? theme.palette.common.white : null) }}
                />
              }
            >
              <section.sectionIcon
                fontSize='large'
                color='primary'
                sx={{ color: (theme: Theme) => (section.isDarkBg ? theme.palette.common.white : null), mr: 2 }}
              />
              <Typography variant='h5' sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                {section.sectionTitle}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={8} columnSpacing={3}>
                {section.slug === corporateConstant.address &&
                  !!parentName &&
                  section?.sectionSubItems?.list?.map(item => (
                    <Grid item xs={4} key={item}>
                      <InputLabel sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                        {corporatePreviewNames[parentName][item]}
                      </InputLabel>
                      <Typography sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                        {!!address[item]
                          ? corporateConstant.getNameCommonListArray.includes(item) && !!commonList
                            ? getName(commonList[item], address[item])
                            : address[item]
                          : '-'}
                      </Typography>
                    </Grid>
                  ))}
                {section.slug !== corporateConstant.address && !!parentName
                  ? section?.sectionSubItems?.list?.map(item => (
                      <Grid item xs={4} key={item}>
                        <InputLabel sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                          {corporatePreviewNames[parentName][item]}
                        </InputLabel>
                        <Typography sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                          {!!lead[parentName]?.[item]
                            ? item === corporateConstant.dateOfBirth
                              ? `${dateBirth.getDate()}/${dateBirth.getMonth() + 1}/${dateBirth.getFullYear()}`
                              : item === corporateConstant.mobileNumber
                                ? `+${lead[parentName]['mobileCountryCode']} ${lead[parentName][item]}`
                                : corporateConstant.getNameCommonListArray.includes(item) && !!commonList
                                  ? getName(commonList[item], lead[parentName][item])
                                  : corporateConstant.getFullNameCommonListArray.includes(item) && !!commonList
                                    ? getFullName(commonList[item], lead[parentName][item])
                                    : lead[parentName][item]
                            : '-'}
                        </Typography>
                      </Grid>
                    ))
                  : null}
                {section.sectionItems?.map(item => {
                  return (
                    <Grid item xs={4} key={item}>
                      <InputLabel sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                        {corporatePreviewNames[item]}
                      </InputLabel>
                      <Typography sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                        {item === corporateConstant.dateOfBirth
                          ? ` ${dateBirth.getDate()}/${dateBirth.getMonth()}/${dateBirth.getFullYear()}`
                          : !!lead[item]
                            ? corporateConstant.getNameCommonListArray.includes(item)
                              ? !!commonList
                                ? getName(commonList[item], lead[item])
                                : lead[item]
                              : lead[item]
                            : '-'}
                      </Typography>
                    </Grid>
                  )
                })}
                {!!section?.grayBgItems ? (
                  <Grid item xs={12}>
                    <Grid
                      container
                      rowSpacing={3}
                      sx={{ backgroundColor: theme => theme.palette.grey[200], borderRadius: 1, px: 5, py: 1 }}
                    >
                      <Grid item xs={12}>
                        <Typography variant='h5'>{section.grayBgItems.title}</Typography>
                      </Grid>
                      {!!parentName &&
                        section?.grayBgItems?.sectionSubItems?.list?.map(item => (
                          <Grid item xs={4} key={item}>
                            <InputLabel sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                              {corporatePreviewNames[parentName][item]}
                            </InputLabel>
                            <Typography sx={{ color: theme => (section.isDarkBg ? theme.palette.common.white : null) }}>
                              {!!lead[parentName]?.[item] ? lead[parentName][item] : '-'}
                            </Typography>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )
      })}

      {/* <Accordion
        expanded
        sx={{
          borderRadius: 1,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            justifyContent: 'space-between'
          },
          '& .documentHeader': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
      >
        <AccordionSummary>
          <Box className='documentHeader'>
            <FileDocument color='primary' fontSize='large' />
            <Typography variant='h5'>Documents</Typography>
          </Box>
          <Box className='documentHeader'>
            <CorpStudDocumentReject
              documentApprove={documentApprove}
              data={selectedDocument}
              disabled={!!selectedDocument.length}
            />
            <Button
              sx={{ mx: 2 }}
              variant='contained'
              size='small'
              onClick={() => documentApprove(documentStatus.approved)}
              startIcon={<Check />}
              disabled={!selectedDocument.length}
            >
              Verify
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={getFileUrl}
              startIcon={<Download />}
              disabled={!selectedDocument.length}
            >
              Download
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Table
            role={allRoles.admission}
            selectedDocument={selDocument}
            data={studentData?.documents?.data}
            onSelectionModelChange={(newSelectionModel: Array<string | number>) => {
              setSelDocument(newSelectionModel)
              setSelectedDocument(getSelectedDocument(newSelectionModel, studentData?.documents?.data))
            }}
            selectCriteria={documentStatus.salesApproved.toLowerCase()}
            studentCode={studentData.studentCode}
          />
        </AccordionDetails>
      </Accordion> */}
    </Box>
  ) : (
    <FallbackSpinner />
  )
}

export default PreviewCard
