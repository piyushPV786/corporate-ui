/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

// ** Third Party Styles Imports
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import { PencilOutline } from 'mdi-material-ui'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import AlertBox from 'src/layouts/components/Alert'
import { useForm } from 'react-hook-form'
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Typography
} from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import RequiredLabel from 'src/components/RequiredLabel'

const schema = yup.object().shape({
  name: yup.string().max(200).required('Venue is required'),
  facilitator: yup.string().max(200).required('Facilitator is required'),
  date: yup.string().nullable().required('Date is required')
})

const VenueDetailsDialog = ({ title, data, createVenue, handleEdit, facilitatorList }: any) => {
  // ** State
  const [show, setShow] = useState<boolean>(false)

  const handleAddVenueDetails = async () => {
    setShow(true)
  }

  const handleEditClick = async () => {
    setShow(true)
  }

  const id: number | string = data ? data.id : ''

  const defaultFormData = {
    name: data?.name || '',
    facilitator: data?.facilitator || '',
    date: data?.date ? new Date(data.date) : new Date()
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<any>({
    defaultValues: defaultFormData,
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (show) {
      reset(defaultFormData) // Reset form when dialog opens
    }
  }, [show, reset, data])

  const onSubmit = (param: any) => {
    createVenue && createVenue(param)
    handleEdit && handleEdit(param, data.id)
    reset()
    setShow(false)
  }

  return (
    <>
      <Grid>
        <Box display='flex' justifyContent='flex-end'>
          {data ? (
            <Box>
              <IconButton
                onClick={handleEditClick}
                size='small'
                component='a'
                color='primary'
                sx={{ textDecoration: 'none', mr: 2, border: '1px solid green' }}
              >
                <PencilOutline />
              </IconButton>
            </Box>
          ) : (
            <Button size='small' variant='contained' onClick={handleAddVenueDetails} sx={{ color: 'white' }}>
              <Typography sx={{ color: 'white' }}>Add Venue Details</Typography>
            </Button>
          )}
        </Box>
        <Dialog
          open={show}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 750, p: [2, 10] } }}
          aria-describedby='user-view-edit-description'
          onClose={(event, reason) => {
            reason != 'backdropClick' && setShow(false)
          }}
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            {title} Venue Details
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    {...register('name', { required: true })}
                    fullWidth
                    label={<RequiredLabel label='Venue' />}
                    error={!!errors.name as boolean | undefined}
                    helperText={errors.name?.message as string | undefined}
                    onChange={event => {
                      setValue('name', event.target.value)
                      clearErrors('name')
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      fullWidth
                      {...register('facilitator', { required: true })}
                      style={{ width: '100%' }}
                      options={facilitatorList}
                      onChange={(_, value) => {
                        value && setValue('facilitator', value.code)
                        clearErrors('facilitator')
                      }}
                      value={facilitatorList?.find((i: any) => i.code === watch('facilitator'))}
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={<RequiredLabel label='Facilitator' />}
                          variant='outlined'
                          fullWidth
                        />
                      )}
                    />

                    {errors.facilitator && (
                      <FormHelperText sx={{ color: 'error.main' }} id='facilitator'>
                        {errors.facilitator.message as string | undefined}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label={<RequiredLabel label='Date' />}
                      value={watch('date') || null}
                      disablePast
                      inputFormat='dd/MM/yyyy'
                      onChange={value => setValue('date', value, { shouldValidate: true })}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: theme => theme.palette.primary.main
                            }
                          }}
                        />
                      )}
                    />
                    <FormHelperText sx={{ color: 'red' }}>{errors.date?.message as string | undefined}</FormHelperText>
                  </LocalizationProvider>
                </Grid>
              </Grid>
              {data &&
              (data.name !== watch('name') ||
                data.facilitator !== watch('facilitator') ||
                new Date(data.date).getTime() !== new Date(watch('date')).getTime()) ? (
                <AlertBox
                  sx={{ mb: 6 }}
                  color='warning'
                  variant={'filled ' as any}
                  header='Unsaved Changes'
                  message='You have made changes. Do you want to save or cancel them?'
                  severity='warning'
                />
              ) : null}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  reset()
                  setShow(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' variant='contained'>
                <Typography sx={{ color: 'white' }}>{data ? 'Save' : 'Add Venue'}</Typography>
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </>
  )
}

export default VenueDetailsDialog
