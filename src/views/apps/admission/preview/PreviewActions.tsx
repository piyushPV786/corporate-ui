// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material'

// ** Custom Components/Services
import { admissionRMAT, admissionRMATResult } from 'src/context/common'
import RmatDetailDialog from 'src/views/pages/dialog/RmatDetail'
import { IStudenData } from 'src/views/pages/dialog/CourseDetails'
import WhiteButton from 'src/components/Button'
import { IExamDetailsTypes, IRMATProgramTypes, IResultDetailsTypes } from 'src/types/apps/dataTypes'

// ** Icons Imports
import { SendOutline, ArrowLeft } from 'mdi-material-ui'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import RedWhiteButton from 'src/components/RedButton'
import { CommonActivityTab } from 'src/views/dashboards/comments/CommentComponenet'

interface Props {
  approve: () => void
  disable: boolean
  handleRMATSend: (arg0: string) => void
  isDocumentApproved: boolean
  studentData: IStudenData
  examDetails?: IResultDetailsTypes
  rmatProgram: IRMATProgramTypes | undefined
  AllRMATProg: IRMATProgramTypes[]
  IsRMATPassFail: (arg0: string) => void
  getStudentDetailById: () => void
}

const PreviewActions = ({
  approve,
  disable,
  handleRMATSend,
  isDocumentApproved,
  studentData,
  examDetails,
  rmatProgram,
  AllRMATProg,
  IsRMATPassFail,
  getStudentDetailById
}: Props) => {
  const [marks, setMarks] = useState<IExamDetailsTypes | null>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numberOfAttempts, setNumberOfAttempts] = useState<number>(1)
  const [RMATprog, setRMATprog] = useState<string | any>('')

  console.log('numberOfAttempts', numberOfAttempts)

  useEffect(() => {
    setMarks(!!examDetails?.exam?.length ? examDetails?.exam[examDetails?.exam?.length - 1] : null)
    setNumberOfAttempts(!!rmatProgram?.maximumAttempts ? rmatProgram?.maximumAttempts : 1)
  }, [examDetails, rmatProgram, studentData, isDocumentApproved])
  const handlePassFail = (arg0: string) => {
    IsRMATPassFail(arg0)
  }

  useEffect(() => {
    AllRMATProg?.length == 1 && setRMATprog(AllRMATProg[0]?.code)
  }, [AllRMATProg])

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Link href='/admission/list' passHref>
            <Button fullWidth startIcon={<ArrowLeft />} component='a' sx={{ mb: 3.5 }} variant='outlined'>
              Back to List
            </Button>
          </Link>
          <FullPermission featureCode={FeatureCodes.EMS.admission}>
            <Button
              disabled={disable}
              onClick={() => approve()}
              fullWidth
              variant='contained'
              startIcon={<SendOutline />}
            >
              Verify
            </Button>
          </FullPermission>
        </CardContent>
      </Card>

      {rmatProgram?.isOptional && (
        <Grid xs={12} display='flex' justifyContent='center'>
          <Typography>
            <strong>OR</strong>
          </Typography>
        </Grid>
      )}
      {isDocumentApproved &&
      !!rmatProgram &&
      !!AllRMATProg &&
      admissionRMAT.applicationStatus.includes(studentData?.application?.status) ? (
        <Grid xs={12} sx={{ pt: 2 }}>
          <Card>
            <CardContent sx={{ backgroundColor: theme => theme.palette.primary.dark }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Grid container alignItems='center'>
                    <Grid item xs={12} sx={{ backgroundColor: theme => theme.palette.common.white }}>
                      <Box sx={{ p: 2 }}>
                        <FormControl fullWidth>
                          <Autocomplete
                            fullWidth
                            style={{ width: '100%' }}
                            options={AllRMATProg}
                            onChange={(_, value) => {
                              value ? setRMATprog(value?.code?.toString()) : setRMATprog('')
                            }}
                            defaultValue={AllRMATProg?.length == 1 && AllRMATProg[0]}
                            value={AllRMATProg?.length ? AllRMATProg?.find(i => i?.code === RMATprog)?.name : RMATprog}
                            getOptionLabel={option => (option?.name ? option?.name : '')}
                            renderInput={params => (
                              <TextField {...params} label='Admissions Test' variant='outlined' fullWidth />
                            )}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <FullPermission featureCode={FeatureCodes.EMS.admission}>
                  {admissionRMAT.applicationStatus.includes(studentData?.application?.status) && (
                    <Grid item xs={12}>
                      <WhiteButton
                        fullWidth
                        variant='contained'
                        disabled={!RMATprog}
                        startIcon={<SendOutline />}
                        onClick={() => {
                          handleRMATSend(RMATprog)
                        }}
                      >
                        {studentData?.application?.status === admissionRMAT?.rmatFail
                          ? admissionRMAT.resendRMAT
                          : admissionRMAT?.sendRMAT}
                      </WhiteButton>
                    </Grid>
                  )}
                </FullPermission>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ) : null}

      {!!marks && examDetails ? (
        <Grid xs={12} sx={{ pt: 2 }}>
          <Card>
            <CardContent sx={{ backgroundColor: theme => theme.palette.primary.dark }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Grid container alignItems='center'>
                    <Grid item xs={12}>
                      <Typography variant='h6' color='white'>
                        RMAT Exam Details
                      </Typography>
                    </Grid>

                    {!!marks && examDetails ? (
                      <Grid item xs={12} textAlign='end'>
                        <RmatDetailDialog examDetails={examDetails} marks={marks} />
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
                {!!marks ? (
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography variant='caption' color='white'>
                          Status
                        </Typography>
                        {marks && (
                          <Typography variant='h6' textTransform='uppercase' color={admissionRMATResult[marks?.result]}>
                            {marks?.result}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant='caption' color='white'>
                          Attempted Date
                        </Typography>
                        {!!marks ? (
                          <Typography variant='h6' color='white'>
                            {new Date(marks.updatedAt).toLocaleString('en-GB')}
                          </Typography>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ) : null}

      {admissionRMAT.passFailRMAT.includes(studentData?.application?.status) && (
        <Grid xs={12} sx={{ pt: 2 }}>
          <Card>
            <CardContent sx={{ backgroundColor: theme => theme.palette.primary.dark }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Grid container alignItems='center'>
                    <Grid item xs={12}>
                      <Typography variant='h6' color='white'>
                        RMAT Pass / RMAT Fail
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ backgroundColor: theme => theme.palette.common.white }}></Grid>
                  </Grid>
                </Grid>

                <FullPermission featureCode={FeatureCodes.EMS.admission}>
                  <Grid item xs={6} display='flex' justifyContent='center'>
                    <WhiteButton size='medium' variant='contained' onClick={() => handlePassFail(admissionRMAT?.PASS)}>
                      RMAT Pass
                    </WhiteButton>
                  </Grid>
                  <Grid item xs={6} display='flex' justifyContent='center'>
                    <RedWhiteButton
                      size='medium'
                      variant='contained'
                      onClick={() => handlePassFail(admissionRMAT?.FAIL)}
                    >
                      RMAT Fail
                    </RedWhiteButton>
                  </Grid>
                </FullPermission>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* <EcommerceActivityTimeline data={studentData} /> */}
      <CommonActivityTab data={studentData} getStudentDetailById={getStudentDetailById} />
    </React.Fragment>
  )
}

export default PreviewActions
