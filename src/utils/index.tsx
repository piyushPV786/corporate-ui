import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material'
import axios from 'axios'
import { format } from 'date-fns'
import nProgress from 'nprogress'
import { Dispatch, SetStateAction } from 'react'
import { errorToast } from 'src/components/Toast'
import { GoogleAnalyticsScript, allRoles, documentTypeCode, messages, status, studentUrls } from 'src/context/common'
import { IAcademicApi } from 'src/context/types'
import { CommonService } from 'src/service'
import { IAddressStateTypes, IAddressTypes } from 'src/types/apps/admittedStudent'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { IIntakeCommonLists, IdocumentDataType } from 'src/types/apps/invoiceTypes'

export const getName = (list: Array<commonListTypes | any> = [], code: string) => {
  if (list?.length > 0) {
    return list.find(item => item.code === code)?.name
  }

  return code
}
export const getFullName = (list: Array<commonListTypes | any> = [], code: string) => {
  if (list?.length > 0) {
    const data = list?.find(item => item.code === code)

    return data && `${data?.firstName} ${data?.lastName}`
  }

  return code
}
export const getCheckName = (list: Array<commonListTypes | any> = [], code: string) => {
  if (list?.length > 0) {
    return list.find(item => item.code === code)?.name ?? code
  }

  return code
}

export const getStatus = (list: Array<commonListTypes | any> = [], status: string) => {
  if (list?.length > 0) {
    return list?.find(item => item.code === status)?.name ?? '-'
  }

  return status
}

export const getExemptCourseName = (list: Array<IAcademicApi> = [], code: string) => {
  if (list?.length > 0) {
    return list?.find(item => item.course?.code === code)?.course?.name ?? code
  }

  return code
}

export const getStateName = (list: Array<IAddressStateTypes> = [], code: string) =>
  list?.length > 0 ? (list?.find(state => state.isoCode === code)?.name ?? code) : code

export const getSymbol = (list: Array<commonListTypes>, code: string) => {
  if (list?.length > 0) {
    return list?.find(item => item.code === code)?.symbol ?? code
  }

  return code
}

export const getSelectedDocument = (
  selectedDocument: Array<string | number>,
  documentList: Array<IdocumentDataType>
) => {
  const result: Array<IdocumentDataType> = []
  selectedDocument?.forEach((documentId: string | number) => {
    documentList?.find(item => {
      if (item?.id === documentId) {
        result.push(item)
      }
    })
  })

  return result
}

export const downloadFile = (url: any, fileName: string) => {
  const fileUrl = url?.split('?')
  const data = fileUrl[0]
  const ext = data.split('.').pop()

  axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const file = new Blob([response.data], {
        type:
          ext === 'pdf'
            ? 'application/pdf'
            : ext === 'xls'
              ? 'application/xls'
              : ext === 'xlsx'
                ? 'application/xlsx'
                : 'image/jpeg'
      })
      const fileURL = URL.createObjectURL(file)
      const aElement = document.createElement('a')
      aElement.setAttribute('download', fileName)
      const href = fileURL
      aElement.href = href
      aElement.setAttribute('target', '_blank')
      aElement.click()
      URL.revokeObjectURL(href)
    })
    .catch(error => {
      console.log('Error viewing file', error.message)
    })
}

export const calculateFileSize = (size: number) => {
  return size / 1024 > 1024 ? `${(size / 1024 / 1024).toFixed(2)} MB` : `${Math.round(size / 1024)} KB`
}

export const viewProofDetails = (
  url: string,
  setViewFileLoader?: Dispatch<SetStateAction<{ [key: string]: boolean } | undefined>>,
  fileCode?: string
) => {
  const fileUrl = url?.split('?')
  const data = fileUrl[0]
  const ext = data?.split('.')?.pop()
  nProgress.start()
  axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const file = new Blob([response.data], {
        type: ext === 'pdf' ? 'application/pdf' : 'image/jpeg'
      })
      !!setViewFileLoader && !!fileCode && setViewFileLoader(prev => ({ ...prev, [fileCode]: false }))
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL)
    })
    .catch(error => {
      errorToast(`Error viewing file ${error.message}`)
    })
    .finally(() => {
      nProgress.done()
      !!setViewFileLoader && !!fileCode && setViewFileLoader(prev => ({ ...prev, [fileCode]: false }))
    })
}
export const getFileUrl = async (
  fileName: string,
  studentCode: string,
  setViewFileLoader?: Dispatch<SetStateAction<{ [key: string]: boolean } | undefined>>,
  fileCode?: string
) => {
  const response = await CommonService.getFileUrl(fileName, studentCode)
  if (response?.data?.statusCode === status?.successCode) {
    viewProofDetails(response?.data?.data, setViewFileLoader, fileCode)
  } else {
    !!setViewFileLoader && !!fileCode && setViewFileLoader(prev => ({ ...prev, [fileCode]: false }))
    errorToast('Error viewing file')
  }
}

export const checkResponseIfSuccess = (response: any) => {
  let result = null
  if (response?.data?.statusCode === status?.successCode && response?.data?.data) {
    result = response?.data?.data
  }

  return result
}

export const removeDuplicates = (list: Array<string | number>) => {
  return !!list ? (list?.length > 1 ? [...new Set(list)].filter(Boolean) : list) : []
}

export const getSelectedEnrollStudent = (
  selectedEnrollStudent: Array<string | number>,
  studentList: Array<IDynamicObject>
) => {
  const result: Array<IDynamicObject> = []
  selectedEnrollStudent?.forEach((studentId: string | number) => {
    studentList.find(item => {
      if (item?.id === studentId) {
        result.push(item)
      }
    })
  })

  return result
}
export const isValidDate = (value: any) => {
  const currentYear = new Date().getFullYear()
  const year = new Date(value).getFullYear()
  const age = currentYear - +year
  if (age < 16) return false
  if (age > 100) return false
  if (age > currentYear) return false
  else return true
}
export const DateFormat = (date: Date) => {
  const newDate = new Date(date)

  return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
}

