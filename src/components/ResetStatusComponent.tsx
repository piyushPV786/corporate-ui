import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { status } from 'src/context/common'
import AlertBox from 'src/layouts/components/Alert'
import { ProgramNameField } from 'src/styles/style'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { useAuth } from 'src/hooks/useAuth'
import { DashboardService } from 'src/service'
import { successToast } from './Toast'
import CommonCustomHook from 'src/context/CommonAPIS/commonCustomHook'
import { getName } from 'src/utils'

interface IPreviewActionsPropTypes {
  studentdata?: IDynamicObject
  getApplicationDetails: () => void
}

const ResetStatusComponent = ({ studentdata, getApplicationDetails }: IPreviewActionsPropTypes) => {
  const { user } = useAuth()
  const { masterCommonData } = CommonCustomHook()
  const [open, setOpen] = useState<boolean>(false)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const disableStatus: string[] = [
    'APP-FEE-PEND',
    'APP-DOC-UPLOADED',
    'SUSPENDED',
    'DEFERRED',
    'DECEASED',
    'EXPELLED',
    'GRADUATED'
  ]
  const disableSubStatus: string[] = ['SUB-GRADUATED-FEES-PENDING']

  const hasResetStatusRole =
    user?.roles?.some(role => role.code === 'RESET-STATUS') &&
    !disableStatus?.includes(studentdata?.application?.status) &&
    !disableSubStatus?.includes(studentdata?.application?.subStatus)

  const onSubmit = async (data: any) => {
    const payload = {
      applicationCode: studentdata?.application?.applicationCode,
      remark: data?.remark,
      userCode: user?.code,
      userEmailAddress: user?.email
    }
    const response = await DashboardService.updateStatus(payload)
    if (response?.statusCode == status?.successCode) {
      successToast(
        `${studentdata?.application?.lead?.firstName} ${studentdata?.application?.lead?.lastName} status reset sucessfully`
      )
      getApplicationDetails()
    }
    reset()
    setOpen(false)
  }

  const AlertMessage = () => {
    return (
      <>
        Are you sure you want to reset the student status to "<b>Application Fee Pending</b>"?Once reset, all the
        documents and modules in this application will be removed and this action cannot be undone.
      </>
    )
  }

  return (
    <>
      {hasResetStatusRole && (
        <Button fullWidth sx={{ mb: 3.5 }} variant='contained' onClick={() => setOpen(true)}>
          Reset Status
        </Button>
      )}
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && setOpen(false)
        }}
      >
        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Reset Status
            </Typography>
          </Box>
          <Grid>
            <ProgramNameField container spacing={7} mt={5} mb={8} ml={0} pb={8}>
              <Grid item xs={6} display='grid'>
                <label>Student ID</label>
                <Typography color={theme => theme.palette.common.white}>
                  {studentdata?.application?.lead?.studentCode}
                </Typography>
              </Grid>
              <Grid item xs={6} display='grid'>
                <label>Student Name</label>
                <Typography
                  color={theme => theme.palette.common.white}
                >{`${studentdata?.application?.lead?.firstName} ${studentdata?.application?.lead?.lastName}`}</Typography>
              </Grid>
              <Grid item xs={6} display='grid'>
                <label>Contact Details</label>
                <Typography color={theme => theme.palette.common.white}>
                  {studentdata?.application?.lead?.email}
                </Typography>
                <Typography color={theme => theme.palette.common.white}>
                  +{studentdata?.application?.lead?.mobileCountryCode} {studentdata?.application?.lead?.mobileNumber}
                </Typography>
              </Grid>
              <Grid item xs={6} display='grid'>
                <label>National ID</label>
                <Typography color={theme => theme.palette.common.white}>
                  {`${getName(
                    masterCommonData?.identificationType,
                    studentdata?.application?.lead?.identificationDocumentType
                  )}`}
                  /{studentdata?.application?.lead?.identificationNumber}
                </Typography>
              </Grid>
            </ProgramNameField>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='remark'
              control={control}
              rules={{
                required: 'Remark is required',
                maxLength: {
                  value: 200,
                  message: 'Remark cannot exceed 200 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Remark (max 200 characters)'
                  fullWidth
                  multiline={true}
                  rows={2.5}
                  error={!!errors.remark}
                  helperText={errors?.remark?.message as string | undefined}
                  sx={{ mb: 8 }}
                />
              )}
            />

            <AlertBox
              sx={{ mb: 8 }}
              color='warning'
              variant={'filled ' as any}
              message={<AlertMessage />}
              severity='warning'
            />

            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setOpen(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ResetStatusComponent
