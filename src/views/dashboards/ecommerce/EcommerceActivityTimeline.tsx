/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { Fragment, useEffect, useState } from 'react'
import { StudentService } from 'src/service'
import { status } from 'src/context/common'
import { useRouter } from 'next/router'
import { IAuditLogsTypes } from 'src/types/apps/common'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { Tune } from 'mdi-material-ui'
import { Grid } from '@mui/material'
import { IsJsonString } from 'src/utils'

const titleColor: IDynamicObject = {
  APPROVED: 'primary.main',
  PENDING: 'warning.main',
  REJECTED: 'error.main'
}
const timelineDotColor: IDynamicObject = {
  APPROVED: 'primary',
  PENDING: 'warning',
  REJECTED: 'error'
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})
interface IEcommerceActivityTimelinePropsTypes {
  data: IDynamicObject
}

const EcommerceActivityTimeline = ({ data }: IEcommerceActivityTimelinePropsTypes) => {
  const [logs, setLogs] = useState<IAuditLogsTypes[]>([])
  const router = useRouter()
  const applicationCode = router?.query?.id || data?.application?.applicationCode
  const getAuditLogs = async () => {
    const response = await StudentService.getActivityTimelineData(String(applicationCode))
    if (status.successCodeArr.includes(response?.statusCode) && !!response?.data?.length) {
      const studentLogs = response?.data?.reverse()
      setLogs(studentLogs)
    }
  }
  const timelineDateFormate = (date: string) => {
    const newDate = new Date(date)

    return `${newDate.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })} ${newDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`
  }

  useEffect(() => {
    !!applicationCode && getAuditLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return logs?.length > 0 ? (
    <Card className='mt-5'>
      <CardHeader className='card-title' title='Activity Timeline' avatar={<Tune />} />
      <CardContent className='activity-scroll' sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        <Timeline
          sx={{ my: 0, py: 0 }}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {logs?.map(element => {
            const actionDetails =
              !!element?.actionDetails && element?.actionDetails !== '' && IsJsonString(element?.actionDetails)
                ? JSON?.parse(element?.actionDetails)
                : null
            const actionByDetails =
              !!element?.actionBy && element?.actionBy !== '' && IsJsonString(element?.actionBy)
                ? JSON.parse(element?.actionBy)
                : null

            return (
              <TimelineItem key={element?.id}>
                <TimelineSeparator>
                  <TimelineDot color={timelineDotColor[element?.actionStatus]} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className='activity' sx={{ mt: 0, mb: theme => `${theme.spacing(3)} !important` }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography color={titleColor[element?.actionStatus]} sx={{ fontWeight: 600 }}>
                      {element?.action}
                    </Typography>
                  </Box>
                  {element?.actionBy ? (
                    actionByDetails?.type === 'STUDENT' ? (
                      <Typography variant='caption'>
                        <em>
                          By: <strong> Student</strong>
                        </em>
                      </Typography>
                    ) : actionByDetails?.type === 'EMPLOYEE' ? (
                      <Typography variant='caption'>
                        <em>
                          By:
                          <strong>
                            {actionByDetails?.username} (
                            {actionByDetails?.roles?.length > 0 ? actionByDetails?.roles?.join() : 'Sales Executive'})
                          </strong>
                        </em>
                      </Typography>
                    ) : null
                  ) : null}
                  {!!actionDetails ? (
                    <Fragment>
                      {actionDetails?.documentTypeCodes?.length > 0 && (
                        <Typography variant='body2' sx={{ fontWeight: 600, marginTop: '1rem' }}>
                          {actionDetails?.documentTypeCodes?.join(', ')}
                          <br />
                        </Typography>
                      )}

                      {actionDetails?.comment ? (
                        <Typography variant='body2'>
                          Rejct Reason : <strong>{actionDetails?.comment}</strong>
                        </Typography>
                      ) : null}

                      {actionDetails?.payment && (
                        <Typography variant='body2' sx={{ fontWeight: 600, marginTop: '1rem' }}>
                          <Grid container spacing={2}>
                            {/* Payment Mode */}
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <span>Payment Mode</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <strong>{actionDetails?.payment?.paymentType}</strong>
                              </Typography>
                            </Grid>

                            {/* Reference/ Trans ID */}
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <span>Reference/ Trans ID</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <strong>
                                  {actionDetails?.payment?.transactionId ||
                                  actionDetails?.payment?.referenceNumber !== null
                                    ? `${actionDetails?.payment?.referenceNumber}/${actionDetails?.payment?.transactionId}`
                                    : '-'}
                                </strong>
                              </Typography>
                            </Grid>

                            {/* Paid Amount */}
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <span>Paid Amount</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={6}>
                              <Typography>
                                <strong>
                                  {actionDetails?.payment?.currencyCode} {actionDetails?.payment?.totalAmount}
                                </strong>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Typography>
                      )}
                    </Fragment>
                  ) : null}
                  <br />
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {timelineDateFormate(element?.createdAt)}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </CardContent>
    </Card>
  ) : null
}

export default EcommerceActivityTimeline
