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
import { yupResolver } from '@hookform/resolvers/yup'
import { validationAddressSchema } from 'src/views/apps/project/projectstudent/schema'

//import { getName } from 'src/utils'

interface Inational {
  studentData: any
  getStudentDetailById: any
  listOf: IListOfCommonTypes
  stateList: any
  getStateList: any
}

const EditAddress = ({ studentData, getStudentDetailById, listOf, stateList, getStateList }: Inational) => {
  const defaultValues = {
    streetAddress: studentData?.lead?.address?.find(
      (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    )?.street,
    suburb: studentData?.lead?.address?.find(
      (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    )?.suburb,
    town: studentData?.lead?.address?.find((address: { addressType: string }) => address.addressType === 'RESIDENTIAL')
      ?.town,
    state: studentData?.lead?.address?.find((address: { addressType: string }) => address.addressType === 'RESIDENTIAL')
      ?.state,
    city: studentData?.lead?.address?.find((address: { addressType: string }) => address.addressType === 'RESIDENTIAL')
      ?.city,
    province: studentData?.lead?.address?.find(
      (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    )?.province,
    country: studentData?.lead?.address?.find(
      (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    )?.country,
    zipCode: studentData?.lead?.address?.find(
      (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    )?.zipcode

    // idType: studentData?.lead?.identificationDocumentType,
    // ifOthersSpecifyTheIdType: studentData?.lead?.address?.find(
    //   (address: { addressType: string }) => address.addressType === 'RESIDENTIAL'
    // )?.ifOthersSpecifyTheIdType,
    // idNo: studentData?.lead?.identificationNumber
  }
  const {
    handleSubmit,

    //register,
    watch,
    control,

    //setValue,

    reset,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(validationAddressSchema) })

  const [show, setShow] = useState(false)

  const onSubmit = async (data: any) => {
    const payload = {
      street: data?.streetAddress,
      suburb: data?.suburb,
      town: data?.town,
      province: data?.province,
      country: data?.country,
      zipcode: data?.zipCode,

      // identificationDocumentType: data?.idType,
      // ifOthersSpecifyTheIdType: data?.ifOthersSpecifyTheIdType,
      // identificationNumber: data?.idNo
      city: data?.city,
      state: data?.state
    }

    const response = await DashboardService.addUpdateStudentAddressInfo(payload, studentData?.applicationCode)

    if (response?.lead?.studentCode) {
      getStudentDetailById(studentData?.applicationCode)

      successToast(`Student Address Info updated successfully`)
    }
    reset()
    setShow(false)
  }

  const onClose = () => {
    setShow(false)
  }

  useEffect(() => {
    !!studentData && reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData, reset, !show])
  useEffect(() => {
    if (watch('country')) {
      getStateList(watch('country'))
    }
  }, [watch('country')])

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

              {/* <Grid item sm={4} xs={12}>
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
              </Grid> */}
              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  control={control}
                  name='country'
                  options={listOf?.country ?? []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Country'
                      helperText={errors.country && (errors.country?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <ControlledAutocomplete
                  control={control}
                  name='state'
                  options={stateList ?? []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='State'
                      helperText={errors.state && (errors.state?.message as string | undefined)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={errors.town as boolean | undefined}
                      fullWidth
                      label='City'
                      helperText={errors.city && (errors.city?.message as string | undefined)}
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
              {/* <Box style={{ padding: '1rem', borderRadius: 10 }}>
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
              </Box> */}
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
