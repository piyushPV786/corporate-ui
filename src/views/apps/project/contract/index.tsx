// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid } from '@mui/x-data-grid'

import CostContractDetail from 'src/views/pages/dialog/CostContract'
import VenueLogisticsDetail from 'src/views/pages/dialog/VenueLogistics'
import InstallmentDetail from 'src/views/pages/dialog/InstallmentDetails'
import { successToast } from '../../../../components/Toast'
import { messages } from '../../../../context/common'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import {
  IAddVenueTypes,
  IPayloadTypes,
  InvoiceAddInstallmentType,
  InvoiceEditInstallmentType,
  InvoiceInstallmentType
} from 'src/types/apps/invoiceTypes'
import { Typography } from '@mui/material'

import { CommonService, DashboardService } from 'src/service'
import { status } from 'src/context/common'
import { CloseBox } from 'mdi-material-ui'
import { DDMMYYYDateFormat } from 'src/utils'

interface CellType {
  row: InvoiceInstallmentType
}

interface propsType {
  code: string
}

const CostContract = ({ code }: propsType) => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [response, setResponse] = useState<any>()
  const [installmentList, setInstallmentList] = useState<any>()
  const [venueLogisticsList, setVenueLogisticsList] = useState<any>()
  const [currencyList, SetCurrencyList] = useState<any>([])
  const [paymentTypeList, setPaymentTypeList] = useState<any>([])

  const handleCostSuccess = () => {
    successToast(messages.CostContractAdd)
  }
  const handleInstallmentSuccess = () => {
    successToast(messages.InstallmentAdd)
  }
  const handleVenueSuccess = () => {
    successToast(messages.VenueLogisticsAdd)
  }
  const handleVenueEdit = () => {
    successToast(messages.VenueLogisticsEdit)
  }
  const handleCostEdit = () => {
    successToast(messages.CostContractEdit)
  }
  const handleEditClick = () => {
    successToast(messages.InstallmentEdit)
  }

  const getCostContractList = async () => {
    const response = await DashboardService?.getCostContractDetail(code)
    if (response?.data?.statusCode === status.successCode) {
      setResponse(response?.data?.data)
    }
  }

  const createCostContract = async (data: IPayloadTypes) => {
    const response: any = await DashboardService?.addEditCost(data, code)
    if (response?.data?.statusCode == status.successCode) {
      getCostContractList()
    }
  }

  const getInstallmentAll = async () => {
    const installmentAll = await DashboardService?.getInstallmentAllDetail(code)
    if (installmentAll?.data?.statusCode === status.successCode) {
      setInstallmentList(installmentAll?.data?.data)
    }
  }

  const AddInstallment = async (data: InvoiceAddInstallmentType) => {
    const payload = {
      currency: data.currency,
      dueAmount: data.dueAmount,
      name: data.name,
      projectCode: code,
      dueDate: data.dueDate
    }
    const response: any = await DashboardService?.AddInstallmentDetails(payload)
    if (response?.data?.statusCode === status.successCodeOne) {
      getInstallmentAll()
    }
  }

  const getInstallmentList = async () => {
    const installmentList = await DashboardService?.getInstallmentDetail(code)
    if (installmentList?.data?.statusCode === status.successCode) {
      setInstallmentList(installmentList?.data?.data)
    }
  }
  const EditInstallment = async (data: InvoiceEditInstallmentType, installmentId: number) => {
    const response = await DashboardService?.EditInstallment(data, installmentId)
    if (response?.data?.statusCode == status.successCode) {
      getInstallmentList()
    }
  }

  const getVenueLogisticsList = async () => {
    const venueLogisticsList = await DashboardService?.getVenueLogisticDetail(code)
    if (venueLogisticsList?.data?.statusCode === status.successCode) {
      setVenueLogisticsList(venueLogisticsList?.data?.data)
    }
  }

  const venueLogisticsDetails = async (data: IAddVenueTypes) => {
    const response: any = await DashboardService?.addVenueLogistic(data, code)
    if (response?.data?.statusCode == status.successCode) {
      getVenueLogisticsList()
    }
  }

  const getCurrencyListDetails = async () => {
    const response = await CommonService.getCurrencyList()
    if (response?.data.statusCode == status.successCode && response?.data?.data) {
      SetCurrencyList(response?.data?.data?.filter((item: any) => item?.code !== 'KES'))
    }
  }

  const getPaymentListDetails = async () => {
    const response = await DashboardService.getPaymentTypesList()
    if (response?.data.statusCode == status.successCode && response?.data?.data) {
      setPaymentTypeList(response.data.data)
    }
  }

  useEffect(() => {
    getCostContractList()
    getInstallmentAll()
    getInstallmentList()
    getVenueLogisticsList()
    getCurrencyListDetails()
    getPaymentListDetails()
  }, [])
  const columns = [
    {
      field: 'id',
      minWidth: 40,
      headerName: '#'
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 250,
      headerName: 'Installment Name'
    },

    {
      flex: 0.1,
      minWidth: 80,
      field: 'currency',
      headerName: 'Currency',
      renderCell: ({ row }: any) => (
        <Box>{row.currency ? currencyList.find((currency: any) => currency.code === row.currency)?.name : '-'}</Box>
      )
    },

    {
      flex: 0.1,
      minWidth: 100,
      field: 'dueAmount',
      headerName: 'Amount'
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'dueDate',
      headerName: 'Due Date',
      renderCell: ({ row }: any) => <Box>{row.dueDate ? DDMMYYYDateFormat(row.dueDate) : '-'}</Box>
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <InstallmentDetail
                handleEditClick={handleEditClick}
                type='edit'
                EditInstallment={EditInstallment}
                data={row}
                currencyList={currencyList}
              />
            </Box>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Box>
      <Card sx={{ mt: 4.5, p: 7 }}>
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={8}>
            <h3 className='mt-0 d-flex'>Cost and Contract Details</h3>
          </Grid>

          <Grid item className='text-right'>
            <CostContractDetail
              handleClickSuccess={handleCostSuccess}
              handleEditSuccess={handleCostEdit}
              data={response}
              createCostContract={createCostContract}
              paymentTypeList={paymentTypeList}
            />
          </Grid>
        </Grid>
        {!!response ? (
          <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={3}>
              <label>Full Cost Of Training Quoted</label>
              <Typography>{response?.fullCost}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label>Contract Cost</label>
              <Typography>{response?.contractCost}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label>Variance Details</label>
              {response?.variance ? <Typography>{response?.varianceDetails}</Typography> : <Typography>-</Typography>}
            </Grid>
            <Grid item xs={3}>
              <label>Payment Type</label>
              <Typography>
                {response?.paymentType
                  ? paymentTypeList.find((payment: any) => payment.paymentCode === response.paymentType)?.paymentName ||
                    response.paymentType
                  : '-'}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box pt={10} pb={10} alignItems={'center'} textAlign={'center'}>
            <Typography alignItems={'center'}>
              <CloseBox fontSize='large' color='warning' />
            </Typography>
            No Data Found
          </Box>
        )}
      </Card>
      <Card sx={{ mt: 4.5, mb: 0, p: 7 }}>
        <Grid container display={'flex'} justifyContent={'space-between'}>
          <Grid item>
            <Box>
              <h3 className='mt-0 d-flex' style={{ margin: 0 }}>
                Installment Details
              </h3>
            </Box>
          </Grid>

          <Grid item className='text-right'>
            <InstallmentDetail
              handleClickSuccess={handleInstallmentSuccess}
              AddInstallment={AddInstallment}
              type='add'
              currencyList={currencyList}
            />
          </Grid>
        </Grid>
        {!!installmentList?.length ? (
          <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <DataGrid
              autoHeight
              pagination
              paginationMode='server'
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              rows={installmentList}
              columns={columns}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Grid>
        ) : (
          <Box pt={10} pb={10} alignItems={'center'} textAlign={'center'}>
            <Typography alignItems={'center'}>
              <CloseBox fontSize='large' color='warning' />
            </Typography>
            No Data Found
          </Box>
        )}
      </Card>

      <Card sx={{ mt: 4.5, p: 7 }}>
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={8}>
            <h3 className='mt-0 d-flex'>Venue Logistics</h3>
          </Grid>

          <Grid item className='text-right'>
            <VenueLogisticsDetail
              handleClickSuccess={handleVenueSuccess}
              venueLogisticsDetails={venueLogisticsDetails}
              data={venueLogisticsList}
              handleVenueEdit={handleVenueEdit}
            />
          </Grid>
        </Grid>

        {!!venueLogisticsList ? (
          <Grid container rowSpacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={3}>
              <label>Accommodation</label>
              <Typography>{venueLogisticsList?.accommodation ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label>Car Hire</label>
              <Typography>{venueLogisticsList?.carHire ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label>Flights</label>
              <Typography>{venueLogisticsList?.flights ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label>Venue Cost Included</label>
              <Typography>{venueLogisticsList?.venueCostIncluded ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={3}>
              <label> Catering Included</label>
              <Typography>{venueLogisticsList?.cateringInculded ? 'Yes' : 'No'}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Box pt={10} pb={10} alignItems={'center'} textAlign={'center'}>
            <Typography alignItems={'center'}>
              <CloseBox fontSize='large' color='warning' />
            </Typography>
            No Data Found
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default CostContract
