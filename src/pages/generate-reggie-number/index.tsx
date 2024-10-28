/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, GridRowId } from '@mui/x-data-grid'

import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Custom Components Imports

import TableHeader from 'src/views/apps/admission/list/TableHeader'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import { AcademicService, CommonService, DashboardService, FinanceService } from 'src/service'
import { messages, status } from 'src/context/common'
import { StudentReggieParams, commonListTypes } from 'src/types/apps/dataTypes'
import { formateDateToMonthYear, getCheckName, getName, minTwoDigits, serialNumber } from 'src/utils'
import GenerateReggieNumber from 'src/views/pages/dialog/GenerateReggieNumberDialog'
import { errorToast, loadingToast, successToast } from 'src/components/Toast'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { TypographyEllipsis } from 'src/styles/style'
import { allowedDocsForCreditVetting } from 'src/service/config'

interface CellType {
  row: InvoiceType
}
const initialState = {
  statusCode: 1,
  message: '',
  data: []
}

interface DataParams {
  q: string
  pageSize: number
  pageNumber: number
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

// ** Styled component for the link in the dataTable

const StudentList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [response, setResponse] = useState<any>(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [nationality, setNationality] = useState<commonListTypes[]>([])
  const [identificationType, setIdentificationType] = useState<commonListTypes[]>([])
  const [feeMode, setFeeMode] = useState<commonListTypes[]>([])
  const [programList, setProgramList] = useState<any[]>([])
  const [feeDetails, setFeeDetails] = useState<any>([])
  const [genderDetails, setGenderDeatails] = useState<any[]>([])
  const [raceDetails, setRaceDeatails] = useState<any[]>([])
  const [languageDetails, setLanguageDeatails] = useState<any[]>([])

  const getStudentList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getStudentReggieNumber(params)
    if (response?.data?.statusCode === status.successCode && response?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }

  const feeModeResponses = async () => {
    const feeModeResponse = await CommonService?.getFeeModeList()
    if (feeModeResponse?.data?.statusCode === status.successCode && feeModeResponse?.data?.data) {
      setFeeMode(feeModeResponse?.data?.data)
    }
  }

  const getGenderListDetails = async () => {
    const genderListResponse = await CommonService?.getGenderList()
    if (genderListResponse?.data?.statusCode === status.successCode && genderListResponse?.data?.data) {
      setGenderDeatails(genderListResponse?.data?.data)
    }
  }

  const getRaceList = async () => {
    const getRaceListResponse = await CommonService?.getRace()
    if (getRaceListResponse?.data?.statusCode === status.successCode && getRaceListResponse?.data?.data) {
      setRaceDeatails(getRaceListResponse?.data?.data)
    }
  }

  const getLanguageList = async () => {
    const getLanguageListResponse = await CommonService?.getLanguage()
    if (getLanguageListResponse?.data?.statusCode === status.successCode && getLanguageListResponse?.data?.data) {
      setLanguageDeatails(getLanguageListResponse?.data?.data)
    }
  }

  const getNationalityData = async () => {
    const response = await CommonService.getNationalityList()
    if (response?.status === status.successCode && response?.data?.data?.length) {
      setNationality(response.data.data)
    }
  }
  const getIdentificationType = async () => {
    const response = await CommonService.getIdentificationTypeList()

    if (response?.data?.statusCode === status.successCode && response?.data?.data?.length) {
      setIdentificationType(response?.data?.data)
    }
  }
  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && !!response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  const userDetailUpdate = async (data: StudentReggieParams) => {
    loadingToast()
    const result = await DashboardService.generateReggieStudent(data)
    if (result?.status === status.successCodeOne) {
      getStudentList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber
      })

      if (allowedDocsForCreditVetting.includes(data.identificationDocumentType))
        await FinanceService.createCreditReport(result?.data?.data?.applicationData?.applicationCode)

      successToast(`${messages.reggieNumberGenerated} ${data.firstName} ${data.lastName}`)
    } else {
      errorToast(messages.error)
    }
  }
  const getFeeDetailsByProgramCode = async (programCode: string) => {
    const result = await FinanceService?.getFeeDetails(programCode)
    if (result) {
      setFeeDetails(result)
    }
  }

  useEffect(() => {
    getNationalityData()
    getIdentificationType()
    feeModeResponses()
    getProgramList()
    getGenderListDetails()
    getRaceList()
    getLanguageList()
  }, [])

  useEffect(() => {
    getStudentList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber
    })
  }, [pageSize, pageNumber, value])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const columns = [
    {
      field: 'id',
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'studentCode',
      headerName: 'Reggie No',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{row?.lead?.studentCode ? row?.lead?.studentCode : '-'}</Typography>
        </Box>
      )
    },
    {
      flex: 1.5,
      minWidth: 220,
      field: 'name',
      headerName: 'Student Name',
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName, email } = row?.lead

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid container display='flex'>
                <Grid item>
                  <Typography
                    noWrap
                    variant='body2'
                    sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                  >
                    {`${firstName} ${lastName}`}
                  </Typography>
                </Grid>
              </Grid>
              <Tooltip title='Student Email'>
                <Typography noWrap variant='caption'>
                  {email ? email : '-'}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1.2,
      minWidth: 180,
      field: 'mobileNumber',
      headerName: 'Contact',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {row?.lead?.mobileNumber ? `+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}` : '-'}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 160,
      field: 'nationality',
      headerName: 'Nationality',
      renderCell: ({ row }: CellType) => {
        const nationalityName = row?.lead?.nationality ? getName(nationality, row?.lead?.nationality) : null

        return (
          <Typography variant='body2'>
            {nationalityName ? nationalityName.replace(/^\w/, (c: any) => c.toUpperCase()) : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 1.2,
      minWidth: 180,
      field: 'idDetails',
      headerName: 'ID Details',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container display='flex'>
              <Grid item>
                <Typography
                  noWrap
                  variant='body2'
                  sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                >
                  {row?.lead?.identificationNumber ? `${row?.lead?.identificationNumber}` : '-'}
                </Typography>
              </Grid>
            </Grid>
            <Typography noWrap variant='caption'>
              {row?.lead?.identificationDocumentType ? row?.lead?.identificationDocumentType : '-'}
            </Typography>
          </Box>
        </Box>
      )
    },

    {
      flex: 2,
      minWidth: 300,
      field: 'qualification',
      headerName: 'Qualification Details',
      renderCell: ({ row }: CellType) => (
        <Grid container>
          <Grid item xs={12}>
            <Tooltip
              title={
                row?.education?.programCode
                  ? `${row?.education?.programCode} - ${getCheckName(programList, row?.education?.programCode)}`
                  : ''
              }
            >
              <TypographyEllipsis variant='body2'>
                {row?.education?.programCode} - {getName(programList, row?.education?.programCode)}
              </TypographyEllipsis>
            </Tooltip>
            <Typography variant='caption'>
              {row?.education?.studyModeCode ? row?.education?.studyModeCode : '-'}
            </Typography>
          </Grid>
        </Grid>
      )
    },
    {
      flex: 1,
      minWidth: 180,
      field: 'startDate',
      headerName: 'Expected Start Date',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>
          {row?.enrolment?.expectedStartDate
            ? formateDateToMonthYear(new Date(row?.enrolment?.expectedStartDate))
            : '-'}
        </Typography>
      )
    },

    {
      flex: 1.2,
      minWidth: 180,
      field: 'paymentMode',
      headerName: 'Payment Mode',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row?.education?.programMode ? row?.education?.programMode : '-'}</Typography>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: '5',
            marginBottom: '.5rem'
          }}
        >
          <Box>
            <Typography className='page-header'>Generate Reggie Number</Typography>
            <Typography
              className='breadcrumb-section'
              sx={{
                '& .breadcrumb': {
                  color: '#008554'
                }
              }}
            >
              <span className='breadcrumb'>Dashboard</span> / Generate Reggie Number
            </Typography>
          </Box>
          <FullPermission featureCode={FeatureCodes.EMS.generateReggieNumber}>
            <Box display='flex' justifyContent='flex-end'>
              <GenerateReggieNumber
                setFeeDetails={setFeeDetails}
                feeDetails={feeDetails}
                genderDetails={genderDetails}
                raceDetails={raceDetails}
                languageDetails={languageDetails}
                feeMode={feeMode}
                nationality={nationality}
                documentType={identificationType}
                userDetailUpdate={userDetailUpdate}
                programList={programList}
                getFeeDetailsByProgramCode={getFeeDetailsByProgramCode}
              />
            </Box>
          </FullPermission>
        </Box>

        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
          <DataGrid
            loading={loading}
            autoHeight
            pagination
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={response?.data}
            rowCount={response?.count}
            columns={columns}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentList
