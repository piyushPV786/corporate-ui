/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { IVenueType } from 'src/types/apps/invoiceTypes'

// ** Third Party Styles Imports

import { AcademicService, DashboardService } from 'src/service'
import { Typography } from '@mui/material'
import { errorToast, successToast } from 'src/components/Toast'
import { messages, status, venueMessages } from 'src/context/common'
import VenueDetailsDialog from 'src/views/pages/dialog/VenueDetails'
import { DateFormat, formatDateYMD, getName } from 'src/utils'

interface CellType {
  row: IVenueType
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
  projectCode: string
}

interface propsType {
  code: string
  setIsLoading: (isLoading: boolean) => void
}

// ** Styled component for the link in the dataTable

const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

const VenueDetails = ({ code, setIsLoading }: propsType) => {
  const projectCode: string = code

  // ** State
  const [value, setQuery] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [response, setResponse] = useState<any>(initialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [facilitatorList, setFacilitatorList] = useState<any[]>([])

  const getFacilitator = async () => {
    const response = await AcademicService.getFacilitator()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setFacilitatorList(response?.data?.data)
    }
  }

  const handleEdit = async (params: any, id: number) => {
    setIsLoading(true)
    const payload = {
      ...params,
      date: new Date(params.date)
    }
    const response = await DashboardService?.editVenue(payload, id)

    if (response?.status === status.successCode) {
      await getVenueList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber,
        projectCode: projectCode
      })
      successToast(venueMessages.edit)
    }
    setIsLoading(false)
  }

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      headerName: '#',
      renderCell: (index: any) => index.api.getRowIndex(index.row.id) + 1
    },
    {
      flex: 0.2,
      field: 'name',
      minWidth: 200,
      headerName: 'Venue'
    },
    {
      flex: 0.25,
      field: 'facilitator',
      minWidth: 200,
      headerName: 'Facilitator',
      renderCell: ({ row }: CellType) => <Typography>{getName(facilitatorList, row?.facilitator)}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }: CellType) => <Typography>{DateFormat(row?.date)}</Typography>
    },
    {
      flex: 0.1,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <VenueDetailsDialog title='Edit' data={row} handleEdit={handleEdit} facilitatorList={facilitatorList} />
          </Tooltip>
        </Box>
      )
    }
  ]

  const getVenueList = async (params: DataParams) => {
    setLoading(true)
    const response = await DashboardService?.getVenueList(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
    setLoading(false)
  }
  const createVenue = async (params: any) => {
    setIsLoading(true)
    const payload = {
      ...params,
      projectCode: projectCode,
      date: formatDateYMD(params.date)
    }
    const response = await DashboardService?.createVenue(payload)
    if (response?.status === status.successCodeOne) {
      await getVenueList({
        q: value,
        pageSize: pageSize,
        pageNumber: pageNumber,
        projectCode: projectCode
      })
      successToast(venueMessages.add)
    } else if (response?.data?.message) {
      const errorMessage = response.data.message
      const regex = /FACI\d{9}/
      const match = errorMessage.match(regex)

      if (match) {
        const facilitatorCode = match[0]
        const facilitatorName = getName(facilitatorList, facilitatorCode)
        const replaceRegex = new RegExp(`\\(${facilitatorCode}\\)`, 'g')
        const updatedErrorMessage = errorMessage.replace(replaceRegex, `(${facilitatorName})`)
        errorToast(updatedErrorMessage)
      } else {
        errorToast(errorMessage)
      }
    } else {
      errorToast(messages.defaultErrorMessage)
    }
    setIsLoading(false)
  }
  const user = window.localStorage.getItem('userData')
  useEffect(() => {
    getVenueList({
      q: value,
      pageSize: pageSize,
      pageNumber: pageNumber,
      projectCode: projectCode
    })
  }, [pageSize, pageNumber, value, projectCode])

  useEffect(() => {
    getFacilitator()
  }, [])

  return (
    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Card sx={{ p: 5 }}>
          <Grid
            item
            xs={12}
            sx={{
              pb: 3,
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant='h5'>Venue Details</Typography>
            </Box>
            <VenueDetailsDialog title='Add' createVenue={createVenue} facilitatorList={facilitatorList} />
          </Grid>
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
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: ' bold' }
            }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            onPageChange={newPage => setPageNumber(newPage + 1)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default VenueDetails
