// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import { ProgramNameField } from 'src/styles/style'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { Controller, useForm } from 'react-hook-form'
import {
  applicationStatus,
  graduationStatus,
  messages,
  status as statusCode,
  studentApplicationAllStatus
} from 'src/context/common'
import Styles from './DialogStatusChange.module.css'
import { IAllStatus, IStatusItem, SubStatu } from 'src/types/apps/dataTypes'
import { DashboardService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import { EditorState } from 'draft-js'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { IAdmittedStudentTypes } from 'src/types/apps/admittedStudent'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { DDMMYYYDateFormat } from 'src/utils'

type Props = {
  studentData?: IAdmittedStudentTypes
  studentStatus?: IStatusItem
  getStudentData: () => void
}

const DialogStatusChange = ({ studentData, studentStatus, getStudentData }: Props) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const status = studentData?.application?.status ?? ''
  const substatus = studentData?.application?.subStatus

  const allStatus: Array<IAllStatus> = []
  studentStatus?.map((item: IStatusItem) => {
    if (!!item?.subStatus?.length) {
      item.subStatus?.map((itemstatus: SubStatu) => {
        allStatus.push({
          name: `${item?.name} - ${itemstatus?.name}`,
          code: itemstatus?.code,
          status: item?.code
        })
      })
    } else {
      allStatus.push({
        name: `${item?.name}`,
        code: item?.code
      })
    }
  })

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm()
  const watchStatus = watch('status', '')
  const changeStudentStatus = async (payload: any, name: string) => {
    const result = await DashboardService.editStudentStatus(
      payload,
      studentData?.application?.lead?.studentCode,
      studentData?.application?.applicationCode
    )
    if (result?.data?.statusCode === statusCode.successCode) {
      getStudentData()
      successToast(`The status changed from ${studentApplicationAllStatus[status]} to ${name}`)
      handleClose()
    } else {
      errorToast(messages.error)
    }
  }

  const onSubmit = (data: any) => {
    reset({}, { keepValues: true })

    const statusObj = allStatus.find(i => i.code == data.status)

    const payload = {
      status: !!statusObj?.status ? statusObj?.status : statusObj?.code,
      subStatus: !!statusObj?.status ? statusObj?.code : '',
      comments: data.comment.getCurrentContent().getPlainText('\u0001'),
      graduationDate: data.graduationDate
    }

    changeStudentStatus(payload, statusObj?.name ?? '')
    setOpen(false)
  }

  return (
    <Fragment>
      <Box>
        <Button fullWidth onClick={handleClickOpen} variant='contained'>
          Change Status
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={(event, reson) => {
          reson != 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title' sx={{ display: 'flex', justifyContent: 'center' }}>
          Change Status
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <ProgramNameField container spacing={7} mb={8} ml={0} pb={8}>
              <Grid item xs={6} display='grid'>
                <label>Name</label>
                <Typography color={theme => theme.palette.common.white}>
                  {`${studentData?.application.lead.firstName} ${studentData?.application.lead.lastName}`}
                </Typography>
              </Grid>
              <Grid item xs={6} display='grid'>
                <label>Current Status</label>
                <Typography color={theme => theme.palette.common.white}>
                  {!!substatus
                    ? `${studentApplicationAllStatus[status]}-${substatus}`
                    : studentApplicationAllStatus[status]}
                </Typography>
              </Grid>
              {status === applicationStatus && (
                <Grid item xs={6} display='grid'>
                  <label>Graduate Date</label>
                  <Typography color={theme => theme.palette.common.white}>
                    {studentData?.application?.enrolment?.graduationDate
                      ? DDMMYYYDateFormat(studentData?.application?.enrolment?.graduationDate)
                      : '-'}
                  </Typography>
                </Grid>
              )}
            </ProgramNameField>
            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth error={!!errors.agent}>
                  <ControlledAutocomplete
                    name='status'
                    control={control}
                    options={allStatus ?? []}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Select Status'
                        error={!!errors.status}
                        helperText={errors?.status?.message as string | undefined}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              {(watchStatus === graduationStatus.subGraduated ||
                watchStatus === graduationStatus.subMarkNotRetrived ||
                watchStatus === graduationStatus.subGraduatedFeesPending) && (
                <>
                  <Grid item sm={12} xs={12}>
                    <FormControl fullWidth error={!!errors.graduationDate}>
                      <Controller
                        name='graduationDate'
                        control={control}
                        defaultValue={null}
                        rules={{ required: 'Graduation date is required' }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div>
                              <DatePicker
                                label='Graduation Date'
                                value={field.value}
                                onChange={newValue => field.onChange(newValue)}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    error={!!errors.graduationDate}
                                    helperText={
                                      errors.graduationDate
                                        ? (errors.graduationDate.message as string | undefined)
                                        : undefined
                                    }
                                  />
                                )}
                                inputFormat='dd/MM/yyyy'
                              />
                            </div>
                          </LocalizationProvider>
                        )}
                      />
                      {/* Status Datepicker */}
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item sm={12} xs={12}>
                <FormControl fullWidth error={!!errors.agent}>
                  <Box className={Styles.editor_box}>
                    Comment(Optional)
                    <Controller
                      name='comment'
                      control={control}
                      defaultValue={EditorState.createEmpty()}
                      render={({ field }) => (
                        <ReactDraftWysiwyg
                          editorState={field.value}
                          onEditorStateChange={data => field.onChange(data)}
                        />
                      )}
                    />
                  </Box>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={!isDirty}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default DialogStatusChange
