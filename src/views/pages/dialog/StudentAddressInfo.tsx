// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

// import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Controller, useForm } from 'react-hook-form'

// ** Icons Imports
// import Close from 'mdi-material-ui/Close'
import FileDocumentEdit from 'mdi-material-ui/FileDocumentEdit'
import { TextField } from '@mui/material'
import { IListOfCommonTypes } from 'src/types/apps/dataTypes'
import { DashboardService } from 'src/service'
import { successToast } from 'src/components/Toast'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

interface Inational {
  studentData: any
  getStudentDetailById: any
  listOf: IListOfCommonTypes
}

const EditAddress = ({ studentData, getStudentDetailById, listOf }: Inational) => {
  const {
    handleSubmit,
    register,
    watch,
    control,
    setValue,

    reset,
    formState: { errors }
  } = useForm()

  const [show, setShow] = useState(false)

  const onSubmit = async (data: any) => {
    const payload = {
      streetAddress: data?.streetAddress,
      suburb: data?.suburb,
      town: data?.town,
      province: data?.province,
      country: data?.country,
      zipCode: data?.zipCode,
      idType: data?.idType,
      ifOthersSpecifyTheIdType: data?.ifOthersSpecifyTheIdType,
      idNo: data?.idNo
    }

    const response = await DashboardService.addUpdateStudentAddressInfo(payload, studentData?.code)

    if (response?.code) {
      getStudentDetailById(studentData?.id)

      successToast(`Student Address Info updated successfully`)
    }
    reset()
    setShow(false)
  }

  const onClose = () => {
    setShow(false)
  }

  useEffect(() => {
    !!studentData &&
      reset({
        streetAddress: studentData?.streetAddress,
        suburb: studentData?.suburb,
        town: studentData?.town,
        province: studentData?.province,
        country: studentData?.country,
        zipCode: studentData?.zipCode,
        idType: studentData?.idType,
        ifOthersSpecifyTheIdType: studentData?.ifOthersSpecifyTheIdType,
        idNo: studentData?.idNo
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData])

  return (
    <Grid>
      <Box display='block'>
        <Button size='small' startIcon={<FileDocumentEdit />} variant='contained' onClick={() => setShow(true)}>
          Edit Address
        </Button>
      </Box>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && onClose()
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Address
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <Controller
                  name='streetAddress'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Street Address'
                      error={errors.streetAddress as boolean | undefined}
                      helperText={errors.streetAddress && (errors.streetAddress?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <Controller
                  name='suburb'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Suburb'
                      error={errors.suburb as boolean | undefined}
                      helperText={errors.suburb && (errors.suburb?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='town'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={errors.town as boolean | undefined}
                      fullWidth
                      label='Town'
                      helperText={errors.town && (errors.town?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='province'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={errors.province as boolean | undefined}
                      fullWidth
                      label='Province'
                      helperText={errors.province && (errors.province?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='country'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={errors.country as boolean | undefined}
                      fullWidth
                      label='Country'
                      helperText={errors.country && (errors.country?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='zipCode'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='number'
                      error={errors.zipCode as boolean | undefined}
                      fullWidth
                      label='Zip Code / Pin Code'
                      helperText={errors.zipCode && (errors.zipCode?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 8 }}>
              <Box style={{ padding: '1rem', borderRadius: 10 }}>
                <Box>
                  <Typography sx={{ textAlign: 'center' }}>National ID Details</Typography>
                </Box>
                <Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '22px' }}>
                  <Grid item sm={5}>
                    <ControlledAutocomplete
                      control={control}
                      name='idType'
                      options={listOf?.idType ?? []}
                      renderInput={params => <TextField {...params} label='ID Type' />}
                    />
                  </Grid>

                  <Grid item sm={5}>
                    <Controller
                      name='idNo'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='ID Number'
                          fullWidth
                          error={errors.idNo as boolean | undefined}
                          helperText={errors.idNo && (errors.idNo?.message as string | undefined)}
                        />
                      )}
                    />
                  </Grid>
                </Box>
                <Box>
                  {watch('idType') === 'OTHER' ? (
                    <Grid item sm={5} sx={{ pl: 12, pb: 5 }}>
                      <TextField
                        {...register('ifOthersSpecifyTheIdType')}
                        value={watch('ifOthersSpecifyTheIdType')}
                        defaultValue={studentData?.idType}
                        onChange={e => {
                          setValue('ifOthersSpecifyTheIdType', e.target.value)
                        }}
                        error={errors.ifOthersSpecifyTheIdType as boolean | undefined}
                        fullWidth
                        label='if Others, Specify the Id Type'
                        helperText={
                          errors.ifOthersSpecifyTheIdType &&
                          (errors.ifOthersSpecifyTheIdType?.message as string | undefined)
                        }
                      />
                    </Grid>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default EditAddress
