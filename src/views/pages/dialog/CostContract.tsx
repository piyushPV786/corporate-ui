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

import { Controller, useForm } from 'react-hook-form'
import { userInformationStatus } from 'src/context/common'

import {
  FormControl,
  FormHelperText,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Autocomplete
} from '@mui/material'
import { IPayloadTypes } from 'src/types/apps/invoiceTypes'
import { ArrowRightBottom } from 'mdi-material-ui'
import RequiredLabel from 'src/components/RequiredLabel'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface IFormDataTypes {
  id: number
  fullCost?: number
  contractCost?: number
  variance?: string
  varianceDetails?: string
  paymentType: string
}

interface ICostContractDialogProps {
  handleClickSuccess: () => void
  handleEditSuccess: () => void
  data: IFormDataTypes
  createCostContract: (arg: IPayloadTypes) => void
  paymentTypeList: any[]
}

const CostContractDetail = ({
  handleClickSuccess,
  data,
  handleEditSuccess,
  createCostContract,
  paymentTypeList
}: ICostContractDialogProps) => {
  const [show, setShow] = useState<boolean>(false)
  const [showVariance, setShowVariance] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm()

  const onSubmit = async (formData: any) => {
    const payload: IPayloadTypes = {
      fullCost: Number(formData.fullCost),
      contractCost: Number(formData.contractCost),
      paymentType: formData.paymentType,
      variance: formData.variance === 'yes',
      varianceDetails: formData.varianceDetails
    }

    createCostContract(payload)
    setShow(false)
    !!data ? handleEditSuccess() : handleClickSuccess()
    reset()
  }

  const handleCancel = () => {
    setShow(false)
    reset()
  }

  function handleClick(value: string) {
    setValue('variance', value)
    value === 'yes' ? setShowVariance(true) : setShowVariance(false)
  }
  useEffect(() => {
    reset({
      fullCost: data?.fullCost,
      contractCost: data?.contractCost,
      paymentType: data?.paymentType,
      variance: !data ? 'no' : data?.variance ? 'yes' : 'no',
      varianceDetails: data?.varianceDetails
    })
    if (data?.variance) {
      setShowVariance(true)
    }
  }, [data])

  return (
    <Grid>
      <Box>
        <Button size='small' variant='contained' onClick={() => setShow(true)}>
          Add or Edit
        </Button>
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
                Manage Cost and Contract Details
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  inputProps={{ min: 0 }}
                  type='number'
                  {...register('fullCost', {
                    required: userInformationStatus.CostOfTrainingQuoteRequired,
                    validate: value => {
                      if (value <= 0) {
                        return 'Full cost must be greater than 0'
                      } else if (value > 1000000) {
                        return 'Full cost must not exceed 1000000'
                      }
                    }
                  })}
                  fullWidth
                  label={<RequiredLabel label='Full Cost of Training Quoted (in Rand)' />}
                  defaultValue={data?.fullCost}
                  error={!!errors?.fullCost}
                  onChange={e => {
                    const value = parseFloat(e.target.value)
                    setValue('fullCost', value)
                    if (value > 0 && value <= 1000000) {
                      clearErrors('fullCost')
                    }
                  }}
                  helperText={errors.fullCost && (errors.fullCost?.message as string | undefined)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  inputProps={{ min: 0 }}
                  type='number'
                  {...register('contractCost', {
                    required: userInformationStatus.ContractCostRequired,
                    validate: value => {
                      if (value <= 0) {
                        return 'Contract cost must be greater than 0'
                      } else if (value > 1000000) {
                        return 'Contract cost must not exceed 1000000'
                      }
                    }
                  })}
                  fullWidth
                  label={<RequiredLabel label='Contract Cost' />}
                  defaultValue={data?.contractCost}
                  error={!!errors?.contractCost}
                  onChange={e => {
                    const value = parseFloat(e.target.value)
                    setValue('contractCost', value)
                    if (value > 0 && value <= 1000000) {
                      clearErrors('contractCost')
                    }
                  }}
                  helperText={errors.contractCost && (errors.contractCost?.message as string | undefined)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Box>
                  <FormLabel id='variance' sx={{ pl: 4 }}>
                    <RequiredLabel label='Variance' />
                  </FormLabel>
                  <Controller
                    name='variance'
                    control={control}
                    rules={{ required: userInformationStatus.VarianceRequired }}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RadioGroup
                        row
                        aria-labelledby='variance'
                        value={value || 'no'}
                        onChange={e => {
                          onChange(e.target.value)
                          handleClick(e.target.value)
                        }}
                      >
                        <FormControlLabel sx={{ pl: 4 }} value='yes' control={<Radio />} label='Yes' />
                        <FormControlLabel sx={{ pl: 3 }} value='no' control={<Radio />} label='No' />
                        {showVariance && (
                          <Box display={'flex'} pl={5}>
                            <ArrowRightBottom color='success' fontSize='large' />
                            <TextField
                              {...register('varianceDetails', {
                                required: userInformationStatus.VarianceDetailRequired
                              })}
                              fullWidth
                              label={<RequiredLabel label='Variance Details' />}
                              defaultValue={data?.varianceDetails}
                              error={!!errors?.varianceDetails}
                              onChange={e => setValue('varianceDetails', e.target.value)}
                              helperText={
                                errors.varianceDetails && (errors.varianceDetails?.message as string | undefined)
                              }
                            />
                          </Box>
                        )}
                      </RadioGroup>
                    )}
                  />
                  <FormHelperText error>{errors.variance?.message as any}</FormHelperText>
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl error={!!errors?.paymentType} fullWidth>
                  <Autocomplete
                    fullWidth
                    {...register('paymentType', { required: userInformationStatus.PaymentTypeRequired })}
                    style={{ width: '100%' }}
                    options={paymentTypeList}
                    onChange={(_, value) => {
                      value && setValue('paymentType', value.paymentCode)
                      clearErrors('paymentType')
                    }}
                    value={paymentTypeList?.find(i => i.paymentCode === watch('paymentType'))}
                    getOptionLabel={option => option.paymentName}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={<RequiredLabel label='Payment Type' />}
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />

                  {errors.paymentType && errors.paymentType && (
                    <FormHelperText>{errors.paymentType?.message as string | undefined}</FormHelperText>
                  )}
                </FormControl>
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

export default CostContractDetail
