import { AxiosInstance } from 'axios'
import nProgress from 'nprogress'
import { apiEndPoints, baseApiURL } from '../config'
import { LeadOrSponsorType } from 'src/context/types'

interface IgenerateInvoice {
  invoiceData: [
    {
      feeModeCode: string
      applicationCode: string
      document: string
      totalPaidAmount: string
      isRmat: boolean
    }
  ]
}

export default class Finance {
  apiServer: AxiosInstance
  baseUrl = `${baseApiURL}/finance/`
  constructor(apiServer: AxiosInstance) {
    this.apiServer = apiServer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getBursaryList() {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.bursaryList}`

    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      nProgress.done()
      console.log('Error fetching bursary list ========>', err?.message)
    }
    nProgress.done()
  }

  async getCurrencyRate(countryCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.feeConversionRate}/${countryCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async getAllCurrencyRate(pageNumber: number, pageSize: number) {
    const endUrlName = `${this.baseUrl + apiEndPoints.feeConversionRate}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }

  async getFeeDetails(programCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.feeDetails}/${programCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : undefined
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }
  async getDiscountDetail(discountCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.discount}/${discountCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : undefined
    } catch (err: any) {
      console.log('Error fetching student list ========>', err?.message)
    }
  }
  async getDueAmountDetail(studentCode: string) {
    const endUrlName = `${this.baseUrl + apiEndPoints.newStudent}/${studentCode}`
    try {
      const response = await this.apiServer.get(endUrlName)

      return response?.data?.data ? response?.data?.data : undefined
    } catch (err: any) {
      console.log('Error fetching due amount ========>', err?.message)
    }
  }
  async sendDuePaymentMail(param: any) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.duePaymentMail}`

    try {
      const response = await this.apiServer.post(endUrlName, param)

      return response.data
    } catch (err: any) {
      console.log('Error sending due payment mail ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }

  async createCreditReport(
    id: any,
    updateCreditPayload: { createCreditVettingFor: [LeadOrSponsorType] | [LeadOrSponsorType, LeadOrSponsorType] } = {
      createCreditVettingFor: ['lead']
    }
  ) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.updateCredit}/${id}/new`
    try {
      const response = await this.apiServer.post(endUrlName, updateCreditPayload)

      return response.data
    } catch (err: any) {
      console.log('Error updating credit report ========>', err?.message)
    } finally {
      nProgress.done()
    }
  }
  async generateInvoice(param: IgenerateInvoice) {
    nProgress.start()
    const endUrlName = `${this.baseUrl + apiEndPoints.generateInvoice}`
    const payload = { invoiceData: param }

    try {
      const response = await this.apiServer.post(endUrlName, payload)

      return response.data
    } catch (err: any) {
      console.log('Error sending due payment mail ========>', err?.message)
    }
  }

  async getFinedtechdetails(param: any) {
    nProgress.start()
    const url = `${this.baseUrl + apiEndPoints.finedtechdetails}/${param}`

    try {
      const response = await this.apiServer.get(url)

      return response.data.data
    } catch (err: any) {
      console.log('Error fetching finedtech details ========>', err?.message)
    }
  }

  async getFlexiPayData(programCode: string, studyModeCode: string) {
    nProgress.start()
    let endUrlName = `${this.baseUrl + apiEndPoints.flexiPayData}?includeIsActive=true`
    endUrlName = endUrlName.replace(':programCode', programCode).replace(':studyModeCode', studyModeCode)
    try {
      const response = await this.apiServer.get(endUrlName)
      nProgress.done()

      return response
    } catch (err: any) {
      console.log('Error fetching flexi pay details ========>', err?.message)
      nProgress.done()
    }
    nProgress.done()
  }

  async getCouponDiscountDetails(discountCode: any) {
    const url = `${this.baseUrl}discount/${discountCode}`

    try {
      const response = await this.apiServer.get(url)
      const result = response?.data?.data ? response?.data?.data : {}

      return result
    } catch (e) {
      throw e
    }
  }
}
