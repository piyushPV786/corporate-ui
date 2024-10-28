import { yupResolver } from '@hookform/resolvers/yup'
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { errorToast, successToast } from 'src/components/Toast'
import { userInformationStatus } from 'src/context/common'
import { messages, status, feeMode } from 'src/context/common'
import {
  IFee,
  IFlexiPayData,
  IFlexiPayFeeStructure,
  IGenerateQuoteParams,
  IProgramCodeData,
  IStudyMode
} from 'src/types/apps/quoteGenerationInterface'
import { AcademicService, CommonService, DashboardService, FinanceService, ApplyService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import * as yup from 'yup'
import 'react-phone-input-2/lib/material.css'
import FallbackSpinner from 'src/@core/components/spinner'
import { DataGrid } from '@mui/x-data-grid'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import EditSponsorDialogCustomHook from './stateCustomHook'
import { isValidEmail, downloadFile } from 'src/utils'

const schema = yup.object().shape({
  studentCode: yup.string().nullable().notRequired(),
  firstName: yup
    .string()
    .matches(/^(?!.*\d).*$/, userInformationStatus.FirstNameError)
    .matches(/^\D*$/, userInformationStatus.FirstNameError)
    .required(userInformationStatus.FirstNameRequired)
    .matches(/^(?!.*\d).*$/, userInformationStatus.FirstNameError)
    .matches(/^\D*$/, userInformationStatus.FirstNameError)
    .matches(/^[a-zA-Z._-]+(?:\s[a-zA-Z._-]+)*$/, userInformationStatus.FirstNameSpace),
  middleName: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[a-zA-Z\s_-]*$/, userInformationStatus.MiddleNameError)
    .matches(/^(?!.*\d).*$/, userInformationStatus.MiddleNameError),
  lastName: yup
    .string()
    .required(userInformationStatus.LastNameRequired)
    .matches(/^[a-zA-Z\s_-]*$/, userInformationStatus.LastNameError)
    .matches(/^(?!.*\d).*$/, userInformationStatus.LastNameError),
  email: yup
    .string()
    .email()
    .required(userInformationStatus.EmailRequired)
    .matches(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      userInformationStatus.EmailInvalid
    ),
  mobileNumber: yup.string().required(userInformationStatus.MobileNumber),
  address1: yup.string().nullable().notRequired(),
  country: yup
    .string()
    .nullable()
    .when('address1', (address1, schema) => {
      return address1 ? schema.required('Country is required when address1 is provided.') : schema.notRequired()
    }),
  state: yup
    .string()
    .nullable()
    .when('address1', (address1, schema) => {
      return address1 ? schema.required('State is required when address1 is provided.') : schema.notRequired()
    }),

  city: yup
    .string()
    .nullable()
    .when('address1', (address1, schema) => {
      return address1 ? schema.required('City is required when address1 is provided.') : schema.notRequired()
    }),

  pincode: yup
    .string()
    .nullable()
    .when('address1', (address1, schema) => {
      return address1
        ? schema
            .required('Pincode is required when address1 is provided.')
            .min(4, 'Minimum length should be 4.')
            .max(6, 'Maximum length should be 6.')
        : schema.notRequired()
    }),
  programCode: yup.string().required(userInformationStatus.program),
  studyModeCode: yup.string().nullable().required(userInformationStatus.studyMode),
  currency: yup.string().nullable().required(userInformationStatus.CurrencyRequired),
  paymentMode: yup.string().nullable().required(userInformationStatus.PaymentMode),
  nationality: yup.string().required(userInformationStatus.Nationality),
  identificationDocumentType: yup.string().required(userInformationStatus.DocumentType),
  identificationNumber: yup
    .string()
    .required(userInformationStatus.IdentificationNumber)
    .min(8, 'Minimum length should be 8.')
    .max(13, 'Maximum 13 characters allowed.')
    .matches(/^[a-zA-Z0-9]+$/, userInformationStatus.IdentificationType)
    .test(
      'is-valid-id',
      'Identification number must be 13 digits and contain only numbers for SMARTID.',
      function (value) {
        const { identificationDocumentType } = this.parent
        if (identificationDocumentType === 'SMARTID') {
          if (typeof value === 'string' && /^\d{13}$/.test(value)) {
            return true
          } else {
            return false // Return false if value is not a string or doesn't match the pattern
          }
        }

        return true
      }
    ),
  mobileCountryCode: yup.string().required(),
  flexiPayOption: yup.string().notRequired(),
  programData: yup.object().notRequired()
})

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const defaultValues: IGenerateQuoteParams = {
  studentCode: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  address1: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  programCode: '',
  studyModeCode: '',
  currency: '',
  paymentMode: '',
  identificationNumber: '',
  identificationDocumentType: '',
  mobileCountryCode: '',
  nationality: '',
  flexiPayOption: '',
  programData: {
    programCode: '',
    programName: '',
    studyModes: [],
    rmatFee: 0,
    rplFee: 0,
    otherFee: 0,
    duration: 0
  },
  passportExpiryDate: null
}

interface QuoteGenerationFormProps {
  formData: any
  submitForm: (data: any) => void
  resetForm: boolean
  onReset: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setGenerateBtnEnable: React.Dispatch<React.SetStateAction<boolean>>
}

