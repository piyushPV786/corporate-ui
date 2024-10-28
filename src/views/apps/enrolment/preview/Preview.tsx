// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/enrolment/preview/PreviewCard'
import PreviewActions from 'src/views/apps/enrolment/preview/PreviewActions'
import { AggregatorService, ApplyService, StudentService } from 'src/service'
import {
  StudentTypesEnums,
  documentStatus,
  isBursaryApplicationStatus,
  messages,
  status,
  studentApplicationAllStatus,
  studentApplicationSubStatus
} from 'src/context/common'
import { Fragment, useEffect, useState } from 'react'
import { successToast } from 'src/components/Toast'
import { Backdrop, Box, Chip, Typography } from '@mui/material'
import FallbackSpinner from 'src/@core/components/spinner'
import { ConfirmationDialog } from 'src/components/Dialog'
import { documentType } from 'src/types/apps/invoiceTypes'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { useRouter } from 'next/router'
import _ from 'lodash'
import { fetchStateList } from 'src/utils'
import VipTag from 'src/views/apps/VipTag/index'
import BursaryApplicationLabel from 'src/components/BursaryApplicationLabel'

interface propsType {
  id: number
}
const nonApprovableStatus = [
  'APP-ENROLLED',
  'APP-DOC-VER-PEND',
  'APP-FEE-PEND',
  'INTAKE-ASSIGNED',
  'INTAKE-ASSIGNMENT-PEND',
  'PROG-ADMITTED',
  'RESUB-APP-DOC',
  'ENRL-ACCEPTED'
]
const totalDocumentsStatus = ['SALES_APPROVED', 'ADMISSION_APPROVED', 'SALES_REJECT', 'ADMISSION_REJECT']
const approvedDocumentsStatus: Array<string> = [documentStatus.admissionApproved, documentStatus.salesApproved]
const rejectedDocumentStatus: Array<string> = [documentStatus.salesReject]

const InvoicePreview = ({ id }: propsType) => {
  const router = useRouter()
  const [data, setData] = useState<null | any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [confirm, setConfirm] = useState<boolean>(false)
  const [isApproveDisabled, setIsApproveDisabled] = useState<boolean>(false)
  const [appCode, setAppCode] = useState([])

  const getEnrolmentDetailById = async () => {
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
  const getApplicationDetail = async (leadCode: string) => {
    const appDetails = await ApplyService?.getApplicationDetails(leadCode)
    setAppCode(appDetails)
  }

  const enrollmentApprove = async (id: number | string) => {
    setLoading(true)
    setConfirm(false)
    const result = await StudentService.approveEnrollment(id)
    if (result?.status === status.successCodeOne) {
      getEnrolmentDetailById()
      successToast(`${id} ${messages.enrolAccept}`)
      setConfirm(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (_.isEmpty(data)) {
      getEnrolmentDetailById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approve = () => {
    setConfirm(!confirm)
  }

  const approveSubmit = () => {
    enrollmentApprove(id)
  }
  const approveCancel = () => {
    setConfirm(false)
  }

  const disableApprove = () => {
    const filterDocuments: Array<documentType> = data?.document?.filter(
      (item: documentType) => totalDocumentsStatus.includes(item?.status) || item.documentTypeCode === 'QUOTE'
    )
    const approvedDocuments = filterDocuments?.filter(item => approvedDocumentsStatus.includes(item?.status))
    const rejectedDocuments = filterDocuments?.filter(item => rejectedDocumentStatus.includes(item?.status))
    const filterRejected = rejectedDocuments?.filter(
      item2 => !approvedDocuments.find(item1 => item1.documentTypeCode === item2.documentTypeCode)
    )
    if (nonApprovableStatus.includes(data?.application?.status)) {
      setIsApproveDisabled(true)
    } else if (filterDocuments?.length === data?.document?.length && filterRejected?.length === 0) {
      setIsApproveDisabled(false)
    } else {
      setIsApproveDisabled(true)
    }
  }
  useEffect(() => {
    disableApprove()
    data?.application?.lead && getApplicationDetail(data?.application?.lead?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  const isBursary =
    isBursaryApplicationStatus.includes(data?.application?.status) ||
    data?.application?.education?.studentTypeCode === StudentTypesEnums.bursary

  return _.isEmpty(data) ? (
    <FallbackSpinner />
  ) : (
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
                    Student Id {`#${data?.application?.lead?.studentCode}`}
                    <Chip
                      size='small'
                      color='warning'
                      label={
                        !!data?.application?.subStatus
                          ? `${studentApplicationAllStatus[data?.application?.status]}-${studentApplicationSubStatus[data?.application?.subStatus] ?? data?.application?.subStatus}`
                          : studentApplicationAllStatus[data?.application?.status]
                      }
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <DynamicBreadcrumb asPath={router.asPath} code={data?.application?.applicationCode} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} display='flex' alignItems='end'>
              <Grid container justifyContent='end' columnGap={3} direction='row' flexWrap='nowrap'>
                {isBursary ? <BursaryApplicationLabel /> : null}
                {isBursary && data?.application?.lead?.student?.VIPType !== null ? (
                  <Grid item borderRight={theme => `2px solid ${theme.palette.grey[500]}`} />
                ) : null}

                {data?.application?.lead?.student?.VIPType && data?.application?.lead?.student?.VIPType !== null ? (
                  <Grid
                    item
                    display='flex'
                    alignItems='center'
                    style={{ backgroundColor: '#1f2b37', borderRadius: '10px' }}
                    pl={3}
                    pr={3}
                  >
                    <Box>
                      <VipTag VIPType={data?.application?.lead?.student?.VIPType} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant='body2' color='white'>
                        {data?.application?.lead?.student?.VIPType}
                      </Typography>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xl={9} md={9} xs={12}>
          <PreviewCard id={id} getEnrolmentDetailById={getEnrolmentDetailById} setLoading={setLoading} data={data} />
        </Grid>
        <Grid item xl={3} md={3} xs={12}>
          <Box className='sticky-sidebar'>
            <PreviewActions
              approve={approve}
              appCode={appCode}
              isApproveDisabled={isApproveDisabled}
              getEnrolmentDetailById={getEnrolmentDetailById}
              data={data}
            />
          </Box>
        </Grid>
      </Grid>
      <ConfirmationDialog
        show={confirm}
        message={messages.dialogWarningMessage}
        submit={approveSubmit}
        cancel={approveCancel}
      />
    </Fragment>
  )
}

export default InvoicePreview
