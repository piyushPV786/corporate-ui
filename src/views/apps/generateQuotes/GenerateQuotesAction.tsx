import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { TrayArrowDown } from 'mdi-material-ui'
import { useTheme } from '@mui/material/styles'
import { CommonService } from 'src/service'
import { status, messages } from 'src/context/common'
import { useEffect, useState } from 'react'
import { errorToast, successToast } from 'src/components/Toast'
import { downloadFile } from 'src/utils'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

interface GenerateQuotesActionProps {
  onSubmit: () => void
  activityTimeline: string | null
  setActivityTimeline: React.Dispatch<React.SetStateAction<string | null>>
  resetForm: boolean
  formData: any
  generateBtnEnable: boolean
}

const GenerateQuotesAction: React.FC<GenerateQuotesActionProps> = ({
  onSubmit,
  activityTimeline,
  setActivityTimeline,
  resetForm,
  formData,
  generateBtnEnable
}) => {
  const [quoteHistory, setQuoteHistory] = useState<any[]>([])

  useEffect(() => {
    if (resetForm) {
      setQuoteHistory([])
    }
  }, [resetForm])

  useEffect(() => {
    if (activityTimeline) {
      getAuditLogs(activityTimeline)
      setActivityTimeline(null)
    }
  }, [activityTimeline])

  const getAuditLogs = async (studentCode: string) => {
    const response = await CommonService.getActivityTimelineData({ actionBy: studentCode, action: 'Quote generated' })
    if (status.successCodeArr.includes(response?.statusCode) && response?.data?.length) {
      const quoteHistory = response?.data?.reverse()
      const quoteHistoryData = structureQuoteHistory(quoteHistory)
      setQuoteHistory(quoteHistoryData)
    }
  }

  const structureQuoteHistory = (quoteHistory: any) => {
    return quoteHistory.map((item: any) => {
      item.actionDetails = JSON.parse(item?.actionDetails)

      return {
        invoiceCode: item?.applicationCode,
        date: new Date(item?.createdAt).toLocaleDateString(),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        actionBy: `${item?.actionDetails?.educationalConsultant}`,
        actionName: `${item?.actionDetails?.programCode}-${item?.actionDetails?.studyModeCode}-${item?.actionDetails?.paymentMode}`,
        studentCode: `${item?.actionDetails?.studentCode}`,
        fileName: `${item?.actionDetails?.fileName}`
      }
    })
  }

  const handleOnDownloadClick = async (fileName: string, studentCode: string, name: string) => {
    const downloadedTranscript = await CommonService.getFileUrl(fileName, studentCode)
    if (downloadedTranscript?.status == status.successCode) {
      downloadFile(downloadedTranscript?.data?.data, fileName)
      successToast(`${formData.firstName} ${formData.lastName}'s ${name} quote downloaded sucessfully`)
    } else {
      errorToast(messages.error)
    }
  }

  const createDownloadClickHandler = (fileName: string, studentCode: string, name: string) => () =>
    handleOnDownloadClick(fileName, studentCode, name)

  const Classes = {
    height: 30,
    width: 30,
    backgroundColor: '#83e5422b',
    borderRadius: '50%',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const theme = useTheme()

  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.generateQuote,
    PermissionsCodes.full,
    moduleKeys.sales
  )

  return (
    <Grid container ml={4}>
      <Grid item sx={{ float: 'right' }}>
        <Card sx={{ mb: 8, padding: '16px 18px' }}>
          <Grid>
            <Button
              variant='contained'
              onClick={onSubmit}
              type='button'
              disabled={!generateBtnEnable || !fullPermission}
              sx={{
                fontSize: '10px', // Increase font size
                padding: '12px 80px' // Increase padding
              }}
            >
              Generate Quote
            </Button>
          </Grid>
        </Card>
        <Card sx={{ mb: 8, padding: '16px 18px' }}>
          <Grid container sx={{ display: 'flex' }} spacing={2}>
            <Grid item>
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/quote-history.svg`}
                alt=''
              />
            </Grid>
            <Grid item>
              <h4 className='mt-0 d-flex'>Quote History</h4>
            </Grid>
          </Grid>
          <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {quoteHistory?.map((auditLogObject, key) => (
              <Grid item key={key} xs={12} sx={{ mr: 2 }}>
                <Card key={auditLogObject?.invoiceCode} sx={{ backgroundColor: theme.palette.grey[100], padding: 3 }}>
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography sx={{ fontSize: 'small' }}>{auditLogObject?.actionName}</Typography>
                      <Box sx={{ fontStyle: 'italic' }}>
                        <Typography variant='caption'> By: </Typography>
                        <Typography variant='caption' sx={{ fontWeight: 'bold' }}>
                          {auditLogObject?.actionBy}
                        </Typography>
                      </Box>
                      <Box sx={{ color: theme.palette.grey[700] }}>
                        <Typography variant='caption'>{auditLogObject?.date} </Typography>
                        <Typography variant='caption'>&nbsp;{auditLogObject?.time} </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Box
                        onClick={createDownloadClickHandler(
                          auditLogObject?.fileName,
                          auditLogObject?.studentCode,
                          auditLogObject?.actionName
                        )}
                        sx={Classes}
                      >
                        <TrayArrowDown sx={{ color: theme.palette.primary.main, cursor: 'pointer' }} />
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
            {quoteHistory?.length <= 0 && (
              <Grid item xs={12} sx={{ mr: 2 }}>
                <Typography
                  variant='body2'
                  sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', color: 'text.disabled' }}
                >
                  {' '}
                  No Data Yet
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default GenerateQuotesAction
