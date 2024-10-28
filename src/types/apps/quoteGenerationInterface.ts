export interface IFlexiPayFeeStructure {
  year: number
  amount: string
  convertedAmount?: string
}
export interface IFlexiPayData {
  id: number
  category: string
  upFrontAmount: string
  convertedUpfront?: string
  totalAmount?: string
  totalConvertedAmount?: string
  currencySymbol?: string
  flexiPayStructure: IFlexiPayFeeStructure[]
}

export interface IFee {
  fee: string
  feeMode: string
  currencySymbol?: any
  convertedFee?: string
  conversionRate?: any
  flexiPaydata?: IFlexiPayData[]
}
export interface IStudyMode {
  studyModeCode: string
  fees: IFee[]
  applicationFee?: string
  totalFee?: string
}

export interface IProgramCodeData {
  applicationConvertedFee?: string
  applicationFee?: string
  totalConvertedFee?: string
  totalFee?: string
  programCode: string
  programName: string
  studyModes: IStudyMode[]
  rmatFee: number
  rplFee: number
  otherFee: number
  duration: number
}
export interface IGenerateQuoteParams {
  studentCode: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  mobileNumber: string
  address1: string
  country: string
  state: string
  city: string
  pincode: string
  programCode: string
  studyModeCode: string
  currency: string
  paymentMode: string
  identificationNumber: string
  mobileCountryCode: string
  nationality: string
  flexiPayOption: string
  programData: IProgramCodeData
  identificationDocumentType: string
  passportExpiryDate: any
}
