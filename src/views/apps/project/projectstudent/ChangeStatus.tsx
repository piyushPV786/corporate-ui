import { useState, Fragment } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import { FormHelperText, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import RequiredLabel from 'src/components/RequiredLabel'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { DashboardService } from 'src/service'
import { status } from 'src/context/common'
import { errorToast, successToast } from 'src/components/Toast'
import LoadingBackdrop from 'src/@core/components/loading-backdrop'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

const validationSchema = Yup.object({
  status: Yup.string().required('Status is required'),
  graduationDate: Yup.date()
    .nullable()
    .typeError('Graduation date must be a valid date')
    .when('status', {
      is: 'GRADUATED',
      then: Yup.date().required('Graduation date is required'),
      otherwise: Yup.date().nullable(),
    }),
})

const statusList = [
  { name: 'Intake Assignment Pending', code: 'INTAKE-ASSIGNMENT-PEND' },
  { name: 'Cancelled', code: 'CANCELLED' },
  { name: 'Completed', code: 'COMPLETED' },
  { name: 'Graduated', code: 'GRADUATED' },

]

type Props = {
  applicationCode: string
  getStudentDetail: () => Promise<void>
}

const ChangeStatus = ({ applicationCode, getStudentDetail }: Props) => {
  const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false)
  const [showLoader, setShowLoader] = useState<boolean>(false)

  const handleCloseChangeStatus = () => {
    setOpenChangeStatus(false)
    reset({})
  }

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: '',
      graduationDate: null,
    },
  })

  const selectedStatus = watch('status')

  const onSubmit = async (data: any) => {
    setShowLoader(true)
    const payload = {
      applicationCode,
      status: data.status,
      graduationDate: data.graduationDate, 
    }
    const response = await DashboardService?.corporateStudentChangeStatus(payload)
    if (response?.status === status.successCode) {
      await getStudentDetail()
      successToast('Status Updated Successfully')
    } else {
      errorToast('Something went wrong. Please try again')
    }
    handleCloseChangeStatus()
    reset()
    setShowLoader(false)
  }

  return (
    <Fragment>
      <Button fullWidth sx={{ mb: 3.5 }} variant="outlined" onClick={() => setOpenChangeStatus(true)}>
        Change Status
      </Button>
      <Grid>
        <Dialog
          fullWidth
          open={openChangeStatus}
          maxWidth="sm"
          scroll="body"
          onClose={(event, reason) => {
            reason !== 'backdropClick' && handleCloseChangeStatus()
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 3, lineHeight: '2rem' }}>
                  Change Status
                </Typography>
              </Box>
              <Grid container spacing={8} sx={{ p: 5, pt: 2 }}>
                <Grid item sm={12}>
                  <FormControl fullWidth>
                    <ControlledAutocomplete
                      control={control}
                      name="status"
                      options={statusList}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label="Status" />}
                          error={!!errors?.status}
                        />
                      )}
                    />
                  </FormControl>
                  <FormHelperText error>{errors?.status?.message as string | undefined}</FormHelperText>
                </Grid>
                {selectedStatus === 'GRADUATED' && (
                  <Grid item sm={12}>
                    <FormControl fullWidth>
                      <Controller
                        name="graduationDate"
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                             <DatePicker
                          {...field}
                          value={field.value || null}
                          onChange={(date) => field.onChange(date ? new Date(date) : null)}
                          label="Select Graduation Date"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.graduationDate}
                              helperText={errors.graduationDate?.message}
                            />
                            )}
                          />
                      </LocalizationProvider>
                        )}
                      />

                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
              <Button variant="outlined" color="secondary" onClick={handleCloseChangeStatus}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ mr: 2 }} type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
          <LoadingBackdrop open={showLoader} />
        </Dialog>
      </Grid>
    </Fragment>
  )
}
export default ChangeStatus
