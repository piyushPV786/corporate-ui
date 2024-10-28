import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  FormHelperText,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import Card from '@mui/material/Card'
import { Fragment, useEffect, useState } from 'react'
import { DocumentType, ErrorMessage, StudentStatus, SuccessMessage, feeModeCode } from 'src/context/common'
import Styles from './GenerateInvoice.module.css'
import { useForm } from 'react-hook-form'

import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { useTheme } from '@mui/material/styles'
import { CheckboxMarkedCircleOutline } from 'mdi-material-ui'
import { ApplyService, FinanceService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import { getConvertedAmount } from 'src/@core/layouts/utils'

interface ProgramData {
  [key: string]: string
}

interface GenerateInvoice {
  lead: any
  document?: []
  payment?: [
    {
      id: string
      documentCode: string
      feeModeCode: string
      totalAmount: string
    }
  ]
  generateInvoice: (payload: any) => Promise<void>
  feeDetails: any
  isRmat: any
  checkPaymentOffline: any
  studyModeCode: string
  paymentFintech: any
  enrolment: any
}

const GenerateInvoice = ({
  lead,
  document,
  payment,
  feeDetails,
  generateInvoice,
  isRmat,
  enrolment,

  // checkPaymentOffline,
  studyModeCode,
  paymentFintech
}: GenerateInvoice) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [checked, setChecked] = useState<{ name: string; value: boolean }[]>([])
  const [newArray, setNewArray] = useState<{ name: string; code: string; fee: string }[]>([])
  const [masterData, setMasterData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [discountCode, setDiscountCode] = useState<string>('')
  const [discountApplied, setDiscountApplied] = useState<boolean>(false)
  const [discountMessage, setDiscountMessage] = useState<string>('')
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [discountAlreadyApplied, setDiscountAlreadyApplied] = useState<boolean>(false)
  const [discount, setDiscount] = useState({
    percent: 0,
    code: '',
    max: 0
  })

  const theme = useTheme()

  const ArrayCreation = () => {
    const tempArray: { name: string; code: string; fee: string }[] = []
    if (feeDetails?.length) {
      if (isRmat?.length) {
        tempArray.push({ name: 'RMAT', code: 'RMAT', fee: feeDetails[0]?.rmatFee })
      }
      feeDetails[0]?.studyModes?.map((item: any) => {
        if (item?.studyModeCode === studyModeCode) {
          return item?.fees?.map((item1: any) => {
            {
              if (item1?.feeMode === 'TOTAL') return
              const isProgramFeeMode =
                item1?.feeMode === feeModeCode?.Monthly ||
                item1?.feeMode === feeModeCode?.Semester ||
                item1?.feeMode === feeModeCode?.Annually

              if (isProgramFeeMode && !tempArray.some(fee => fee.name === 'program')) {
                tempArray.push({ name: 'program', code: item1?.feeMode, fee: item1?.fee })
              } else if (
                item1?.feeMode !== feeModeCode?.Monthly &&
                item1?.feeMode !== feeModeCode?.Semester &&
                item1?.feeMode !== feeModeCode?.Annually
              ) {
                return tempArray.push({ name: item1?.feeMode, code: item1?.feeMode, fee: item1?.fee })
              } else return
            }
          })
        }
      })
    }
    setNewArray(tempArray)
  }

  const paymentType = payment?.filter(item => item?.feeModeCode !== feeModeCode?.Application)

  const getMasterData = async () => {
    const data = await ApplyService.getMasterData()
    setMasterData(data)
  }

  useEffect(() => {
    ArrayCreation()
    getMasterData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeDetails, studyModeCode, isRmat])

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    setValue,
    formState: { errors }
  } = useForm({})

  const transformData = (data: any) => {
    const programKey = data['program']
    const newData: ProgramData = {}
    let payload: {
      feeModeCode: string
      document?: string
      applicationCode: string
      totalPaidAmount: string
      isRmat?: boolean
      discountCode?: string
      discountAmount?: any
    }[] = []

    for (const key in data) {
      if (key === 'program') {
        continue
      } else if (key === feeModeCode?.Monthly || key === feeModeCode?.Semester || key === feeModeCode?.Annually) {
        if (!programKey) {
          continue
        }
        newData[programKey] = data[key]
      } else {
        newData[key] = data[key]
      }
    }

    Object.entries(newData).map(([key, value]) => {
      let ActualAmount = '0'
      {
        feeDetails.length &&
          feeDetails[0]?.studyModes?.map((item: any) => {
            if (item?.studyModeCode === studyModeCode) {
              return item?.fees?.map((item1: any) => {
                {
                  if (item1?.feeMode === key) {
                    ActualAmount = item1?.fee
                  }
                  if (key === 'program' && item1?.feeMode === watch('program')) {
                    ActualAmount = item1?.fee
                  }
                }
              })
            }
          })
      }

      if (key !== 'RMAT') {
        payload?.push({
          feeModeCode: key.toUpperCase(),
          document: value,
          applicationCode: lead?.applicationCode,
          totalPaidAmount: ActualAmount ? ActualAmount : '0',
          isRmat: false
        })
      }

      if (key === 'RMAT') {
        payload?.push({
          feeModeCode: key.toUpperCase(),
          document: value,
          applicationCode: lead?.applicationCode,
          totalPaidAmount: feeDetails && feeDetails?.length ? feeDetails[0]?.rmatFee : 0,
          isRmat: true
        })
      }

      return payload
    })

    // Apply discount to program fee
    if (discountApplied) {
      payload = payload?.map((item: any) => {
        if (
          item.feeModeCode === feeModeCode?.Monthly ||
          item.feeModeCode === feeModeCode?.Semester ||
          item.feeModeCode === feeModeCode?.Annually
        ) {
          const programFee = item.totalPaidAmount
          const discountAmount =
            discount?.percent > 0 ? (parseFloat(programFee) * discount.percent) / 100 : discount?.max
          const finalAmount =
            discount?.percent > 0 && discount?.max > 0 && discountAmount > discount?.max
              ? discount?.max
              : discountAmount
          const finalTotalAmount = parseFloat(programFee) - finalAmount
          item.totalPaidAmount = Math.round(finalTotalAmount)
          item.discountCode = discountCode
          item.discountAmount = Math.round(finalAmount)
        }

        return item
      })
    }

    return payload
  }

  const onSubmit = (param: any) => {
    const payload = transformData(param).filter((item: any) => item?.document !== undefined)

    generateInvoice(payload)
    setChecked([])
    reset()
    setOpenModal(!openModal)
    setDiscountCode('')
    setDiscountApplied(false)
    setDiscountMessage('')
    setDiscountError(null)
    setDiscount({
      percent: 0,
      code: '',
      max: 0
    })
    setDiscountAlreadyApplied(false)
  }

  const resetValue = () => {
    setValue('SEMESTER', '')
    setValue('MONTHLY', '')
    setValue('ANNUALLY', '')
    setDiscountCode('')
    setDiscountApplied(false)
    setDiscountMessage('')
    setDiscountAlreadyApplied(false)
    setChecked([])
  }

  const handleCheckboxChange = (event: any) => {
    const { name, checked: isChecked } = event.target
    setChecked(prevChecked =>
      prevChecked.some(item => item.name === name)
        ? prevChecked.map(item => (item.name === name ? { ...item, value: isChecked } : item))
        : [...prevChecked, { name, value: isChecked }]
    )
    if (!isChecked) {
      resetValue()
      errors && clearErrors(name)
    }
  }

  const ProgramFee =
    feeDetails &&
    feeDetails?.length &&
    feeDetails[0]?.studyModes.filter((item: { studyModeCode: string }) => item?.studyModeCode === studyModeCode)

  const options = ProgramFee[0]?.fees?.map((item: { feeMode: any }) => {
    return {
      name: item?.feeMode,
      code: item?.feeMode
    }
  })

  const checkDiscountCode = async (docCode: any) => {
    const findDiscountCode: any = payment?.find((data: any) => data?.documentCode == docCode && data.discountCode)
    if (findDiscountCode && findDiscountCode?.discountCode) {
      setDiscountCode(findDiscountCode?.discountCode)
      try {
        const response = await FinanceService.getCouponDiscountDetails(findDiscountCode?.discountCode)
        updateDiscountDetail(response)
        setDiscountAlreadyApplied(true)
      } catch (error: any) {
        errorToast(error?.data?.message)
        setDiscountAlreadyApplied(false)
      }
    } else {
      setDiscountCode('')
      setDiscountApplied(false)
      setDiscountMessage('')
      setDiscountAlreadyApplied(false)
    }
  }

  const docMode = watch('SEMESTER') || watch('MONTHLY') || watch('ANNUALLY')

  useEffect(() => {
    checkDiscountCode(docMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docMode])

  useEffect(() => {
    resetValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('program')])

  const updateDiscountDetail = (res: any) => {
    if (res?.managementCode) {
      if (res?.maxAmount && res.applicationCode === lead?.applicationCode) {
        setDiscount({
          percent: res?.percent,
          code: res?.managementCode,
          max: res?.maxAmount
        })
        const discountAmount = res?.percent > 0 ? (parseFloat(programFee) * res?.percent) / 100 : res?.maxAmount
        const finalAmount =
          res?.percent > 0 && res?.maxAmount > 0 && discountAmount > res?.maxAmount ? res?.maxAmount : discountAmount
        setDiscountApplied(true)
        setDiscountMessage(`${SuccessMessage.customDiscountSuccessMsg} R ${finalAmount}.`)
        setDiscountError(null)
        successToast(
          `${SuccessMessage.discountSuccessMessage} ${res?.percent} % or Max Amount ${
            masterData?.currencyData?.currencySymbol ? masterData?.currencyData?.currencySymbol : ''
          } ${getConvertedAmount(masterData?.currencyData, String(res?.maxAmount))} `
        )
      } else {
        setDiscountApplied(false)
        setDiscountError(ErrorMessage.customDiscountMsg)
        errorToast(ErrorMessage.discountErrorMessage)
        setDiscountAlreadyApplied(false)
      }
    } else {
      if (res) {
        if (parseInt(res?.maxAmount) > parseInt(programFee)) {
          setDiscountApplied(false)
          setDiscountError(ErrorMessage.customDiscountMsg)
          errorToast(ErrorMessage.discountErrorMessage)
          setDiscountAlreadyApplied(false)
        } else {
          setDiscount({
            percent: res?.percent,
            code: res?.discountCode,
            max: res?.maxAmount
          })
          const discountAmount = res?.percent > 0 ? (parseFloat(programFee) * res?.percent) / 100 : res?.maxAmount
          const finalAmount =
            res?.percent > 0 && res?.maxAmount > 0 && discountAmount > res?.maxAmount ? res?.maxAmount : discountAmount
          setDiscountApplied(true)
          setDiscountMessage(`${SuccessMessage.customDiscountSuccessMsg} R ${finalAmount}.`)
          setDiscountError(null)
          successToast(
            `${SuccessMessage.discountSuccessMessage} ${res?.percent} % or Max Amount ${
              masterData.currencyData?.currencySymbol ? masterData.currencyData?.currencySymbol : ''
            } ${getConvertedAmount(masterData?.currencyData, String(res?.maxAmount))} `
          )
        }
      } else {
        setDiscountApplied(false)
        setDiscountError(ErrorMessage.customDiscountMsg)
        errorToast(ErrorMessage.discountErrorMessage)
        setDiscountAlreadyApplied(false)
      }
    }
  }

  const programFee =
    ProgramFee[0]?.fees?.filter((item1: { feeMode: any }) => watch('program') === item1?.feeMode)[0]?.fee || 0

  const applyDiscount = async (discountCode: string) => {
    setLoading(true)
    try {
      const res = await ApplyService.applicationDiscount(
        lead?.education?.studentTypeCode,
        lead?.applicationCode,
        discountCode
      )
      updateDiscountDetail(res)
    } catch (error: any) {
      errorToast(error?.data?.message)
      setDiscountAlreadyApplied(false)
    }

    setLoading(false)
  }

  const cancelDiscount = () => {
    setDiscount({
      percent: 0,
      code: '',
      max: 0
    })
    setDiscountCode('')
    setDiscountApplied(false)
    setDiscountMessage('')
    setDiscountError(null)
  }

  const getDiscountValue = () => {
    const discountAmount = discount?.percent > 0 ? (parseFloat(programFee) * discount.percent) / 100 : discount?.max
    const finalAmount =
      discount?.percent > 0 && discount?.max > 0 && discountAmount > discount?.max ? discount?.max : discountAmount
    const finalTotalAmount = parseFloat(programFee) - finalAmount

    return finalTotalAmount?.toFixed(2) || 0
  }

  const checkDisable = () => {
    if (lead?.status === StudentStatus?.appDocUploaded || lead?.status === StudentStatus?.programFeeVerificationPend) {
      return true
    }

    return false
  }

  return (
    <Grid>
      <Box className={Styles.ButtonBox}>
        <Button
          variant='outlined'
          size='medium'
          color='primary'
          onClick={() => setOpenModal(!openModal)}
          disabled={!checkDisable()}
        >
          Generate Invoice
        </Button>
      </Box>
      <Dialog
        fullWidth
        open={openModal!}
        maxWidth='sm'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && setOpenModal(!openModal)
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle textAlign='center'>Generate Reggie Invoice</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container className={Styles.overrideContainer} p={3} py={5}>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      Student ID
                    </Typography>
                    <Typography color='white' variant='subtitle2' pt={2}>
                      {lead?.lead?.studentCode || '-'}
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      Student Name
                    </Typography>
                    <Typography color='white' variant='subtitle2' pt={2}>
                      {lead?.lead?.firstName ? `${lead?.lead?.firstName} ${lead?.lead?.lastName}` : '-'}
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      Qualification Details
                    </Typography>

                    <Typography color='white' variant='subtitle2' pt={2}>
                      {lead?.education?.programName || '-'}
                    </Typography>
                    <Typography color='white' variant='caption'>
                      {enrolment?.registrationDate ? new Date(enrolment.registrationDate).getFullYear() : '-'} |{' '}
                      {lead?.education?.studentTypeCode || '-'}
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      Payment Type
                    </Typography>
                    <Typography color='white' variant='subtitle2' pt={2}>
                      {paymentType?.[0]?.feeModeCode || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {/* {payment?.some(
                    item =>
                      item?.feeModeCode === feeModeCode?.Monthly ||
                      item?.feeModeCode === feeModeCode?.Semester ||
                      item?.feeModeCode === feeModeCode?.Annually
                  ) && ( */}
                  <>
                    <Grid item sx={{ fontWeight: '800' }} sm={12}>
                      Select Payment Type
                    </Grid>
                    <Grid item sm={12} mt={2} mb={2}>
                      <ControlledAutocomplete
                        control={control}
                        name='program'
                        options={
                          options &&
                          options.filter(
                            (item: { name: string }) => item?.name !== 'APPLICATION' && item?.name !== 'TOTAL'
                          )
                        }
                        renderInput={params => (
                          <TextField {...params} label='Select File' error={Boolean(errors?.program)} />
                        )}
                      />
                      {errors?.program && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-name'>
                          Please select Type
                        </FormHelperText>
                      )}
                    </Grid>
                  </>
                  {docMode && (
                    <Grid item sm={12} container mt={5} mb={2}>
                      <Grid item sm={12}>
                        <TextField
                          label='Discount Code (Optional)'
                          variant='outlined'
                          value={discountCode}
                          onChange={e => setDiscountCode(e.target.value)}
                          helperText={discountError}
                          error={Boolean(discountError)}
                          fullWidth
                          style={{ paddingRight: 0 }}
                          disabled={discountAlreadyApplied || !!discountApplied}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                {!discountApplied ? (
                                  <Button
                                    className={Styles.DiscountBtn}
                                    variant='contained'
                                    color='primary'
                                    onClick={() => applyDiscount(discountCode)}
                                    sx={{ padding: '15px' }}
                                    disabled={loading || discountAlreadyApplied || !discountCode}
                                  >
                                    {loading ? <CircularProgress size={24} /> : 'Apply'}
                                  </Button>
                                ) : (
                                  <Button
                                    variant='contained'
                                    color='error'
                                    onClick={cancelDiscount}
                                    className={Styles.DiscountBtn}
                                    sx={{ padding: '15px' }}
                                    disabled={discountAlreadyApplied}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </InputAdornment>
                            ),
                            sx: { paddingRight: 0 }
                          }}
                        />
                        {discountApplied && (
                          <Typography color='success.main' mt={3} sx={{ margin: '5px 0px', display: 'flex' }}>
                            <CheckboxMarkedCircleOutline sx={{ marginRight: 1 }} />
                            {discountMessage}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container sx={{ marginTop: '2rem' }}>
                    <Grid item sx={{ fontWeight: '800' }} sm={12}>
                      Select Fee Type
                    </Grid>
                    <Grid item sm={12}>
                      {newArray?.map((item: any, key) => {
                        const verify = checked?.find(item1 => item1?.name === item?.name)
                        const ProgramFeeCheck =
                          item?.code === feeModeCode?.Monthly ||
                          item?.code === feeModeCode?.Semester ||
                          item?.code === feeModeCode?.Annually
                        const isDescriptionMatching = (itemCode: any) => {
                          return paymentFintech.some(() => {
                            if (
                              lead?.status !== StudentStatus?.appDocUploaded &&
                              itemCode === feeModeCode?.Application
                            ) {
                              return true
                            }
                            if (
                              lead?.status !== StudentStatus?.programFeeVerificationPend &&
                              [feeModeCode?.Monthly, feeModeCode?.Semester, feeModeCode?.Annually].includes(itemCode)
                            ) {
                              return true
                            }
                            if (lead?.status !== StudentStatus?.appDocUploaded && itemCode === 'RMAT') {
                              return true
                            }

                            return false
                          })
                        }

                        return (
                          <Card key={key} className={Styles.Card}>
                            <CardContent className={Styles.CardContent}>
                              <Grid container>
                                <Grid container item sm={6}>
                                  <FormControl component='fieldset' variant='standard' fullWidth>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name={item?.name}
                                          onChange={handleCheckboxChange}
                                          checked={!!checked.find(item1 => item1?.name === item?.name && item1?.value)}
                                          disabled={
                                            (!watch('program') &&
                                              (item?.code === feeModeCode?.Monthly ||
                                                item?.code === feeModeCode?.Semester ||
                                                item?.code === feeModeCode?.Annually)) ||
                                            isDescriptionMatching(item?.code)
                                          }
                                        />
                                      }
                                      sx={{ ' & .MuiFormControlLabel-label': { width: '100% !important' } }}
                                      label={
                                        ProgramFeeCheck ? (
                                          <>
                                            <Typography
                                              sx={
                                                verify?.value
                                                  ? {
                                                      color: theme.palette.primary.light,
                                                      fontWeight: '800'
                                                    }
                                                  : { fontWeight: '800', display: 'flex', width: 'max-content' }
                                              }
                                            >
                                              {`Program Fee (R ${
                                                ProgramFee[0]?.fees?.filter(
                                                  (item1: { feeMode: any }) => watch('program') === item1?.feeMode
                                                )[0]?.fee || 0
                                              })`}{' '}
                                              {discountApplied && (
                                                <Fragment>
                                                  &nbsp;&nbsp;{' '}
                                                  <span
                                                    style={{ color: '#008554' }}
                                                  >{`, Total Fee After Discount (R ${getDiscountValue()}}`}</span>
                                                </Fragment>
                                              )}
                                            </Typography>
                                            <Typography variant='caption'>{watch('program') || '-'}</Typography>
                                          </>
                                        ) : (
                                          <Typography
                                            sx={
                                              verify?.value
                                                ? { color: theme.palette.primary.light, fontWeight: '800' }
                                                : { fontWeight: '800' }
                                            }
                                          >{`${item?.code || '-'} (R ${item?.fee})`}</Typography>
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                {verify?.value && (
                                  <Grid item sm={6}>
                                    <ControlledAutocomplete
                                      rules={{ required: true }}
                                      control={control}
                                      name={item?.code}
                                      options={
                                        document?.filter(
                                          (item: any) =>
                                            item?.status != 'PENDING' &&
                                            (item?.documentTypeCode === DocumentType?.PaymentProof ||
                                              item?.documentTypeCode === DocumentType?.BursaryLetter)
                                        ) ?? []
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          label='Select File'
                                          error={Boolean(errors[item?.code])}
                                        />
                                      )}
                                    />
                                    {errors[item?.code] && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-name'>
                                        Please select File
                                      </FormHelperText>
                                    )}
                                  </Grid>
                                )}
                              </Grid>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setOpenModal(!openModal)
                reset()
                setChecked([])
                clearErrors()
                setDiscountCode('')
                setDiscountApplied(false)
                setDiscountMessage('')
                setDiscountError(null)
                setDiscount({
                  percent: 0,
                  code: '',
                  max: 0
                })
                setDiscountAlreadyApplied(false)
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              type='submit'
              disabled={checked?.some((item: any) => item?.value !== true) || checked?.length === 0}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}
export default GenerateInvoice
