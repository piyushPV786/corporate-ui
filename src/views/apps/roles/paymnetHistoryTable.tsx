// ** React Imports
import { useState } from 'react'

// ** MUI Imports

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports

import CustomChip from 'src/@core/components/mui/chip'

import { ThemeColor } from 'src/@core/layouts/types'

// ** Imports for view/ download file

import { DateFormat } from 'src/utils'
import { Tooltip } from '@mui/material'
import { IPaymentTypes } from 'src/types/apps/aggregatorTypes'

interface UserStatusType {
  [key: string]: ThemeColor
}
interface CellType {
  row: IPaymentTypes
}
interface IPamentHistoryTable {
  payment: IPaymentTypes[]
}

const paymentStatus: any = {
  successful: 'Successful',
  pending: 'Pending',
  rejected: 'Rejected',
  error_perm: 'Failed'
}

const status = {
  successful: 'successful',
  pending: 'pending'
}
const userStatusObj: UserStatusType = {
  successful: 'primary',
  pending: 'warning',
  rejected: 'error',
  error_perm: 'error'
}
const PaymentHistoryTable = ({ payment }: IPamentHistoryTable) => {
  const [pageSize, setPageSize] = useState<number>(10)

  console.log('payments =====>', payment)

  const columns = [
    {
      flex: 0.15,
      maxWidth: 62,
      headerName: '#',
      field: 'id',
      renderCell: (index: any) => {
        return index?.api?.getRowIndex(index?.row?.rowId) + 1
      }
    },
    {
      flex: 0.1,
      minWidth: 130,
      field: 'feeModeCode',
      headerName: 'Fee Type',
      renderCell: ({ row }: CellType) => {
        // const { feeModeCode } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{row?.description ? `${row?.description}` : '-'}</Box>
        )
      }
    },
    {
      field: 'Fee Details',
      minWidth: 100,
      headerName: 'Fee Details',
      renderCell: ({ row }: CellType) => {
        return <Box sx={{ display: 'flex', alignItems: 'center' }}>{row?.debit ? `R ${row?.debit}` : '-'}</Box>
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'transactionId',
      headerName: 'Transaction Id/Paid Date',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Tooltip title={row?.transactionId ?? ''}>
                <Typography
                  variant='body2'
                  sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
                >
                  {row?.transactionId || row?.autoIdx || '-'}
                </Typography>
              </Tooltip>
              <Tooltip title='Date of Payment'>
                <Typography variant='caption'>{row?.dtstamp ? DateFormat(new Date(row?.dtstamp)) : '-'}</Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },

    // {
    //   flex: 0.15,
    //   minWidth: 130,
    //   maxWidth: 200,
    //   headerName: 'Payment Mode',
    //   field: 'paymentType',
    //   renderCell: ({ row }: CellType) => {
    //     return (
    //       <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
    //         {row?.paymentType ? row?.paymentType : '-'}
    //       </Typography>
    //     )
    //   }
    // },
    {
      flex: 0.15,
      minWidth: 130,
      maxWidth: 160,
      headerName: 'Invoice No.',
      field: 'invoiceNumber',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
            {row?.reference ? row?.reference : '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <CustomChip
              skin={'filled' as any}
              size='small'
              label={paymentStatus[row.debit ? status.successful : status.pending]}
              color={userStatusObj[row.debit ? status.successful : status.pending]}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            rows={payment?.map((item: any, index: any) => {
              return { rowId: index, ...item }
            })}
            getRowId={row => row?.rowId}
            columns={columns as any}
            disableSelectionOnClick
            pageSize={pageSize}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaymentHistoryTable
