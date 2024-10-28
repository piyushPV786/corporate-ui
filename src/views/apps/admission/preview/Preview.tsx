// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Backdrop, Box, IconButton, Typography } from '@mui/material'

// ** Custom Components Imports
import PreviewCard from 'src/views/apps/admission/preview/PreviewCard'
import PreviewActions from 'src/views/apps/admission/preview/PreviewActions'
import { ConfirmationDialog } from 'src/components/Dialog'
import {
  DBMCode,
  DocumentType,
  StudentTypesEnums,
  admissionRMAT,
  documentStatus,
  isBursaryApplicationStatus,
  messages,
  status,
  studentApplicationAllStatus
} from 'src/context/common'
import { AggregatorService, StudentService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import FallbackSpinner from 'src/@core/components/spinner'
import { IDocument, IStudenData } from 'src/views/pages/dialog/CourseDetails'
import { IRMATProgramTypes, IResultDetailsTypes } from 'src/types/apps/dataTypes'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import Chip from 'src/@core/components/mui/chip'
import { useRouter } from 'next/router'
import { fetchStateList, toPascalCase } from 'src/utils'
import _ from 'lodash'
import VipTag from '../../VipTag'
import { AlignVerticalBottom, IdCard } from 'mdi-material-ui'
import BursaryApplicationLabel from 'src/components/BursaryApplicationLabel'

interface propsType {
  id: number
}

const approvableDocumentStatus: Array<string> = [
  documentStatus.admissionApproved,
  documentStatus.salesApproved,
  documentStatus.admissionReject,
  documentStatus.salesReject
]
const rejectedDocumentStatus: Array<string> = [documentStatus.salesApproved]
const nonApprovableStatus = [
  'APP-ENROLLED',
  'APP-REJECTED',
  'PROG-ADMITTED',
  'APP-DOC-VER-PEND',
  'ENRL-ACCEPTED',
  'INTAKE-ASSIGNMENT-PEND',
  'INTAKE-ASSIGNED',
  'APP-DOC-UPLOADED',
  'RESUB-APP-DOC'
]

const Preview = ({ id }: propsType) => {
  const [confirm, setConfirm] = useState<boolean>(false)
  const [data, setData] = useState<IStudenData>()
  const [examDetails, setExamDetails] = useState<IResultDetailsTypes>()
  const [rmatProgram, setRmatProgram] = useState<IRMATProgramTypes>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isDocumentApproved, setIsDocumentApproved] = useState<boolean>(false)
  const [AllRMATProg, setAllRMATProg] = useState<IRMATProgramTypes[]>([])
  const router = useRouter()
  const applicationCode = data?.application ? data?.application?.applicationCode : ''
  const progCode = data?.application?.education?.programCode
  const eligibility = data?.application?.eligibility
  const conditionBasedApproveButton = () => {
    if (isDocumentApproved) {
      if (!!data?.application?.status && nonApprovableStatus.includes(data?.application?.status)) {
        return true
      } else if (progCode === DBMCode && !eligibility) {
        return true
      } else if (rmatProgram?.isActive && !rmatProgram?.isOptional) {
        const result = _.last(examDetails?.exam)?.result

        if (!!result) {
          return result === admissionRMAT.fail
        } else if (!!data?.application?.status && admissionRMAT.passFailRMAT.includes(data?.application?.status)) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      return true
    }
  }

  const getStudentDetailById = async () => {
    const response = await AggregatorService.getEnrollStudentDetails(id)

    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      const studentData = response.data?.data?.data
      const addressData = await fetchStateList(studentData?.application?.address)
      setData({
        ...studentData,
        address: addressData
      })
    }
  }

  const checkIsRmatRequired = async (programCode: string) => {
    const response = await StudentService.checkIsRmatRequired(programCode)

    if (response?.statusCode === status.successCode) {
      if (response?.data?.length > 0) {
        setRmatProgram(response.data[0])
      }
      setAllRMATProg(response?.data)
    }
  }
  const IsRMATPassFail = async (RmatStatus: string) => {
    const response = await StudentService.RMATPassFail(applicationCode, RmatStatus)
    if (response?.statusCode === status?.successCode) {
      getStudentDetailById()
    }
  }
  const checkRmatResult = async (applicationCode: string) => {
    const response = await StudentService.getRmatExamDetails(applicationCode)

    if (response?.statusCode === status.successCode && !!response?.data) {
      getStudentDetailById()
    }
  }

  const sendRmatLink = async (applicationCode: string, RMATprog: string) => {
    const response = await StudentService.sendRmatLink(applicationCode, RMATprog)

    if (response?.statusCode === status.successCodeOne) {
      successToast(admissionRMAT.successSentRMAT)
    } else {
      errorToast(messages.error)
    }
    getStudentDetailById()
  }

  const approve = () => {
    setConfirm(!confirm)
  }

  const getData = async () => {
    await getStudentDetailById()
    const education = data?.application?.education

    education && checkIsRmatRequired(education?.programCode)
  }
  const enrollmentApprove = async (id: number | string) => {
    setLoading(true)
    const result = await StudentService.enrollStudent(id)
    if (result?.status === status.successCodeOne) {
      successToast(`${id} ${messages.acceptLetter}`)
    }
    getData()
    setLoading(false)
  }
  const approveSubmit = () => {
    setConfirm(false)
    enrollmentApprove(id)
  }
  const approveCancel = () => {
    setConfirm(false)
  }

  useEffect(() => {
    if (id) {
      getStudentDetailById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => {
    conditionBasedApproveButton()
    const education = data?.application?.education

    education && !rmatProgram && checkIsRmatRequired(education?.programCode)

    const filterDocuments: Array<IDocument> =
      data?.document?.filter(
        (item: IDocument) => approvableDocumentStatus.includes(item?.status) || item.documentTypeCode === 'QUOTE'
      ) ?? []
    const rejectedDocuments = filterDocuments
      ?.filter(item => rejectedDocumentStatus.includes(item?.status))
      .filter(
        item =>
          item.documentTypeCode !== DocumentType.PaymentProof &&
          item.documentTypeCode !== DocumentType.TermsAndConditions &&
          item.documentTypeCode !== DocumentType.Study_Flexi_Agreement &&
          item.documentTypeCode !== DocumentType.Study_Flexi_Calculation
      )

    setIsDocumentApproved(filterDocuments?.length === data?.document?.length && rejectedDocuments.length === 0)
    const rmat = data?.application?.enrolment?.enrolmentRmat
    !!rmat?.length && setExamDetails(rmat[rmat?.length - 1])
    data && data?.application?.status === admissionRMAT.pending && checkRmatResult(data?.application?.applicationCode)
  }, [data])

  const handleRMATSend = (RMATprog: string) => !!data && sendRmatLink(data?.application?.applicationCode, RMATprog)
  const isBursary =
    !!data &&
    (isBursaryApplicationStatus.includes(data?.application?.status) ||
      data?.application?.education?.studentTypeCode === StudentTypesEnums.bursary)

  if (!!data) {
    return !!id ? (
      <Fragment>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <FallbackSpinner />
        </Backdrop>
        <Grid container columnSpacing={6} rowGap={2}>
          <Grid item xs={9}>
            <Grid container>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography className='page-header'>
                      Student ID {`#${data?.application?.lead?.studentCode} `}
                      <Chip
                        className='header-chip'
                        size='small'
                        color='warning'
                        label={studentApplicationAllStatus[data?.application?.status] ?? data?.application?.status}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <DynamicBreadcrumb asPath={router.asPath} code={data?.application?.applicationCode} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} display='flex' alignItems='end' className='preview-title'>
                <Grid container justifyContent='end' columnGap={3} direction='row' flexWrap='nowrap'>
                  {isBursary ? <BursaryApplicationLabel /> : null}
                  {isBursary && data?.application?.lead?.student?.VIPType !== null ? (
                    <Grid item borderRight={theme => `2px solid ${theme.palette.grey[500]}`} />
                  ) : null}
                  {data?.application?.lead?.student && data?.application?.lead?.student?.VIPType !== null ? (
                    <Grid
                      item
                      display='flex'
                      alignItems='center'
                      style={{ backgroundColor: '#1f2b37', borderRadius: '10px' }}
                      px={3}
                    >
                      <Box className='preview-vip-tags'>
                        <VipTag VIPType={data?.application?.lead?.student?.VIPType} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='body2' color='white'>
                          {data?.application?.lead?.student?.VIPType}
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null}
                  {(data?.creditRisk || data?.affordableRank) &&
                    [
                      typeof data?.creditRisk === 'string' && (
                        <Grid
                          item
                          display='flex'
                          alignItems='center'
                          sx={{
                            backgroundColor: '#1f2b37',
                            borderRadius: '10px'
                          }}
                          px={1}
                          mb={5}
                          key='affordableRank'
                        >
                          <Box>
                            <IconButton size='small' color='warning'>
                              <AlignVerticalBottom sx={{ fontSize: 25 }} />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography fontSize={10} color='white'>
                              AffordabilityRank :-
                            </Typography>
                            <Typography fontSize={12} variant='body2' color='white'>
                              {data?.affordableRank ? toPascalCase(data?.affordableRank) : '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      ),
                      typeof data?.affordableRank === 'string' && (
                        <Grid
                          item
                          display='flex'
                          alignItems='center'
                          sx={{
                            backgroundColor: '#1f2b37',
                            borderRadius: '10px'
                          }}
                          px={1}
                          mb={5}
                          key='creditRisk'
                        >
                          <Box>
                            <IconButton size='small' color='warning'>
                              <IdCard sx={{ fontSize: 25 }} />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography fontSize={10} color='white'>
                              CreditRisk :-
                            </Typography>
                            <Typography fontSize={12} variant='body2' color='white'>
                              {data?.creditRisk ? toPascalCase(data?.creditRisk) : '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      )
                    ].filter(Boolean)}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xl={9} md={9} xs={12}>
            <PreviewCard id={id} data={data} getData={getData} />
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            {data && (
              <Box className='sticky-sidebar'>
                <PreviewActions
                  approve={approve}
                  disable={conditionBasedApproveButton()}
                  isDocumentApproved={isDocumentApproved}
                  handleRMATSend={handleRMATSend}
                  studentData={data}
                  examDetails={examDetails}
                  rmatProgram={rmatProgram}
                  AllRMATProg={AllRMATProg}
                  IsRMATPassFail={IsRMATPassFail}
                  getStudentDetailById={getStudentDetailById}
                />
              </Box>
            )}
          </Grid>
        </Grid>
        <ConfirmationDialog
          show={confirm}
          message={messages.dialogWarningMessage}
          submit={approveSubmit}
          cancel={approveCancel}
        />
      </Fragment>
    ) : (
      <FallbackSpinner />
    )
  } else {
    return <FallbackSpinner />
  }
}

export default Preview