const GenerateQuotesForm: React.FC<QuoteGenerationFormProps> = ({
  formData,
  submitForm,
  resetForm,
  onReset,
  loading,
  setLoading,
  setGenerateBtnEnable
}) => {
  const [programList, setProgramList] = useState<any[]>([])
  const [nationality, setNationality] = useState<commonListTypes[]>([])
  const [originalProgramData, setOriginalProgramData] = useState<IProgramCodeData>(defaultValues.programData)
  const [formatedProgramData, setFormatedProgramData] = useState<IProgramCodeData | null>(null)
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const [masterData, setMasterData] = useState<any>([])
  const [isPaymentModeEnabled, setIsPaymentModeEnabled] = useState<boolean>(true)
  const [programFeeData, setProgramFeeData] = useState<IStudyMode | null>(null)
  const [showFlexiPayOptions, setShowFlexiPayOptions] = useState<boolean>(false)
  const [flexiPayData, setFlexiPayData] = useState<any>({})
  const [flexiPayOptionsList, setFlexiPayOptionsList] = useState<any>({})
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [columns, setColumns] = useState<any[]>([])
  const [currencyRateList, setCurrencyRateList] = useState<any>([])
  const [feeError, setFeeError] = useState<string>('')

  let convertedCurrency: any = {}

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<any>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const email = watch('email')
  const mobileNumber = watch('mobileNumber')
  const watchNationality = watch('nationality')
  const identificationDocumentType = watch('identificationDocumentType')
  const iidentificationNumber = watch('identificationNumber')
  const programCode = watch('programCode')
  const studyModeCode = watch('studyModeCode')
  const currency = watch('currency')
  const paymentMode = watch('paymentMode')
  const address = watch('address1')
  const countryCode = watch('country')
  const state = watch('state')
  const pincode = watch('pincode')

  const { statesList } = EditSponsorDialogCustomHook(countryCode, setLoadingState)

  const handleOnBlur = (date: Date) => {
    const isDate = !isNaN(new Date(watch('passportExpiryDate')).getTime())
    if (isDate) {
      const selectedDate = date.toISOString().split('T')[0]
      const currentDate = new Date().toISOString().split('T')[0]

      if (selectedDate < currentDate) {
        setError('passportExpiryDate', {
          type: 'custom',
          message: 'Please Select Valid Expiry Date'
        })
      } else {
        clearErrors('passportExpiryDate')
      }
    } else {
      setError('passportExpiryDate', {
        type: 'custom',
        message: 'Please Select Valid Expiry Date'
      })
    }
  }

  useEffect(() => {
    const isEnable =
      firstName &&
      lastName &&
      email &&
      mobileNumber &&
      watchNationality &&
      identificationDocumentType &&
      iidentificationNumber &&
      programCode &&
      studyModeCode &&
      currency &&
      paymentMode &&
      (address ? state && countryCode && pincode : true)
        ? true
        : false
    setGenerateBtnEnable(isEnable)
  }, [
    firstName,
    lastName,
    email,
    mobileNumber,
    watchNationality,
    identificationDocumentType,
    iidentificationNumber,
    programCode,
    studyModeCode,
    currency,
    paymentMode,
    address,
    state,
    countryCode,
    pincode
  ])

  useEffect(() => {
    if (watch('identificationDocumentType') === 'PASSPORT' && !watch('passportExpiryDate')) {
      setError('passportExpiryDate', {
        type: 'custom',
        message: 'Please Select Valid Expiry Date'
      })
    } else {
      clearErrors('passportExpiryDate')
    }
  }, [watch('identificationDocumentType')])

  useEffect(() => {
    submitForm(() => handleSubmit(onSubmitGenerateQuote))
  }, [handleSubmit, submitForm])

  useEffect(() => {
    if (resetForm) reset()
    onReset(false)
  }, [resetForm, reset])

  useEffect(() => {
    if (formData) {
      setLoading(true)
      Object.keys(formData).forEach(key => {
        setValue(key, formData[key])
      })
      setLoading(false)
    }
  }, [formData, setValue])

  useEffect(() => {
    updateProgramCode()
  }, [watch('programCode')])

  useEffect(() => {
    updateStudyModeCode()
  }, [watch('studyModeCode')])

  useEffect(() => {
    updateCurrency()
  }, [watch('currency')])

  useEffect(() => {
    updatePaymentMode()
  }, [watch('paymentMode')])

  useEffect(() => {
    if (originalProgramData?.studyModes?.length === 0 && programCode) {
      setFeeError(userInformationStatus.feeConfigure)
    } else if (originalProgramData?.studyModes?.length !== 0) {
      setFeeError('')
    }
  }, [originalProgramData?.studyModes, programCode, setError, clearErrors])

  // useEffect(() => {
  //   const countryCode = watch('country')
  //   if (countryCode) {
  //     getStateListDetails(countryCode)
  //   }
  // }, [watch('country')])

  useEffect(() => {
    const mobileNumber = watch('mobileNumber')
    mobileNumber && mobileNumberCheck(mobileNumber)
  }, [watch('mobileNumber'), watch('mobileCountryCode')])

  useEffect(() => {
    initializeFormData()
  }, [])

  useEffect(() => {
    if (!countryCode) {
      setValue('state', '')
    }
  }, [countryCode])

  // Function to initialize form data
  const initializeFormData = async () => {
    await Promise.all([
      getNationalityData(),
      getProgramList(),
      getMasterData(),
      getIdentificationType(),
      getCurrencyRateList()
    ])
  }

  // Function to reset program related data
  const updateProgramCode = () => {
    const programCode = watch('programCode')
    if (programCode) {
      getProgramCodeData(programCode)
    } else {
      setOriginalProgramData(defaultValues.programData)
      setFormatedProgramData(null)
      setProgramFeeData(null)
      setValue('currency', null)
    }
    setValue('studyModeCode', null)
  }

  const updateStudyModeCode = async () => {
    const studyModeCode = watch('studyModeCode')
    if (studyModeCode) {
      await setProgramDataByStudyCodeMode(studyModeCode)
    }
    const paymentMode = watch('paymentMode')
    if (paymentMode === 'FLEXI PAY') {
      setValue('paymentMode', null)
    }
    setShowFlexiPayOptions(false)
  }

  // Function to update currency and payment mode
  const updateCurrency = async () => {
    setLoading(true)
    const currency = watch('currency')
    const studyModeCode = watch('studyModeCode')
    await getCurrencyConversionRate(currency)
    if (currency && convertedCurrency?.rate && (studyModeCode || formatedProgramData)) {
      updateAmountByConversionCurrencyRate(programFeeData)
    }
    if (paymentMode === 'FLEXI PAY' && !currency) {
      setValue('paymentMode', null)
    }
    setLoading(false)
  }

  const updatePaymentMode = () => {
    const paymentMode = watch('paymentMode')
    if (paymentMode === 'FLEXI PAY') {
      updateProgramData()
      setShowFlexiPayOptions(true)
      setIsPaymentModeEnabled(true)
    } else if (paymentMode) {
      updateProgramData()
      setShowFlexiPayOptions(false)
      setIsPaymentModeEnabled(true)
    } else {
      updateProgramData()
      setShowFlexiPayOptions(false)
    }
  }

  const updateProgramData = () => {
    const paymentMode = watch('paymentMode')
    if (paymentMode) {
      const tempProgramData = JSON.parse(JSON.stringify(formatedProgramData))
      const tempFeeObject = tempProgramData?.studyModes?.[0].fees.filter((feeData: any) => {
        return feeData.feeMode === paymentMode
      })
      delete tempProgramData.studyModes
      delete tempProgramData.flexipaycategory
      tempProgramData.feeData = tempFeeObject[0]
      setValue('programData', tempProgramData)
    }
  }

  // Function to get student fee data
  const setProgramDataByStudyCodeMode = async (studyModeCode: string) => {
    const feeDetails: any = originalProgramData?.studyModes?.filter(
      (item: IStudyMode) => item.studyModeCode === studyModeCode
    )
    if (feeDetails?.length > 0) {
      const flexiPayExists = feeDetails[0].fees.some((fee: { feeMode: string }) => fee.feeMode === 'FLEXI PAY')
      if (!flexiPayExists) {
        const tempFlexiPayData = await upsertFlexiPayData()
        if (tempFlexiPayData?.flexiPaydata?.length > 0) {
          feeDetails[0].fees.push(tempFlexiPayData)
        }
      }
      const tempData: IProgramCodeData = JSON.parse(JSON.stringify(originalProgramData))
      tempData.studyModes = feeDetails[0]
      const currency = watch('currency')
      if (currency) {
        await getCurrencyConversionRate(currency)
        await updateAmountByConversionCurrencyRate(feeDetails[0])
      } else {
        setProgramFeeData(feeDetails[0])
      }
    }
  }

  const upsertFlexiPayData = async () => {
    const programCode = watch('programCode')
    const studyModeCode = watch('studyModeCode')
    const flexiPayDataResponse: IFlexiPayData[] = await getFlexiPayData(programCode, studyModeCode)
    const flexiPayOptionsList = flexiPayDataResponse?.map(item => ({
      name: item.category,
      code: item.category
    }))
    if (flexiPayOptionsList?.length > 0) {
      setFlexiPayOptionsList(flexiPayOptionsList)
    }

    return {
      feeMode: 'FLEXI PAY',
      fee: 0,
      flexiPaydata: flexiPayDataResponse
    }
  }

  const getCurrencyConversionRate = async (currencyCode: string) => {
    const currencyRateResponse: any = currencyRateList?.find((item: any) => {
      return item.currencyCode === currencyCode
    })
    convertedCurrency = currencyRateResponse

    return
  }

  // Function to set currency for fee data
  const updateAmountByConversionCurrencyRate = async (incomingProgramFeeData: any) => {
    setLoading(true)
    const tempProgramData: IProgramCodeData = JSON.parse(JSON.stringify(originalProgramData))
    const tempData: IStudyMode = JSON.parse(JSON.stringify(incomingProgramFeeData))
    const updatedFees = tempData?.fees?.map((feeObject: IFee) => {
      if (feeObject?.feeMode === 'FLEXI PAY') {
        const transformedFlexiPayData =
          feeObject?.flexiPaydata?.map((item: IFlexiPayData, index) => {
            item.id = index
            const convertedFeeStructure: IFlexiPayFeeStructure[] = item.flexiPayStructure.map(
              (fee: { year: any; amount: any }) => {
                const formattedAmount = Number(fee?.amount)
                  .toLocaleString('en-US', {
                    style: 'currency',
                    currency: convertedCurrency?.currencyCode
                  })
                  .replace(/[^\d.-]+/g, '')
                const convertedAmount = (Number(fee.amount) * (convertedCurrency?.rate ?? 1))
                  .toLocaleString('en-US', {
                    style: 'currency',
                    currency: convertedCurrency?.currencyCode
                  })
                  .replace(/[^\d.-]+/g, '')

                return {
                  year: fee?.year,
                  amount: formattedAmount,
                  convertedAmount: convertedAmount
                }
              }
            )

            const convertedUpfront = (Number(item?.upFrontAmount) * (convertedCurrency?.rate ?? 1))
              .toLocaleString('en-US', {
                style: 'currency',
                currency: convertedCurrency?.currencyCode
              })
              .replace(/[^\d.-]+/g, '')

            const totalAmount =
              convertedFeeStructure.reduce((sum, fee) => sum + Number(fee.amount), 0) + Number(item?.upFrontAmount)
            const formattedTotalAmount = totalAmount
              .toLocaleString('en-US', {
                style: 'currency',
                currency: convertedCurrency?.currencyCode
              })
              .replace(/[^\d.-]+/g, '')

            const totalConvertedAmount =
              convertedFeeStructure.reduce((sum, fee) => sum + Number(fee?.convertedAmount), 0) +
              Number(item?.upFrontAmount)
            const formattedTotalConvertedAmount = totalConvertedAmount
              .toLocaleString('en-US', {
                style: 'currency',
                currency: convertedCurrency?.currencyCode
              })
              .replace(/[^\d.-]+/g, '')

            return {
              ...item,
              flexiPayStructure: convertedFeeStructure,
              totalAmount: formattedTotalAmount,
              convertedUpfront: convertedUpfront,
              totalConvertedAmount: formattedTotalConvertedAmount,
              currencySymbol: convertedCurrency?.currencySymbol ?? 'R'
            }
          }) || []

        feeObject.flexiPaydata = transformedFlexiPayData

        return feeObject
      } else {
        const formattedFee = Number(feeObject?.fee)
          ?.toLocaleString('en-US', {
            style: 'currency',
            currency: convertedCurrency?.currencyCode
          })
          .replace(/[^\d.-]+/g, '')
        const convertedFee = (Number(feeObject?.fee) * (convertedCurrency?.rate ?? 1))
          ?.toLocaleString('en-US', {
            style: 'currency',
            currency: convertedCurrency?.currencyCode
          })
          .replace(/[^\d.-]+/g, '')
        feeObject.fee = formattedFee
        feeObject.convertedFee = convertedFee
        feeObject.currencySymbol = convertedCurrency?.currencySymbol ?? 'R'
        feeObject.conversionRate = convertedCurrency?.rate ?? 1

        return feeObject
      }
    })
    const applicationFeeDetails = updatedFees?.find((feeData: any) => feeData.feeMode === 'APPLICATION')
    const totalFeeDetails = updatedFees?.find((feeData: any) => feeData.feeMode === 'TOTAL')

    tempProgramData.applicationConvertedFee = (Number(applicationFeeDetails?.fee) * (convertedCurrency?.rate ?? 1))
      .toLocaleString('en-US', { style: 'currency', currency: convertedCurrency?.currencyCode })
      .replace(/[^\d.-]+/g, '')
    tempProgramData.applicationFee = Number(applicationFeeDetails?.fee)
      .toLocaleString('en-US', { style: 'currency', currency: convertedCurrency?.currencyCode })
      .replace(/[^\d.-]+/g, '')
    tempProgramData.totalFee = Number(totalFeeDetails?.fee)
      .toLocaleString('en-US', { style: 'currency', currency: convertedCurrency?.currencyCode })
      .replace(/[^\d.-]+/g, '')
    tempProgramData.totalConvertedFee = (Number(totalFeeDetails?.fee) * (convertedCurrency?.rate ?? 1))
      .toLocaleString('en-US', { style: 'currency', currency: convertedCurrency?.currencyCode })
      .replace(/[^\d.-]+/g, '')
    tempProgramData.studyModes = [tempData]

    const flexiPayIndex = tempData?.fees?.findIndex((fee: any) => fee.feeMode === 'FLEXI PAY')
    setColumns(
      dynamicColumns(
        tempData?.fees?.[flexiPayIndex]?.flexiPaydata?.[0]?.flexiPayStructure?.length || 0,
        convertedCurrency?.currencySymbol
      )
    )
    setFlexiPayData({
      columns: Object.keys(tempData?.fees?.[flexiPayIndex]?.flexiPaydata?.[0] || {}),
      data: tempData?.fees?.[flexiPayIndex]?.flexiPaydata || []
    })

    await setFormatedProgramData(tempProgramData)
    setValue('programData', tempProgramData)
    setIsPaymentModeEnabled(true)
    setLoading(false)
  }

  // Function to get student program data
  const getProgramCodeData = async (programCode: string) => {
    setLoading(true)
    const data = await FinanceService?.getFeeDetails(programCode)
    if (data) {
      const programData = data.find((item: any) => item?.programCode === programCode)
      if (programData) {
        const feeModesOrder = ['MONTHLY', 'SEMESTER', 'ANNUALLY', 'APPLICATION', 'MONTHLY']
        programData.studyModes = programData.studyModes.map((obj: { fees: { feeMode: string }[] }) => ({
          ...obj,
          fees: obj.fees.sort(
            (a: { feeMode: string }, b: { feeMode: string }) =>
              feeModesOrder.indexOf(a.feeMode) - feeModesOrder.indexOf(b.feeMode)
          )
        }))
        programData.duration = await AcademicService?.getProgramDuration(programCode)
        setOriginalProgramData(programData)
        setValue('currency', null)
      } else {
        setOriginalProgramData(defaultValues.programData)
        setValue('currency', null)
      }
    }
    setLoading(false)
  }

  // Function to get program list
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && !!response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  // Function to get nationality data
  const getNationalityData = async () => {
    const response = await CommonService.getNationalityList()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setNationality(response.data.data)
    }
  }

  // Function to get identification type
  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
    }
  }

  // Function to get country list details
  const getMasterData = async () => {
    const data = await ApplyService.getMasterData()
    setMasterData(data)
  }

  // Function to get country list details
  const getCurrencyRateList = async () => {
    const pageNumber = 1
    const pageSize = 1000
    const response: any = await FinanceService.getAllCurrencyRate(pageNumber, pageSize)
    if (response?.data.statusCode == status.successCode && response?.data?.data) {
      setCurrencyRateList(response?.data?.data?.[0])
    }
  }

  const getFlexiPayData = async (programCode: string, studyModeCode: string) => {
    const response = await FinanceService.getFlexiPayData(programCode, studyModeCode)
    if (response?.data.statusCode == status.successCode && response?.data?.data?.flexiPayCategory) {
      return response?.data?.data?.flexiPayCategory
    }
  }

  // Function to handle country code for contact
  const countryCodeContact = (data: any, dialCode: string) => {
    data && setValue(`mobileCountryCode`, dialCode)
  }

  // Function to check mobile number length
  const mobileNumberCheck = (mobile: any) => {
    const countryCodeLength = watch('mobileCountryCode').length
    const mobileNumber = mobile?.toString().substring(countryCodeLength)
    if (mobileNumber?.length < 6) {
      setError('mobileNumber', { type: 'manual', message: userInformationStatus.mobileNumberMin })
    } else clearErrors('mobileNumber')
  }

  // Function to handle form submission
  const onSubmitGenerateQuote = async (data: FieldValues) => {
    setGenerateBtnEnable(false)
    reset(data, { keepValues: true })
    const params: IGenerateQuoteParams = {
      studentCode: data?.studentCode,
      firstName: data?.firstName,
      middleName: data?.middleName,
      lastName: data?.lastName,
      email: data?.email,
      mobileCountryCode: data?.mobileCountryCode,
      mobileNumber: data?.mobileNumber.slice(data?.mobileCountryCode?.length, data?.mobileNumber?.length),
      address1: data?.address1,
      country: data?.country,
      state: data?.state,
      city: data?.city,
      pincode: data?.pincode,
      programCode: data?.program,
      studyModeCode: data?.studyModeCode,
      currency: data?.currency,
      paymentMode: data?.paymentMode,
      nationality: data?.nationality,
      identificationDocumentType: data?.identificationDocumentType,
      identificationNumber: data?.identificationNumber,
      programData: data?.programData,
      flexiPayOption: data?.flexiPayOption,
      passportExpiryDate: data?.passportExpiryDate
    }
    await generateQuote(params)
    reset(defaultValues)
    setGenerateBtnEnable(true)
  }

  const downloadTranscripts = async (fileData: any, fileName: string) => {
    const url = URL.createObjectURL(fileData)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }

  const handleSuccess = (msg: string) => {
    successToast(msg)
  }

  const checkDuplicateEmail = async (email: string) => {
    const result = await DashboardService.reggieCheckDuplicateEmail(email)

    if (result?.data?.existingRecord) {
      setError('email', {
        type: 'manual',
        message: 'Provided email address already exists'
      })

      return false
    } else {
      clearErrors('email')

      return true
    }
  }

  const checkDuplicateMobile = async (mobileNumber: string, mobileCountryCode: string) => {
    const result = await DashboardService.reggieCheckDuplicateMobile(mobileNumber, mobileCountryCode)

    if (result?.data?.existingRecord) {
      setError('mobileNumber', {
        type: 'manual',
        message: 'Provided mobile number already exists'
      })

      return false
    } else {
      clearErrors('mobileNumber')

      return true
    }
  }

  // Function to generate quote
  const generateQuote = async (data: IGenerateQuoteParams) => {
    const result = await DashboardService.generateQuote(data)

    const resHeaders = result?.headers?.['content-type']
    let fileName: any = 'generated-quote.pdf' // Default filename
    if (resHeaders && resHeaders?.includes('filename=')) {
      const match = resHeaders?.match(/filename="(.+?)"/)
      if (match?.length > 1) {
        fileName = match?.[1]
      }
    }

    const successMessage = `${data.firstName} ${data.lastName}'s ${data.programData.programCode}-${data.studyModeCode}-${data.paymentMode} ${messages.quoteGenerated}`
    handleSuccess(successMessage)
    if (result?.status === status.successCode && result?.data?.isQuoteGenerating) {
      setTimeout(async () => {
        const lastGeneratedQuoteDetails = await CommonService.getActivityTimelineData(
          {
            actionBy: result?.data?.studentCode,
            action: 'Quote generated'
          },
          1
        )
        const auditLogObject: any = structureQuoteHistory(lastGeneratedQuoteDetails?.data)
        handleOnDownloadClick(
          auditLogObject?.[0]?.fileName,
          auditLogObject?.[0]?.studentCode,
          auditLogObject?.[0]?.actionName
        )
      }, 90000) // 1 minute delay
    } else if (result?.status === status.successCode) {
      downloadTranscripts(result?.data, fileName)
    } else {
      errorToast(messages.error)
    }
  }

  const handleOnDownloadClick = async (fileName: string, studentCode: string, name: string) => {
    const downloadedTranscript = await CommonService.getFileUrl(fileName, studentCode)
    if (downloadedTranscript?.status == status.successCode) {
      downloadFile(downloadedTranscript?.data?.data, fileName)
      successToast(`${formData.firstName} ${formData.lastName}'s ${name} quote downloaded sucessfully`)
    } else {
      errorToast(messages.error)
    }
  }

  const structureQuoteHistory = (quoteHistory: any) => {
    return quoteHistory.map((item: any) => {
      item.actionDetails = JSON.parse(item?.actionDetails)

      return {
        invoiceCode: item?.applicationCode,
        date: new Date(item?.createdAt).toLocaleDateString(),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        actionBy: `${item?.actionDetails?.educationalConsultant}`,
        actionName: `${item?.actionDetails?.programCode}-${item?.actionDetails?.studyModeCode}-${item?.actionDetails?.paymentMode}`,
        studentCode: `${item?.actionDetails?.studentCode}`,
        fileName: `${item?.actionDetails?.fileName}`
      }
    })
  }

  const dynamicColumns = (feeStructureLength: number, currencySymbol: string) => {
    const yearNames = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']
    const staticColumns = [
      {
        flex: 0.15,
        maxWidth: 100,
        headerName: 'S.no.',
        field: 'id',
        renderCell: (params: any) => params.api.getRowIndex(params.row.id) + 1
      },
      {
        flex: 0.2,
        minWidth: 250,
        field: 'categoryCode',
        headerName: 'Category Code',
        renderCell: ({ row }: any) => (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {row.category}
          </Typography>
        )
      },
      {
        flex: 0.2,
        minWidth: 150,
        field: 'upfront',
        headerName: 'Min. Upfront Amount',
        renderCell: ({ row }: any) => (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {`${currencySymbol}`}
            {row.convertedUpfront}
          </Typography>
        )
      }
    ]

    const dynamicCols = []
    for (let i = 0; i < feeStructureLength; i++) {
      dynamicCols.push({
        flex: 0.2,
        minWidth: 110,
        field: `year${i + 1}`,
        headerName: `Year ${yearNames[i]}`,
        renderCell: ({ row }: any) => (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {`${currencySymbol}`}
            {row.flexiPayStructure[i]?.convertedAmount || ''}
          </Typography>
        )
      })
    }

    const totalAmountColumn = {
      flex: 0.2,
      minWidth: 180,
      field: 'totalAmount',
      headerName: 'Estimated Total',
      renderCell: ({ row }: any) => (
        <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
          {`${currencySymbol}`}
          {row.totalConvertedAmount || ''}
        </Typography>
      )
    }

    return [...staticColumns, ...dynamicCols, totalAmountColumn]
  }

  return (
    <form onSubmit={handleSubmit(onSubmitGenerateQuote)}>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <FallbackSpinner />
      </Backdrop>
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container sx={{ display: 'flex' }} spacing={2}>
          <Grid item>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/student-details.svg`}
              alt=''
            />
          </Grid>
          <Grid item>
            <h3 className='mt-0 d-flex'>STUDENT DETAILS</h3>
          </Grid>
        </Grid>

        <Grid container rowSpacing={4} spacing={7} sx={{ padding: '20px' }}>
          <Grid item sm={4} xs={12}>
            <Controller
              name='studentCode'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  sx={{ mr: 2, fontSize: '10px' }}
                  {...field}
                  fullWidth
                  disabled={true}
                  label='Reggie Number'
                  placeholder='REG1100012'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='firstName'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='First Name'
                  placeholder='Jordan'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='middleName'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Middle Name (Optional)'
                  placeholder='William'
                  onChange={event => field.onChange(!!event.target.value ? event.target.value : null)}
                  onBlur={event => field.onChange(!!event.target.value ? event.target.value : null)}
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='lastName'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Last Name'
                  placeholder='Stevenson'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Email'
                  placeholder='johnDoe@email.com'
                  error={!!errors.email}
                  onChange={e => {
                    const trimmedValue = e.target.value.trim()
                    setValue('email', trimmedValue)
                    clearErrors('email')
                  }}
                  helperText={errors.email && (errors.email?.message as string | undefined)}
                  onBlur={async e => {
                    const trimmedValue = e.target.value.trim()
                    const studentCode = watch('studentCode')
                    if (trimmedValue) {
                      if (!studentCode) {
                        const isDuplicate = await checkDuplicateEmail(trimmedValue)
                        const isValid: boolean = isValidEmail(trimmedValue)
                        if (!isValid) {
                          setError('email', {
                            type: 'manual',
                            message: userInformationStatus.EmailInvalid
                          })
                        }
                        if (!isDuplicate) {
                          setValue('email', trimmedValue)
                        }
                      } else {
                        setValue('email', trimmedValue)
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='mobileNumber'
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    '& .country-list': { top: '-40px' },
                    '& .form-control:focus': {
                      borderColor: theme => theme.palette.primary.main,
                      boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}`
                    },
                    '& input.form-control': { color: theme => `rgb(${theme.palette.customColors.main})` }
                  }}
                >
                  <PhoneInput
                    {...field}
                    countryCodeEditable={true}
                    placeholder='Enter Contact Number'
                    specialLabel='Contact Number'
                    value={watch('mobileNumber') || '+27'}
                    {...register('mobileNumber')}
                    onChange={(data, countryData: { dialCode: string }) => {
                      countryCodeContact(data, countryData?.dialCode)
                      data && setValue('mobileNumber', data)
                      clearErrors('mobileNumber')
                    }}
                    onBlur={e => {
                      const mobileNumber = e.target.value.replaceAll(' ', '').replace('+', '').replace('-', '')
                      const mobileCheck = mobileNumber.slice(watch('mobileCountryCode')?.length)
                      if (mobileCheck.length >= 6) {
                        const studentCode = watch('studentCode')
                        if (!studentCode) {
                          checkDuplicateMobile(mobileCheck, watch('mobileCountryCode'))
                        }
                      }
                    }}
                    inputStyle={{
                      borderRadius: '4px',
                      background: 'none',
                      width: '100%'
                    }}
                  />
                  <FormHelperText error>
                    {errors.mobileNumber && (errors.mobileNumber?.message as string | undefined)}
                  </FormHelperText>
                  <input
                    type='hidden'
                    {...register('mobileCountryCode')}
                    value={field.value || ''}
                    onChange={() => setValue('mobileCountryCode', field?.value)}
                  />
                </Box>
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <ControlledAutocomplete
              control={control}
              name='nationality'
              options={nationality}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Nationality'
                  helperText={errors?.nationality?.message as string | undefined}
                  error={Boolean(errors?.nationality?.message)}
                />
              )}
              disabled={watch('nationalityStatus') === 'SA'}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <FormControl fullWidth>
              <ControlledAutocomplete
                name='identificationDocumentType'
                control={control}
                options={identificationType}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Identification Document Type'
                    error={!!errors?.identificationDocumentType}
                    helperText={errors?.identificationDocumentType?.message as string | undefined}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='identificationNumber'
              control={control}
              rules={{
                required: 'Identification number is required',

                maxLength: {
                  value: 13,
                  message: 'Maximum 13 characters allowed.'
                },
                minLength: {
                  value: 8,
                  message: 'Minimum length should be 8.'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...register('identificationNumber')}
                  {...field}
                  fullWidth
                  label='Identification Number'
                  error={!!errors.identificationNumber}
                  onChange={e => {
                    setValue('identificationNumber', e.target.value)
                  }}
                  helperText={
                    errors.identificationNumber && (errors.identificationNumber?.message as string | undefined)
                  }
                />
              )}
            />
          </Grid>
          {watch('identificationDocumentType') === 'PASSPORT' && (
            <Grid item sm={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Passport Expiry Date'
                  inputFormat='dd/MM/yyyy'
                  disablePast={tomorrow === new Date()}
                  minDate={tomorrow}
                  value={watch('passportExpiryDate') !== undefined ? watch('passportExpiryDate') : null}
                  onChange={value => {
                    !!value && setValue('passportExpiryDate', value)
                    !!value && handleOnBlur(value)
                  }}
                  renderInput={params => (
                    <TextField {...params} name='passportExpiryDate' error={!!errors.passportExpiryDate} fullWidth />
                  )}
                />
                {errors.passportExpiryDate ? (
                  <FormHelperText sx={{ color: 'red' }}>
                    {errors.passportExpiryDate?.message as string | undefined}
                  </FormHelperText>
                ) : null}
              </LocalizationProvider>
            </Grid>
          )}
        </Grid>
      </Card>

      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container sx={{ display: 'flex' }} spacing={2}>
          <Grid item>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/address-section.svg`}
              alt=''
            />
          </Grid>
          <Grid item>
            <h3 className='mt-0 d-flex'> ADDRESS </h3>
          </Grid>
        </Grid>

        <Grid container rowSpacing={4} spacing={7} sx={{ padding: '20px' }}>
          <Grid item sm={4} xs={12}>
            <Controller
              name='address1'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Address Line'
                  placeholder='Address'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <ControlledAutocomplete
              {...register('country')}
              defaultValue={watch('country')}
              name='country'
              control={control}
              options={masterData?.countryData}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label='Country'
                  error={!!errors?.country}
                  helperText={errors?.country?.message as string | undefined}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            {statesList?.length && formData ? (
              <ControlledAutocomplete
                {...register('state')}
                defaultValue={
                  statesList.find(state => state?.code === formData?.state)
                    ? statesList.find(state => state?.code === formData?.state)
                    : ('' as any)
                }
                name='state'
                control={control}
                options={statesList || []}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    label='State'
                    error={!!errors?.state}
                    helperText={errors?.state?.message as string | undefined}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingState ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            ) : null}
            {!formData ? (
              <ControlledAutocomplete
                {...register('state')}
                name='state'
                control={control}
                options={statesList || []}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    label='State'
                    error={!!errors?.state}
                    helperText={errors?.state?.message as string | undefined}
                  />
                )}
              />
            ) : null}
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='city'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='City'
                  placeholder='Jordan'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <Controller
              name='pincode'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Zip/Postal Code'
                  placeholder='Pincode'
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container sx={{ display: 'flex' }} spacing={2}>
          <Grid item>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/qualification-details.svg`}
              alt=''
            />
          </Grid>
          <Grid item>
            <h3 className='mt-0 d-flex'> QUALIFICATION DETAILS </h3>
          </Grid>
        </Grid>

        <Grid container rowSpacing={4} spacing={7} sx={{ padding: '20px' }}>
          <Grid item xs={6}>
            <ControlledAutocomplete
              name='programCode'
              control={control}
              options={programList}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label='Qualification'
                  error={!!errors?.programCode || feeError !== ''}
                  helperText={errors?.programCode?.message as string | undefined}
                />
              )}
            />

            {originalProgramData?.duration !== 0 && (
              <Grid item sm={6} sx={{ marginLeft: '10px', padding: '2px' }}>
                <Typography variant='caption' sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                  {`${originalProgramData.duration} Months Program`}
                </Typography>
              </Grid>
            )}
            {originalProgramData?.studyModes?.length === 0 && programCode && (
              <Typography variant='caption' color='red'>
                {feeError && feeError}
              </Typography>
            )}
          </Grid>
          <Grid item sm={6} xs={12}>
            {originalProgramData?.studyModes?.length > 0 && (
              <>
                <Grid container>
                  <Controller
                    {...register('studyModeCode', {
                      required: 'Study Mode & Fee Plan is Required'
                    })}
                    name='studyModeCode'
                    control={control}
                    rules={{
                      required: 'Study Mode is required'
                    }}
                    render={({ field }) => (
                      <FormControl sx={{ marginLeft: '10px' }} error={!!errors?.studyModeCode}>
                        <FormLabel sx={{ fontSize: '12px' }}>Study Mode</FormLabel>
                        <RadioGroup {...field} row defaultValue={field.value}>
                          {originalProgramData?.studyModes.map((item: any, index: number) => (
                            <FormControlLabel
                              key={index}
                              value={item?.studyModeCode}
                              control={<Radio />}
                              label={<Typography variant='caption'>{item.studyModeCode}</Typography>}
                            />
                          ))}
                        </RadioGroup>
                        {programCode && !studyModeCode && (
                          <FormHelperText sx={{ color: 'red' }}>Please select study mode</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container sx={{ display: 'flex' }} spacing={2}>
          <Grid item>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/payment-currency.svg`}
              alt=''
            />
          </Grid>
          <Grid item>
            <h3 className='mt-0 d-flex'> PAYMENT & CURRENCY OPTIONS </h3>
          </Grid>
        </Grid>

        <Grid container rowSpacing={4} spacing={7} sx={{ padding: '20px' }}>
          <Grid item xs={4}>
            <ControlledAutocomplete
              name='currency'
              control={control}
              options={masterData?.currencyData}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label='Currency'
                  error={!!errors?.currency}
                  helperText={errors?.currency?.message as string | undefined}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={7} rowSpacing={10} sx={{ marginBottom: '8px', marginLeft: '0px' }}>
          <Grid item xs={12}>
            {currency && formatedProgramData && isPaymentModeEnabled && (
              <>
                <Grid container spacing={10} sx={{ marginBottom: '10px' }}>
                  <Grid item xs={12}>
                    <label>Select Payment Mode: </label>
                  </Grid>
                </Grid>
                <Grid container spacing={5} rowSpacing={5} xs={12} md={12}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Controller
                      name='paymentMode'
                      control={control}
                      defaultValue=''
                      rules={{ required: 'Please select a payment mode' }}
                      render={({ field }) => (
                        <FormControl error={!!errors?.paymentMode}>
                          <RadioGroup {...field}>
                            <Stack direction='row' spacing={2}>
                              {formatedProgramData.studyModes[0]?.fees
                                ?.filter(
                                  item => item?.feeMode !== feeMode?.TOTAL && item?.feeMode !== feeMode?.APPLICATION
                                )
                                .sort((a, b) => {
                                  const feeModeOrder: any = {
                                    MONTHLY: 1,
                                    SEMESTER: 2,
                                    ANNUALLY: 3
                                  }

                                  return feeModeOrder[a?.feeMode] - feeModeOrder[b?.feeMode]
                                })
                                .map((item, key) => {
                                  return (
                                    <Button
                                      key={key}
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: '150px',
                                        maxHeight: '80px',
                                        alignItems: 'flex-start',
                                        padding: 2,
                                        paddingRight: 3
                                      }}
                                      variant='outlined'
                                      onClick={() => field.onChange(item.feeMode)}
                                    >
                                      <Grid container spacing={1} alignItems='center'>
                                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                          <FormControlLabel label='' value={item.feeMode} control={<Radio />} />
                                        </Grid>
                                        <Grid item xs={10}>
                                          <Typography
                                            variant='body2'
                                            sx={{
                                              fontWeight: 'bold',
                                              fontSize: 11,
                                              color: field.value === item.feeMode ? 'green' : 'black',
                                              textAlign: 'left' // Align text to the left
                                            }}
                                          >
                                            {item?.feeMode?.charAt(0)?.toUpperCase() +
                                              item?.feeMode?.slice(1)?.toLowerCase()}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid
                                        container
                                        spacing={1}
                                        sx={{
                                          marginTop: '0px',
                                          marginLeft: '22px',
                                          position: 'relative',
                                          top: '-15px'
                                        }}
                                      >
                                        <Grid item xs={12}>
                                          <Typography
                                            sx={{
                                              fontWeight: 800,
                                              fontSize: 9,
                                              textAlign: 'left', // Align text to the left
                                              marginTop: '4px' // Adjust the margin if needed
                                            }}
                                          >
                                            {item.feeMode !== 'FLEXI PAY'
                                              ? item.currencySymbol + ' ' + item.convertedFee
                                              : item.flexiPaydata?.length + ' Options Available'}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Typography
                                            variant='body2'
                                            sx={{
                                              fontSize: 10,
                                              color: 'grey',
                                              textAlign: 'left', // Align text to the left
                                              marginTop: '2px' // Adjust the margin if needed
                                            }}
                                          >
                                            {item.feeMode !== 'FLEXI PAY'
                                              ? `${
                                                  item.feeMode === 'ANNUALLY'
                                                    ? originalProgramData.duration / 12
                                                    : item.feeMode === 'SEMESTER'
                                                      ? originalProgramData.duration / 6
                                                      : originalProgramData.duration
                                                } Payment(s)`
                                              : ' . '}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Button>
                                  )
                                })}
                            </Stack>
                          </RadioGroup>
                          {errors?.paymentMode && (
                            <FormHelperText>{errors?.paymentMode?.message as string | undefined}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {showFlexiPayOptions && (
                      <ControlledAutocomplete
                        name='flexiPayOption'
                        control={control}
                        options={flexiPayOptionsList}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            label='Select Flexi Pay'
                            error={!!errors?.flexiPayOption}
                            helperText={errors?.flexiPayOption?.message as string | undefined}
                          />
                        )}
                      />
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        {showFlexiPayOptions && (
          <>
            <Grid container spacing={4} rowSpacing={4} sx={{ marginTop: '1px' }}>
              <Grid item xs={12}>
                <Typography
                  variant='h6'
                  className='mt-0 d-flex'
                  sx={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}
                >
                  <Grid item>
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/flexipay-section.svg`}
                      alt=''
                    />
                  </Grid>
                  Flexi-Pay Options Details
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={4} rowSpacing={4} sx={{ marginTop: '1px' }}>
              <Grid item xs={12}>
                <DataGrid
                  autoHeight
                  rows={flexiPayData.data}
                  columns={columns}
                  rowsPerPageOptions={[]}
                  sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Card>
    </form>
  )
}

export default GenerateQuotesForm
