/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { LightBackground } from 'src/styles/style'
import RplDialog from 'src/views/pages/dialog/RplDialog'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DashboardService, DocumentService } from 'src/service'
import UploadDocuments from '../rplCustomHook/DocumentUploadCustomHook'
import { Close, CloseCircleOutline } from 'mdi-material-ui'
import Styles from '../../views/pages/dialog/DocumentUpload.module.css'
import { formatDate } from 'src/@core/utils/format'
import { LinearProgressWithLabel, getFileUrl } from 'src/utils'

const ConfirmDialog = (props: any) => {
  const { createRpl, confirm, setConfirm, setValue } = props

  return (
    <Dialog open={confirm} maxWidth='sm' fullWidth>
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position='absolute' top={0} right={0}>
        <IconButton
          onClick={() => {
            setConfirm(!confirm)
            setValue('additionalQualification', 'false')
          }}
        >
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>
          Please confirm If you've set RPL 'yes' once, you won't be able to set RPL 'no' afterwards{' '}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color='secondary'
          variant='contained'
          onClick={() => {
            setConfirm(!confirm)
            setValue('additionalQualification', 'false')
          }}
        >
          Cancel
        </Button>
        <Button color='primary' variant='contained' onClick={createRpl}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

export const RplStatus = (props: any) => {
  const { data, getEnrolmentDetailById, disable } = props

  const rpl = data?.application?.enrolment && data?.application?.enrolment?.rpl
  const [confirm, setConfirm] = useState(false)

  const {
    watch,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      additionalQualification: rpl?.isRpl ? 'true' : 'false'
    }
  })
  const additionalQualificationWatch = watch('additionalQualification')
  const createRpl = async () => {
    const response = await DashboardService.createRpl({
      applicationCode: data?.application?.applicationCode,
      isRpl: JSON.parse(additionalQualificationWatch.toLowerCase())
    })
    getEnrolmentDetailById()
    setConfirm(false)
  }

  // const updateRpl = async (value: any) => {
  //   const response = await DashboardService.updateRpl({
  //     applicationCode: data?.application?.applicationCode,
  //     isRpl: JSON.parse(value.toLowerCase())
  //   })
  // }

  const onChangeAdditional = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setValue('additionalQualification', value)
    if (value == 'true') {
      setConfirm(true)
    }
  }

  const handleView = (file: any) => {
    getFileUrl(file?.name, data?.application?.lead?.studentCode, file?.code)
  }

  const matricDoc = data?.document?.find((item: any) => item?.documentTypeCode === 'MATRIC')
  const saqaDoc = data?.document?.find((item: any) => item?.documentTypeCode === 'SAQA')
  const rplDoc = data?.document?.find((item: any) => item?.documentTypeCode === 'RPL')

  const rplValidate = ['APP-ENROLLED', 'APP-DOC-UPLOADED']

  return (
    <LightBackground mt={10}>
      <Grid>
        <ConfirmDialog createRpl={createRpl} confirm={confirm} setConfirm={setConfirm} setValue={setValue} />
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid container>
              <Grid item xs={5}>
                <Typography sx={{ mt: 2 }}>if any, Additional Qualification Details</Typography>
              </Grid>
              <Grid item xs={7}>
                <Controller
                  name='additionalQualification'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <RadioGroup {...field} onChange={onChangeAdditional}>
                        <Grid container>
                          <Grid item xs={2}>
                            <FormControlLabel
                              disabled={
                                rpl?.isRpl || !rplValidate.includes(data?.application?.status) || (disable && disable)
                              }
                              value='true'
                              control={<Radio />}
                              label='Yes'
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <FormControlLabel
                              disabled={
                                rpl?.isRpl || !rplValidate.includes(data?.application?.status) || (disable && disable)
                              }
                              value='false'
                              control={<Radio />}
                              label='NO'
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {rpl?.isRpl && (
              <DarkCard>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <label>Matric Certificate Required? </label>
                    <Typography sx={{ color: 'white' }} variant='h6'>
                      {rpl?.isMatric ? 'Yes' : !rpl?.isMatric ? 'No' : '-'}
                      {rpl?.isMatric && matricDoc && (
                        <>
                          {' '}
                          /{' '}
                          <Link style={{ cursor: 'pointer', color: '#FDB528' }} onClick={() => handleView(matricDoc)}>
                            {matricDoc?.name}
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>SAAQA Certificate Required?</label>
                    <Typography sx={{ color: 'white' }} variant='h6'>
                      {rpl?.isSaqa ? 'Yes' : !rpl?.isSaqa ? 'No' : '-'}
                      {rpl?.isSaqa && saqaDoc && (
                        <>
                          {' '}
                          /{' '}
                          <Link style={{ cursor: 'pointer', color: '#FDB528' }} onClick={() => handleView(saqaDoc)}>
                            {saqaDoc?.name}
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <label>RPL Status</label>
                    <Typography sx={{ color: 'white' }} variant='h6'>
                      {rpl?.rplStatus != null ? rpl?.rplStatus : '-'}
                      {rpl?.rplStatus != null && rplDoc && (
                        <>
                          {' '}
                          /{' '}
                          <Link style={{ cursor: 'pointer', color: '#FDB528' }} onClick={() => handleView(rplDoc)}>
                            {rplDoc?.name}
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <RplDialog studentData={data} getData={getEnrolmentDetailById} edit={disable} />
                  </Grid>
                </Grid>
              </DarkCard>
            )}
          </Grid>
        </Grid>
      </Grid>
    </LightBackground>
  )
}

export const UserInfo = (props: any) => {
  const { studentData } = props

  return (
    <DarkCard>
      <Grid container spacing={5}>
        <Grid item xs={4}>
          <label>Student ID </label>
          <Typography sx={{ color: 'white' }} variant='h6'>
            {studentData?.application?.lead?.studentCode}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <label>Name</label>
          <Typography sx={{ color: 'white' }} variant='h6'>
            {`${studentData?.application?.lead?.firstName} ${studentData?.application?.lead?.middleName} ${studentData?.application?.lead?.lastName}`}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <label>Contact Details</label>
          <Typography sx={{ color: 'white' }} variant='h6'>
            {studentData?.application?.lead?.email}
          </Typography>
          <Typography sx={{ color: 'white' }} variant='h6'>
            {`+${studentData?.application?.lead?.mobileCountryCode}${studentData?.application?.lead?.mobileNumber}`}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <label>Date of Birth</label>
          <Typography sx={{ color: 'white' }} variant='h6'>
            {formatDate(studentData?.application?.lead?.dateOfBirth)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <label>Highest Qulaification</label>
          <Typography
            sx={{ color: 'white' }}
            variant='h6'
          >{`${studentData?.application?.education?.programCode}-${studentData?.application?.education?.programName}`}</Typography>
        </Grid>
      </Grid>
    </DarkCard>
  )
}

export const MatricCertificate = (props: any) => {
  const [checked, setChecked] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')

  const { keyName, label1, label2, onchangeSwitch, studentData, fileType, isRplStatus, selectData, getData } = props
  const { uploadDocument, uploadProgress, setUploadProgress } = UploadDocuments(studentData)

  useEffect(() => {
    if (studentData?.document?.length) {
      if (keyName === 'matric') {
        const filterDocument = studentData?.document?.find((item: any) => item?.documentTypeCode === 'MATRIC')
        setFileName(filterDocument?.name ? filterDocument?.name : '')
      } else if (keyName === 'saqa') {
        const filterDocument = studentData?.document?.find((item: any) => item?.documentTypeCode === 'SAQA')
        setFileName(filterDocument?.name ? filterDocument?.name : '')
      } else if (keyName === 'rpl') {
        const filterDocument = studentData?.document?.find((item: any) => item?.documentTypeCode === 'RPL')
        setFileName(filterDocument?.name ? filterDocument?.name : '')
      }
    }
  }, [studentData])

  const fileOnChange = (e: any) => {
    const file = e?.target?.files[0]
    uploadDocument(file, fileType)
    setFileName(file?.name)
  }

  const removeDocument = async (fileName: any) => {
    setFileName('')
    setUploadProgress(0)
    const documentCode = fileName?.split('.')?.[0]
    const removeDocumentResponse = await DocumentService?.documentRemove(documentCode)

    // getData();
  }

  const options = [
    { name: 'Approved', code: 'APPROVED', label: 'Approved' },
    { name: 'Declined', code: 'DECLINED', label: 'Declined' },
    { name: 'Required', code: 'REQUIRED', label: 'Required' }
  ]
  const isButtonEnabled = selectData

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>{label1}</Typography>

        {keyName === 'rpl' ? (
          <Autocomplete
            id='combo-box-demo'
            options={options}
            sx={{ width: '90%' }}
            onChange={(e, value) => {
              onchangeSwitch(value, keyName)
            }}
            value={isRplStatus ? isRplStatus : null}
            renderInput={params => <TextField {...params} label='Select Status' />}
          />
        ) : (
          <Switch
            defaultChecked={selectData}
            onChange={e => onchangeSwitch(e, keyName)}
            onClick={() => setChecked(!checked)}
          />
        )}
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item>
          <Typography>{label2}</Typography>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={8}>
              <Button variant='contained' component='label' disabled={!isButtonEnabled}>
                Browse
                <input type='file' hidden onChange={fileOnChange} />
              </Button>
            </Grid>

            {fileName != '' && (
              <Box sx={{ width: '100%' }}>
                <Card className={Styles.Document}>
                  <Box>
                    <Box textAlign='start'>
                      <Typography variant='body1'>{fileName}</Typography>
                      {/* <Typography variant='body2'>{calculateFileSize(watch('file')?.size)}</Typography> */}
                    </Box>
                  </Box>
                  <Box alignItems='center'>
                    <CloseCircleOutline color='error' onClick={() => removeDocument(fileName)} />
                  </Box>
                </Card>
                {!!uploadProgress && <LinearProgressWithLabel value={uploadProgress} />}
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.grey[400],
  padding: 8
}))
