import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Close } from 'mdi-material-ui'
import { Fragment, useEffect, useState } from 'react'
import FallbackSpinner from 'src/@core/components/spinner'
import { formatDate } from 'src/@core/utils/format'
import Chip from 'src/@core/components/mui/chip'
import { applicationStatusColor, studentApplicationAllStatus, studentApplicationSubStatus } from 'src/context/common'
import { DashboardService } from 'src/service'
import { IStatusHistoryItem } from 'src/types/apps/dataTypes'
import { dateFormat, minTwoDigits, serialNumber } from 'src/utils'
import ChangeStatus from 'src/components/icons/ChangeStatus'
import { StatushistoryParams } from 'src/service/Dashboard'
import { parseISO } from 'date-fns'

interface CellType {
  row: IStatusHistoryItem
}
interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

type params = {
  studentData: any
}

const DialogStatusHistory = ({ studentData }: params) => {
  const [open, setOpen] = useState<boolean>(false)
  const [response, setResponse] = useState<{ data: Array<IStatusHistoryItem>; count: number }>()
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const columns = [
    {
      flex: 0.1,
      maxWidth: 70,
      field: 'id',
      headerName: '#',
      renderCell: (row: IIndex) => minTwoDigits(serialNumber(row.api.getRowIndex(row.row.id), pageNumber, pageSize))
    },
    {
      flex: 0.25,
      maxWidth: 450,
      field: 'to',
      headerName: 'To',
      renderCell: ({ row }: CellType) => {
        return <Typography>{`${row?.status}-${row?.subStatus}`}</Typography>
      }
    },
    {
      flex: 0.25,
      maxWidth: 400,
      field: 'comments',
      headerName: 'Comments',
      renderCell: ({ row }: CellType) => {
        return (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{row?.comments}</Typography>
              <Typography>{formatDate(parseISO(studentData?.application?.enrolment?.graduationDate))}</Typography>
            </Box>
          </>
        )
      }
    },
    {
      flex: 0.25,
      maxWidth: 270,
      field: 'updatedAt',
      headerName: 'Updated at',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.updatedAt ? dateFormat(new Date(row?.updatedAt)) : 'N/A'}</Typography>
      }
    }
  ]

  const getStatusHistory = async (params: StatushistoryParams) => {
    const response = await DashboardService?.getStatusHistory(params)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
  }

  useEffect(() => {
    getStatusHistory({
      studentCode: studentData?.application?.lead?.studentCode,
      pageSize: pageSize,
      pageNumber: pageNumber
    })
  }, [studentData, pageSize, pageNumber])

  const status = studentData?.application?.status

  return (
    <Fragment>
      <Box>
        <Chip
          size='medium'
          color={applicationStatusColor[status]}
          label={
            !!studentData?.application?.subStatus
              ? `${studentApplicationAllStatus[status]}-${studentApplicationSubStatus[studentData?.application?.subStatus] ?? studentData?.application?.subStatus}`
              : studentApplicationAllStatus[status]
          }
          onDelete={handleClickOpen}
          deleteIcon={<ChangeStatus viewBox='0 0 19 19' />}
        />
      </Box>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        fullWidth
        maxWidth='lg'
        scroll='body'
      >
        <IconButton
          onClick={handleClose}
          color='primary'
          sx={{
            right: 20,
            top: '11%',
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
        >
          <Close fontSize='large' />
        </IconButton>

        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
            Status History
          </Typography>
        </DialogTitle>
        <DialogContent>
          {response ? (
            <DataGrid
              autoHeight
              pagination
              paginationMode='server'
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              rows={response?.data ?? []}
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
          ) : (
            <FallbackSpinner />
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default DialogStatusHistory
