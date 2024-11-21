// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'

// ** Icons Imports
import { FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import RequiredLabel from 'src/components/RequiredLabel'

// ** Validation Imports
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { AcademicService, ApplyService, CommonService, UserManagementService } from 'src/service'
import { status } from 'src/context/common'
import { IStudyModeCodeTypes } from 'src/types/apps/dataTypes'
import LoadingBackdrop from 'src/@core/components/loading-backdrop'
import { successToast } from 'src/components/Toast'

// Define the Yup validation schema
const validationSchema = Yup.object({
  interestedQualification: Yup.string().required('Interested Qualification is required'),
  highestQualification: Yup.string().required('Highest Qualification is required')
})

type Props = {
  studentCode: string
}

interface Education {
  programCode: string
  qualificationCode: string
  studyModeCode?: string
  agentCode?: string
}

interface EnrollToRetailPayload {
  studentCode: string
  education: Education
}

const EnrollToRetail = ({ studentCode }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const [openEnrollToRetail, setOpenEnrollToRetail] = useState<boolean>(false)
  const [salesAgentList, setSalesAgentList] = useState<any[]>([])
  const [interestedQualificationList, setInterestedQualificationList] = useState<any[]>([])
  const [highestQualificationList, setHighestQualificationList] = useState<any[]>([])
  const [studyModeList, setStudyModeList] = useState<IStudyModeCodeTypes[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const interestedQualification = watch('interestedQualification')

  const handleCloseEnrollToRetail = () => {
    setOpenEnrollToRetail(false)
    setValue('studyMode', '')
    setStudyModeList([])
    reset()
  }

  const getSalesAgentList = async () => {
    const response = await UserManagementService?.getSalesAgentList()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setSalesAgentList(response.data.data)
    }
  }

  const getInterestedQualificationList = async () => {
    const response = await AcademicService?.getInterestedQualificationList()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setInterestedQualificationList(response.data.data)
    }
  }

  const getHighestQualificationList = async () => {
    const response = await CommonService?.getHighestQualification()
    if (response?.data?.statusCode === status.successCode && response?.data?.data) {
      setHighestQualificationList(response.data.data)
    }
  }

  const getProgramListByStudyMode = async (code: string) => {
    setLoading(true)
    const response = await AcademicService?.getProgramListByCode(code)
    const studyModes = response?.[0]?.studyModes
    if (studyModes?.length > 0) {
      setStudyModeList(studyModes)
      setValue('studyMode', studyModes[0].studyModeCode, { shouldValidate: true })
    } else {
      setStudyModeList([])
      setValue('studyMode', '')
    }
    setLoading(false)
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    const education: Education = {
      programCode: data.interestedQualification,
      qualificationCode: data.highestQualification
    }
    if (data.studyMode) {
      education.studyModeCode = data.studyMode
    }
    if (data.salesAgent) {
      education.agentCode = data.salesAgent
    }

    const payload: EnrollToRetailPayload = {
      studentCode,
      education
    }
    const response = await ApplyService?.updateNewProgram(payload)
    if (response?.statusCode === status.successCodeOne) {
      successToast('Enrolled Successfully')
    }
    handleCloseEnrollToRetail()
    setLoading(false)
  }

  useEffect(() => {
    getInterestedQualificationList()
    getHighestQualificationList()
    getSalesAgentList()
  }, [])

  useEffect(() => {
    if (interestedQualification) {
      getProgramListByStudyMode(interestedQualification)
    }
  }, [interestedQualification])

  return (
    <Fragment>
      <Box>
        <Button fullWidth onClick={() => setOpenEnrollToRetail(true)} variant='contained' sx={{ mt: 3.5 }}>
          Enroll as Retail
        </Button>
      </Box>
      <Grid>
        <Dialog
          fullWidth
          open={openEnrollToRetail}
          maxWidth='md'
          scroll='body'
          onClose={(event, reason) => {
            reason != 'backdropClick' && handleCloseEnrollToRetail()
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Enroll as Retail
                </Typography>
              </Box>
              <Grid container spacing={8} sx={{ p: 1, pt: 2 }}>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='highestQualification'
                      options={highestQualificationList}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Highest Qualification' />}
                          error={!!errors?.highestQualification}
                        />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>{errors?.highestQualification?.message as string | undefined}</FormHelperText>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='salesAgent'
                      options={salesAgentList}
                      renderInput={params => <TextField {...params} label={'Sales Agent'} />}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name='interestedQualification'
                      options={interestedQualificationList}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Interested Qualification' />}
                          error={!!errors?.interestedQualification}
                        />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>
                    {errors?.interestedQualification?.message as string | undefined}
                  </FormHelperText>
                </Grid>
                {!!studyModeList?.length && (
                  <Grid item xs={6}>
                    <FormControl>
                      <FormLabel id='demo-radio-buttons-group-label'>Study Mode</FormLabel>
                      <Controller
                        name='studyMode'
                        control={control}
                        render={({ field }) => (
                          <RadioGroup {...field} row aria-labelledby='demo-radio-buttons-group-label'>
                            {studyModeList &&
                              studyModeList?.map(item => {
                                return (
                                  <>
                                    <FormControlLabel
                                      value={item?.studyModeCode}
                                      control={<Radio />}
                                      label={item?.studyModeCode}
                                    />
                                  </>
                                )
                              })}
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant='outlined' color='secondary' onClick={handleCloseEnrollToRetail}>
                Cancel
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                Save
              </Button>
            </DialogActions>
          </form>
          <LoadingBackdrop open={loading} />
        </Dialog>
      </Grid>
    </Fragment>
  )
}
export default EnrollToRetail