export const DDMMYYYDateFormat = (date: Date) => {
  const newDate = new Date(date)

  return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
}

export const formatDate = (date: Date | string, dateFormat = 'dd-MM-yyyy'): string => {
  if (!date) {
    return 'Invalid Date'
  }

  const parsedDate = new Date(date)

  // Check if the parsed date is invalid
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date'
  }

  return format(parsedDate, dateFormat)
}

export const formatDateYMD = (date: Date | string, dateFormat = 'yyyy-MM-dd'): string => {
  const parsedDate = new Date(date)

  return format(parsedDate, dateFormat)
}

export const filterNameByCode = (data: any, code: string) => {
  let name = code
  if (data?.length && code) {
    const filterObj = data?.find((item: IIntakeCommonLists) => item?.code === code)
    name = filterObj?.name ? filterObj?.name : code
  }

  return name
}

export const addressDetails = (data: any, key: string) => {
  let result = '-'

  if (data?.length > 0) {
    const residentialAddress = data.find((address: any) => address.addressType === 'RESIDENTIAL')
    if (residentialAddress) {
      result = residentialAddress[key]
    } else {
      const address = data[0]
      result = address[key]
    }
  }

  return result
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export const serialNumber = (params: number, pageNumber: number, pageSize: number) => {
  return pageNumber === 1 ? params + 1 : (pageNumber - 1) * pageSize + (params + 1)
}

export const minTwoDigits = (n: number) => {
  return (n < 10 ? '0' : '') + n
}

export const generateStudentCode = (element: any, category: any) => {
  let code = ''
  let url = ''

  if (category === allRoles?.enrolment) {
    code = element?.applicationCode
    url = `${studentUrls?.enrolment}${element?.applicationCode}`
  } else if (category === allRoles?.application) {
    code = element?.applicationCode
    url = `${studentUrls?.application}${element?.applicationCode}`
  } else if (category === allRoles?.admission) {
    code = element?.applicationCode
    url = `${studentUrls?.admission}${element?.applicationCode}`
  } else if (category === allRoles?.assignIntake) {
    code = element?.applicationCode
    url = `${studentUrls?.admission}${element?.applicationCode}`
  } else if (category === allRoles?.admittedStudent) {
    code = element?.applicationCode
    url = `${studentUrls?.admission}${element?.applicationCode}`
  } else if (category === allRoles?.studentRecord) {
    code = element?.applicationCode
    url = `${studentUrls?.admission}${element?.applicationCode}`
  } else {
    code = element?.applicationCode
    url = ``
  }

  return { code, url }
}
export const getStateList = async (countryCode: string): Promise<Array<IAddressStateTypes>> => {
  const response = await CommonService.getStatesByCountry(countryCode)
  if (status.successCodeArr.includes(response?.statusCode) && !!response?.data) {
    return response?.data
  } else {
    return []
  }
}

export const fetchStateList = async (addresses: IAddressTypes[]) => {
  const addressPromise = addresses?.map(async address => {
    const stateName = getStateName(await getStateList(address.country), address.state)

    return { ...address, stateName }
  })

  try {
    const addressData = await Promise.all(addressPromise)
    addressData?.sort((firstElement, secondElement) =>
      firstElement?.addressType?.localeCompare(secondElement?.addressType)
    )

    return addressData
  } catch (error) {
    console.error(messages.error, error)
  }
}

export const checkDocumentType = (row: string) => {
  if (
    row === documentTypeCode.acceptacnce ||
    row === documentTypeCode.welcome ||
    row === documentTypeCode.confirmation ||
    row === documentTypeCode.quote ||
    row === documentTypeCode.declaration ||
    row === documentTypeCode.PaymentProof ||
    row === documentTypeCode.TermsAndConditions ||
    row === documentTypeCode.Study_Flexi_Agreement ||
    row === documentTypeCode.Study_Flexi_Calculation
  )
    return true

  return false
}

export const dateFormat = (currentDateTime: any) => {
  const formattedDate = currentDateTime?.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
  const newFormattedDate = formattedDate.replace(',', '')
  const [month, day, year] = newFormattedDate.split(' ')
  const formatMonthFormate = `${day} ${month} ${year}`

  return `${formatMonthFormate}`
}

export const formateDateToMonthYear = (date: Date) => {
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date)

  return formattedDate
}
export const toPascalCase = (inputString: string) => {
  return inputString?.charAt(0)?.toUpperCase() + inputString?.slice(1)?.toLowerCase()
}

export const checkProd = () => {
  if (process.env.NEXT_PUBLIC_USER_REDIRECT_URL === GoogleAnalyticsScript.prodURL) return true
  else return false
}

export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} color='primary' />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.primary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

export const compareDates = (date1: Date, date2: Date): number => {
  // Convert both dates to milliseconds since epoch
  const time1 = date1.getTime()
  const time2 = date2.getTime()

  // Compare the milliseconds
  if (time1 < time2) {
    return -1
  } else if (time1 > time2) {
    return 1
  } else {
    return 0
  }
}

export function IsJsonString(str: any) {
  try {
    const json = JSON.parse(str)

    return typeof json === 'object'
  } catch (e) {
    return false
  }
}

export function isValidEmail(email: string) {
  if (email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  } else {
    return true
  }
}
export function roundToTwoDecimalPlaces(value: number) {
  return parseFloat(Number(value)?.toFixed())
}

export const trimTotal = (num: number) => {
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const formattedNumber = formatter.format(num)

  return formattedNumber
}
