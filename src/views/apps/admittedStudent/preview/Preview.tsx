// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import React, { useEffect, useState } from 'react'
import PreviewCard from 'src/views/apps/admittedStudent/preview/PreviewCard'
import PreviewActions from 'src/views/apps/admittedStudent/preview/PreviewActions'
import { Box, IconButton, Typography } from '@mui/material'
import DynamicBreadcrumb from 'src/components/Breadcrumb'
import { useRouter } from 'next/router'
import { IAdmittedStudentTypes } from 'src/types/apps/admittedStudent'
import { AggregatorService, CommonService } from 'src/service'
import _ from 'lodash'
import FallbackSpinner from 'src/@core/components/spinner'
import { fetchStateList, toPascalCase } from 'src/utils'
import DialogStatusHistory from 'src/views/pages/dialog/DialogStatusHistory'
import { IStatusItem } from 'src/types/apps/dataTypes'
import VipTag from 'src/views/apps/VipTag/index'
import { AlignVerticalBottom, IdCard } from 'mdi-material-ui'
import { errorToast } from 'src/components/Toast'
import { messages } from 'src/context/common'

interface propsType {
  id: string
  appCode: string
}

const Preview = ({ id, appCode }: propsType) => {
  const router = useRouter()
  const [studentData, setStudentData] = useState<IAdmittedStudentTypes>()
  const [studentStatus, setStudentStatus] = useState<IStatusItem>()

  const getStudentData = async () => {
    if (appCode) {
      const response = await AggregatorService.getStudentDetailsById(id, appCode)
      if (!!response?.data?.data?.data) {
        const studentData = response.data?.data?.data
        const addressData = await fetchStateList(studentData?.application?.address)
        setStudentData({
          ...studentData,
          address: addressData
        })
      }
    } else {
      errorToast(messages.error)
    }
  }

  const getStudentStatus = async () => {
    const qualificationResponse = await CommonService?.getStudentStatus()
    if (qualificationResponse?.data?.data?.length > 0) {
      setStudentStatus(qualificationResponse?.data?.data)
    }
  }

  useEffect(() => {
    getStudentStatus()
    getStudentData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, appCode])

  if (_.isEmpty(studentData)) {
    return <FallbackSpinner />
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item sm={12} xs={12} sx={{ display: 'flex' }}>
          <Grid item sm={6} xs={6}>
            <Typography className='page-header'>
              Student ID {`#${studentData?.application?.lead?.studentCode}`}
              <DialogStatusHistory studentData={studentData} />
            </Typography>
            <DynamicBreadcrumb asPath={router.asPath} code={studentData?.application?.applicationCode} />
          </Grid>
          <Grid item sm={6} xs={6} sx={{ display: 'flex' }}>
            {studentData?.application?.lead?.student?.VIPType &&
            studentData?.application?.lead?.student?.VIPType !== null ? (
              <Grid item sm={6} xs={6}>
                <Grid container display={'flex'} justifyContent={'end'} columnGap={5}>
                  <Grid
                    item
                    display='flex'
                    alignItems='center'
                    style={{ backgroundColor: '#1f2b37', borderRadius: '10px' }}
                    pl={3}
                    pr={3}
                  >
                    <Box>
                      <VipTag VIPType={studentData?.application?.lead?.student?.VIPType} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant='body2' color='white'>
                        {studentData?.application?.lead?.student?.VIPType}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            {studentData && studentData?.finance?.length > 0 && (
              <Grid item sm={6} xs={6}>
                <Grid container display={'flex'} justifyContent={'end'} columnGap={2}>
                  <Grid
                    item
                    display='flex'
                    alignItems='center'
                    sx={{
                      backgroundColor: '#1f2b37',
                      borderRadius: '10px'
                    }}
                    px={1}
                    mb={1}
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
                        {studentData?.finance?.[0]?.AffordableRank
                          ? toPascalCase(studentData?.finance?.[0]?.AffordableRank)
                          : '-'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    display='flex'
                    alignItems='center'
                    style={{ backgroundColor: '#1f2b37', borderRadius: '10px' }}
                    px={1}
                    mb={1}
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
                        {studentData?.finance?.[0]?.CreditRisk
                          ? toPascalCase(studentData?.finance?.[0]?.CreditRisk)
                          : ''}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xl={9} md={9} xs={12} className='preview-card'>
          <PreviewCard studentData={studentData} getStudentData={getStudentData} />
        </Grid>
        <Grid item xl={3} md={3} xs={12} className='preview-card'>
          <Box className='sticky-sidebar'>
            <PreviewActions studentData={studentData} studentStatus={studentStatus} getStudentData={getStudentData} />
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default Preview
