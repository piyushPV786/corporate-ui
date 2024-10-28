// ** React Imports
import { Fragment, ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography
} from '@mui/material'

// ** Custom Components and Services
import { ProgramNameField } from 'src/styles/style'
import { getName } from 'src/utils'

// Typescript Interface
import { commonListTypes } from 'src/types/apps/dataTypes'
import { IStudentAggregatorTypes } from 'src/types/apps/aggregatorTypes'

// ** Third Party Library
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { DocumentType, feeModeCode, bursoryLetterPending } from 'src/context/common'
import useDebounce from 'src/utils/debounce'
import { FinanceService } from 'src/service'
import { errorToast } from 'src/components/Toast'
import { CloseCircle } from 'mdi-material-ui'

interface IStudentTypeDialogPropsType {
  studentTypeList: commonListTypes[]
  studyModeList: commonListTypes[]
  currencyList: commonListTypes[]
  studentData: IStudentAggregatorTypes
  generateFinalFee: (partialPayment: string, arg1: any, arg2: any) => void
  feeDetails: any
}

const StrongTypography = ({ children, color = '' }: { children: ReactNode; color?: string }) => (
  <Typography color={color}>
    <strong>{children}</strong>
  </Typography>
)

const FinalFeeDialog = ({ studentData, studyModeList, generateFinalFee, feeDetails }: IStudentTypeDialogPropsType) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [discountDetails, setDiscountDetails] = useState(null)
  const [discountedAmount, setDiscountedAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: { payment: 0, discount: undefined },
    mode: 'all'
  })

  const discountCodeWatch = watch('discount')
  const debouncedSearch = useDebounce(discountCodeWatch, 2000)

  const getDiscountDetails = async (debouncedSearch: string) => {
    setLoading(true)
    const discountResponse = await FinanceService?.getDiscountDetail(debouncedSearch)
    if (discountResponse) {
      setDiscountDetails(discountResponse)
      if (totalAmount && discountResponse?.percent > 0) {
        const percentAmount = (totalAmount * parseInt(discountResponse?.percent)) / 100
        setDiscountedAmount(percentAmount)
      } else if (totalAmount && discountResponse?.maxAmount > 0) {
        setDiscountedAmount(discountResponse?.maxAmount)
      }
      setLoading(false)

      return
    }
    setLoading(false)
    setDiscountDetails(null)
    setDiscountedAmount(0)
    errorToast('Your discount code is invalid')
  }

  useEffect(() => {
    if (debouncedSearch) getDiscountDetails(debouncedSearch)
  }, [debouncedSearch])

  const handleOpen = () => {
    reset({ payment: 0 })
    clearDiscount()
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const getStudyModeName = () => {
    const studyModeCode = studentData?.application?.education?.studyModeCode

    return studyModeCode ? getName(studyModeList, studyModeCode) : '-'
  }
  const onSubmit = (data: FieldValues) => {
    reset({}, { keepValues: true })
    generateFinalFee(data.payment, discountDetails, discountedAmount)
    handleClose()
  }

  const calculateTotalAmount = () => {
    let totalFeeAmount = totalAmount
    if (discountedAmount) {
      totalFeeAmount = totalFeeAmount - discountedAmount
    }
    if (Number(watch('payment'))) {
      totalFeeAmount = totalFeeAmount - Number(watch('payment'))
    }

    return totalFeeAmount
  }

  const document = studentData?.document?.map(i => i?.documentTypeCode)
  const isDisable =
    document?.includes(DocumentType?.RegenerateQuote) ||
    !document?.includes(DocumentType?.Quote) ||
    studentData?.application?.status === bursoryLetterPending

  useEffect(() => {
    if (feeDetails && feeDetails?.length && feeDetails[0]?.studyModes) {
      const studyModeCode = studentData?.application?.education?.studyModeCode
      const feesDetails = feeDetails[0]?.studyModes?.find((item: any) => item?.studyModeCode === studyModeCode)

      if (feesDetails?.fees) {
        const fees = feesDetails?.fees?.find((item: any) => item?.feeMode === feeModeCode?.Annually)
        if (fees?.fee) {
          setTotalAmount(fees?.fee)
        }
      }
    }
  }, [feeDetails])

  const clearDiscount = () => {
    reset({ discount: '', payment: 0 })
    setDiscountDetails(null)
    setDiscountedAmount(0)
  }

  return (
    <Fragment>
      <Button onClick={handleOpen} variant='outlined' disabled={isDisable}>
        Generate Final Fee
      </Button>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='assign-student-type'
      >
        {loading && <LinearProgress />}
        <DialogTitle id='assign-student-type' textAlign='center'>
          Generate Final Fee
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container rowSpacing={10} mb={5}>
              <Grid item xs={12}>
                <ProgramNameField container p={5} rowGap={5}>
                  <Grid item xs={7}>
                    <Typography variant='body2' color='common.white'>
                      Application Id
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{studentData?.application?.applicationCode}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2' color='common.white'>
                      Student Name
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{`${studentData?.application?.lead?.firstName} ${studentData?.application?.lead?.lastName}`}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant='body2' color='common.white'>
                      Qualification Name
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{studentData?.application?.education?.programName}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant='body2' color='common.white'>
                      Study Mode
                    </Typography>
                    <Typography color='common.white'>
                      <strong>{getStudyModeName()}</strong>
                    </Typography>
                  </Grid>
                </ProgramNameField>
              </Grid>
              <Grid item xs={12}>
                <Grid container gap={3} justifyContent='end'>
                  <Grid item xs={12}>
                    <Grid container justifyContent='end' gap={3}>
                      <Grid item>
                        <StrongTypography color='dimgray'>Total Annual Fee</StrongTypography>
                      </Grid>
                      <Grid item xs={3} textAlign='end'>
                        <StrongTypography>{totalAmount > 0 ? `R ${totalAmount}` : '-'}</StrongTypography>
                      </Grid>
                    </Grid>
                    {discountedAmount > 0 && (
                      <Grid container justifyContent='end' gap={3}>
                        <Grid item>
                          <StrongTypography color='dimgray'>Total discount Amount</StrongTypography>
                        </Grid>
                        <Grid item xs={3} textAlign='end'>
                          <StrongTypography>{discountedAmount > 0 ? `R ${discountedAmount}.00` : '-'}</StrongTypography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent='end' gap={3}>
                      <Grid item display='flex' alignItems='center'>
                        <StrongTypography color='dimgray'>
                          Discount Code <em>(Optional)</em>
                        </StrongTypography>
                      </Grid>
                      <Grid item xs={3} display='flex' justifyContent='end' alignItems='center' mb={5}>
                        <Controller
                          control={control}
                          name='discount'
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type='text'
                              size='small'
                              sx={{ ml: 2, width: 150 }}
                              InputProps={{
                                endAdornment: (
                                  <>
                                    {!!discountedAmount && (
                                      <IconButton size='small' onClick={clearDiscount}>
                                        <CloseCircle fontSize='small' color='error' />
                                      </IconButton>
                                    )}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent='end' gap={3}>
                      <Grid item display='flex' alignItems='center'>
                        <StrongTypography color='dimgray'>
                          Bursary Amount <em>(Optional)</em>
                        </StrongTypography>
                      </Grid>
                      <Grid item xs={3} display='flex' justifyContent='end' alignItems='center'>
                        <StrongTypography>R</StrongTypography>
                        <Controller
                          control={control}
                          name='payment'
                          rules={{
                            max: {
                              value: Number(totalAmount) ?? 0,
                              message: `Partial Payment must be lower than ${Number(totalAmount)}`
                            },
                            pattern: {
                              value: /^([0-9]\d*)(\.\d+)?$/,
                              message: 'Only Number are allowed'
                            }
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size='small'
                              sx={{ ml: 2, width: 150, input: { textAlign: 'right' } }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {!!errors?.payment ? (
                    <Grid item xs={12}>
                      <FormHelperText error sx={{ textAlign: 'end' }}>
                        {errors?.payment?.message as string | undefined}
                      </FormHelperText>
                    </Grid>
                  ) : null}
                  <Grid
                    item
                    xs={9}
                    sx={{ border: 'none', borderBottom: theme => `1px solid ${theme.palette.grey[500]}` }}
                  />

                  <Grid item xs={12}>
                    <Grid container justifyContent='end' gap={3}>
                      <Grid item>
                        <StrongTypography color='dimgray'>Total</StrongTypography>
                      </Grid>
                      <Grid item xs={3} textAlign='end'>
                        <StrongTypography>{`R ${totalAmount && calculateTotalAmount()}`}</StrongTypography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={!!errors?.payment}>
              Save & Re-Generate Quote
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default FinalFeeDialog
