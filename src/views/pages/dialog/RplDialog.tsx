/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { errorToast, loadingToast, successToast } from 'src/components/Toast'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icons Importss
import Close from 'mdi-material-ui/Close'

// import { toast } from "react-toastify"

import { Tooltip, Backdrop, CircularProgress, Tab } from '@mui/material'

import { PencilOutline } from 'mdi-material-ui'
import { DashboardService } from 'src/service'
import { dataMessages, status } from 'src/context/common'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import UploadDocuments from 'src/components/rplCustomHook/DocumentUploadCustomHook'
import { calculateFileSize } from 'src/utils'
import { MatricCertificate, UserInfo } from 'src/components/common/RplComponents'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const RplDialog = ({ studentData, getData, edit }: any) => {
  const [show, setShow] = useState<boolean>(false)
  const [loadingStates, setLoadingStates] = useState<boolean>(false)
  const [value, setValue] = useState('1')

  const [isMatric, setIsMatric] = useState(false)
  const [isSqa, setIsSaqa] = useState(false)
  const [isRplStatus, setRplStatus] = useState<any>(null)

  const options = [
    { name: 'Approved', code: 'APPROVED', label: 'Approved' },
    { name: 'Declined', code: 'DECLINED', label: 'Declined' },
    { name: 'Required', code: 'REQUIRED', label: 'Required' }
  ]

  useEffect(() => {
    if (studentData?.application?.enrolment?.rpl) {
      setIsMatric(
        studentData?.application?.enrolment?.rpl?.isMatric !== false &&
          studentData?.application?.enrolment?.rpl?.isMatric !== null
          ? true
          : false
      )
      setIsSaqa(
        studentData?.application?.enrolment?.rpl?.isSaqa !== false &&
          studentData?.application?.enrolment?.rpl?.isSaqa !== null
          ? true
          : false
      )
      if (studentData?.application?.enrolment?.rpl?.rplStatus) {
        const rplStatusData = options.filter(
          (item: any) => item?.code === studentData?.application?.enrolment?.rpl?.rplStatus
        )
        if (rplStatusData?.length > 0) {
          setRplStatus(rplStatusData[0])
        }
      }
    }
  }, [studentData])

  const { uploadDocument, uploadDocumentStatus, uploadProgress, setUploadProgress, documentCode } =
    UploadDocuments(studentData)

  const onSubmit = async () => {
    setLoadingStates(true)
    const applicationCode = studentData?.application?.applicationCode
    const payload = {
      rplStatus: isRplStatus?.code ? isRplStatus?.code : null,
      isSaqa: isSqa,
      isMatric: isMatric,
      isRpl: studentData?.application?.enrolment?.rpl?.isRpl
    }
    try {
      const res = await DashboardService.updateRpl(payload, applicationCode)
      getData()
      successToast('Data updated successfully')
    } catch (error) {
      errorToast('Failed to update data')
    } finally {
      setLoadingStates(false)
      setShow(false)
    }
  }

  const handleOpen = () => {
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setLoadingStates(true)
    setValue(newValue)
    setTimeout(() => {
      setLoadingStates(false)
    }, 500) // Simulate loading delay
  }

  const onchangeRPL = (event: any, key: string) => {
    if (key === 'rpl') {
      setRplStatus(event)
    } else if (key === 'matric') {
      setIsMatric(event.target.checked)
    } else {
      setIsSaqa(event.target.checked)
    }
  }

  return (
    <Grid>
      {!edit && (
        <Box display='flex' justifyContent='flex-end'>
          <Tooltip title={`Edit Address`}>
            <Box>
              <IconButton
                onClick={handleOpen}
                size='small'
                component='a'
                color='primary'
                sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
              >
                <PencilOutline />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      )}

      <Dialog
        fullWidth
        open={show}
        maxWidth='lg'
        scroll='body'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setShow(false)
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ pb: 6, px: { xs: 6, sm: 12 }, pt: { xs: 5, sm: 10.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Close />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Additional Qualification Details
            </Typography>
          </Box>
          <Grid>
            <UserInfo studentData={studentData} />
          </Grid>

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <TabList onChange={handleChange} aria-label='lab API tabs example' sx={{ margin: 5 }}>
                  <Tab label='Matric Certificate' value='1' />
                  <Tab label='SAQA Certificate' value='2' />
                  <Tab label='RPL Status' value='3' />
                </TabList>
              </Box>
              {loadingStates ? (
                <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TabPanel value='1'>
                    <MatricCertificate
                      keyName='matric'
                      label1='Matric Certificate Required?'
                      label2='Upload Matric Certificate (Optional)'
                      onchangeSwitch={onchangeRPL}
                      studentData={studentData}
                      fileType='MATRIC'
                      selectData={isMatric}
                      getData={getData}
                    />
                  </TabPanel>
                  <TabPanel value='2'>
                    <MatricCertificate
                      keyName='saqa'
                      label1='SAQA Certificate Required?'
                      label2='SAQA Certificate (Optional)'
                      onchangeSwitch={onchangeRPL}
                      studentData={studentData}
                      fileType='SAQA'
                      selectData={isSqa}
                      getData={getData}
                    />
                  </TabPanel>
                  <TabPanel value='3'>
                    <MatricCertificate
                      keyName='rpl'
                      label1='RPL Status'
                      label2='RPL Result (Optional)'
                      onchangeSwitch={onchangeRPL}
                      studentData={studentData}
                      isRplStatus={isRplStatus}
                      fileType='RPL'
                      selectData={isRplStatus}
                      getData={getData}
                    />
                  </TabPanel>
                </>
              )}
            </TabContext>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pb: { xs: 10, sm: 12.5 }, justifyContent: 'center', marginTop: 5, gap: 5 }}>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={{ mr: 2 }} onClick={onSubmit} disabled={loadingStates}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RplDialog
