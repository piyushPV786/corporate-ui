// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/applicationSearch/preview/PreviewCard'
import PreviewActions from 'src/views/apps/applicationSearch/preview/PreviewActions'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import { AggregatorService, ApplyService } from 'src/service'
import FallbackSpinner from 'src/@core/components/spinner'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import {
  StudentTypesEnums,
  isBursaryApplicationStatus,
  messages,
  studentApplicationAllStatus,
  studentApplicationSubStatus
} from 'src/context/common'
import { useRouter } from 'next/router'
import { IStudenData } from 'src/views/pages/dialog/CourseDetails'
import { fetchStateList } from 'src/utils'
import { Star } from 'mdi-material-ui'
import { errorToast } from 'src/components/Toast'
import BursaryApplicationLabel from 'src/components/BursaryApplicationLabel'

interface propsType {
  id: string
}

const InvoicePreview = ({ id }: propsType) => {
  const router = useRouter()
  const [data, setData] = useState<IStudenData>()
  const getApplicationDetails = async () => {
    const appDetails = await ApplyService?.getStudentDetailAppCode(id)

    await getStudentDetailById(appDetails?.lead?.studentCode)
  }
  const getStudentDetailById = async (appCode: string) => {
    const response = await AggregatorService.getStudentDetailsById(appCode, id)
    if (response?.data?.statusCode === 200 && response.data.data) {
      const studentData = response.data?.data?.data
      const addressData = await fetchStateList(studentData?.application?.address)
      setData({
        ...studentData,
        address: addressData
      })
    } else {
      errorToast(messages.error)
    }
  }

  useEffect(() => {
    !!id && getApplicationDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  const isBursary =
    !!data &&
    (isBursaryApplicationStatus.includes(data?.application?.status) ||
      data?.application?.education?.studentTypeCode === StudentTypesEnums.bursary)

  return !!data ? (
    <Grid container columnSpacing={6} rowGap={2}>
      <Grid item xs={9}>
        <Grid container>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={12}>
                <Typography className='preview page-header'>
                  Student ID {`#${data?.application?.lead?.studentCode} `}
                  <Chip
                    label={
                      !!data?.application?.subStatus
                        ? `${studentApplicationAllStatus[data?.application?.status]}-${studentApplicationSubStatus[data?.application?.subStatus] ?? data?.application?.subStatus}`
                        : studentApplicationAllStatus[data?.application?.status]
                    }
                    color='warning'
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <DynamicBreadcrumb asPath={router.asPath} code={data?.application?.applicationCode} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} display='flex' alignItems='end'>
            <Grid container justifyContent='end' columnGap={3}>
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
                >
                  <Box>
                    <IconButton size='small' color='warning'>
                      {data?.application?.lead?.student?.VIPType === 'VIP' ? (
                        <Star />
                      ) : data?.application?.lead?.student?.VIPType === 'VVIP' ? (
                        <>
                          <Star />
                          <Star />
                        </>
                      ) : (
                        <>
                          <Star />
                          <Star />
                          <Star />
                        </>
                      )}
                    </IconButton>
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
        <PreviewCard studentData={data} />
      </Grid>
      <Grid item xl={3} md={3} xs={12}>
        <Box className='sticky-sidebar'>
          <PreviewActions data={data} getApplicationDetails={getApplicationDetails} />
        </Box>
      </Grid>
    </Grid>
  ) : (
    <FallbackSpinner />
  )
}

export default InvoicePreview
