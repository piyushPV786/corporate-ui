// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { isValid, isAfter, isEqual, startOfDay } from 'date-fns'

import { useForm } from 'react-hook-form'
import { userInformationStatus } from 'src/context/common'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Autocomplete, FormControl, FormHelperText, IconButton } from '@mui/material'
import { PencilOutline } from 'mdi-material-ui'
import { InvoiceEditInstallmentType, ICurrencyList } from 'src/types/apps/invoiceTypes'
import { formatDate } from 'src/utils'
import RequiredLabel from 'src/components/RequiredLabel'
import { addInstallmentMessage } from 'src/context/common'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface IInstallmentDialogProps {
  handleClickSuccess?: () => void
  handleEditClick?: () => void
  type: string
  AddInstallment?: any
  data?: any
  EditInstallment?: (arg: InvoiceEditInstallmentType, id: number) => void
  currencyList: ICurrencyList[]
}

const regex = /^[a-zA-Z_].*$/

const schema = yup.object().shape({
  name: yup
    .string()
    .required(userInformationStatus.InstallmentNameRequired)
    .matches(regex, addInstallmentMessage.installmentNameError),
  currency: yup.string().required(userInformationStatus.CurrencyRequired),
  dueAmount: yup
    .number()
    .positive(userInformationStatus.DueAmountPositiveError)
    .required(userInformationStatus.DueAmountRequired)
    .typeError(userInformationStatus.DueAmountRequiredError),
  dueDate: yup
    .string()
    .nullable()
    .required(userInformationStatus.DueDateRequired)
    .typeError('Invalid Date')
    .test('is-valid-date', 'Invalid Date', (value: any) => {
      return isValid(new Date(value))
    })
    .test('is-today-or-future-date', 'Due date must be today or a future date', (value: any) => {
      const today = startOfDay(new Date())
      const dueDate = new Date(value)

      return isAfter(dueDate, today) || isEqual(dueDate, today)
    })
})

const InstallmentDetail = ({
  handleClickSuccess,
  handleEditClick,
  type,
  AddInstallment,
  data,
  EditInstallment,
  currencyList
}: IInstallmentDialogProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      currency: '',
      dueAmount: '',
      dueDate: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = async (formData: any) => {
    const payload: any = {
      dueAmount: Number(formData.dueAmount),
      currency: formData.currency,
      name: formData.name,
      dueDate: formatDate(formData.dueDate, 'yyyy-MM-dd')
    }

    type === 'add' ? AddInstallment && AddInstallment(payload) : null
    type === 'edit' ? EditInstallment && EditInstallment(payload, data?.id) : null

    setShow(false)

    type === 'add' ? handleClickSuccess && handleClickSuccess() : handleEditClick && handleEditClick()
    reset()
  }

  const handleCancel = () => {
    setShow(false)
    reset()
  }

  // ** States
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      reset({
        name: data?.name,
        currency: data?.currency,
        dueAmount: data?.dueAmount,
        dueDate: data?.dueDate
      })
    }
  }, [data])

  return (
    <Grid>
      <Box>
        {type === 'edit' ? (
          <IconButton
            onClick={() => setShow(true)}
            size='small'
            component='a'
            color='primary'
            sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
          >
            <PencilOutline />
          </IconButton>
        ) : (
          <Button size='small' variant='contained' onClick={() => setShow(true)}>
            Add Installment
          </Button>
        )}
      </Box>

      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setShow(false)
          }
        }}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Manage Installment Details
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label={<RequiredLabel label='Installment Name' />}
                  {...register('name')}
                  defaultValue={data?.name}
                  onChange={e => {
                    setValue('name', e.target.value)
                  }}
                  error={!!errors.name}
                  helperText={errors.name && (errors.name?.message as string | undefined)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl error={errors.currency as boolean | undefined} fullWidth>
                  <Autocomplete
                    fullWidth
                    {...register('currency')}
                    style={{ width: '100%' }}
                    options={currencyList}
                    onChange={(_, value) => {
                      value && setValue('currency', value.code)
                      clearErrors('currency')
                    }}
                    value={currencyList?.find(i => i.code === watch('currency'))}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField {...params} label={<RequiredLabel label='Currency' />} variant='outlined' fullWidth />
                    )}
                  />

                  {errors.currency && errors.currency && (
                    <FormHelperText>{errors.currency?.message as string | undefined}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  inputProps={{ min: 0, max: 1000000 }}
                  {...register('dueAmount')}
                  fullWidth
                  type='number'
                  label={<RequiredLabel label='Due Amount' />}
                  defaultValue={data?.dueAmount}
                  error={errors.dueAmount as boolean | undefined}
                  onChange={e => {
                    setValue('dueAmount', e.target.value)
                  }}
                  helperText={errors.dueAmount && (errors.dueAmount?.message as string | undefined)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={<RequiredLabel label='Due Date' />}
                    value={watch('dueDate') || null}
                    disablePast
                    inputFormat='dd/MM/yyyy'
                    onChange={(value: any) => setValue('dueDate', value, { shouldValidate: true })}
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
                  <FormHelperText sx={{ color: 'red' }}>{errors.dueDate?.message as string | undefined}</FormHelperText>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleCancel}>
              cancel
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

export default InstallmentDetail
