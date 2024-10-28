import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Close } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import { Enrolment, Group, IGroupAPITypes, Intake, Program } from 'src/context/types'
import { IRowContent } from 'src/types/apps/invoiceTypes'
import { dateFormat, serialNumber } from 'src/utils'
import StudentPopUpheader from './StudentPopUpheader'
import FallbackSpinner from 'src/@core/components/spinner'
import { ProgAdmitted, applicationStatusColor, intakeStatue } from 'src/context/common'
import CustomChip from 'src/@core/components/mui/chip'

interface ISelectedRow {
  itemNumber: number
  isActive: boolean
  id: number
  programCode: string
  groupCode: string
  intakeCode: string
  excludeStudent: string
  includeStudent: string
  status: string
  enrolment: Enrolment[]
  program: Program
  group: Group
  studentCount: number
  intake: Intake[]
}
interface CellType {
  row: IRowContent
}

type params = {
  conformationOpen: boolean
  loader: boolean
  handleCloseConfirmationPopup: () => void
  selectedRows: ISelectedRow
  response: { data: IGroupAPITypes[]; count: number }
  getStudentList: (params: any) => Promise<void>
  value: string
}

const StudentListPopup = ({
  conformationOpen,
  handleCloseConfirmationPopup,
  response,
  selectedRows,
  getStudentList,
  loader,
  value
}: params) => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const handleFilterStudent = (val: string) => {
    if (val.length > 3) {
      getStudentList({ pageNumber: pageNumber, pageSize: pageSize, q: val, intakeCode: selectedRows?.intakeCode })
    } else if (val.length === 0) {
      getStudentList({ pageNumber: pageNumber, pageSize: pageSize, q: val, intakeCode: selectedRows?.intakeCode })
    }
  }

  const RowArray = response?.data
  const columns = [
    {
      flex: 0.1,
      maxWidth: 70,
      field: 'id',
      headerName: '#',
      renderCell: ({ row }: CellType) => {
        return <Typography>{`${row?.itemNumber?.toString().padStart(2, '0')}`}</Typography>
      }
    },
    {
      flex: 0.25,
      maxWidth: 150,
      field: 'studentCode',
      headerName: 'Student ID',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.application?.lead?.studentCode}</Typography>
      }
    },
    {
      flex: 0.25,
      maxWidth: 150,
      field: 'name',
      headerName: 'Student Name',
      renderCell: ({ row }: CellType) => {
        return row?.application?.lead?.firstName ? (
          <Tooltip title={`${row?.application?.lead?.firstName} ${row?.application?.lead?.lastName}`} placement='top'>
            <Typography
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >{`${row?.application?.lead?.firstName} ${row?.application?.lead?.lastName}`}</Typography>
          </Tooltip>
        ) : (
          '-'
        )
      }
    },
    {
      flex: 0.25,
      maxWidth: 360,
      field: 'Intakename',
      headerName: 'Intake Name',
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row?.intake?.name}</Typography>
      }
    },
    {
      flex: 0.25,
      field: 'courseDetails',
      headerName: 'Module Details',
      renderCell: ({ row }: CellType) => {
        const intkaCoursesCourse = row?.intake?.intakeCoursesCourse

        if (!intkaCoursesCourse || intkaCoursesCourse?.length === 0) {
          return null
        }

        return (
          <Tooltip
            title={
              <>
                <ol style={{ paddingLeft: 10 }}>
                  {intkaCoursesCourse &&
                    intkaCoursesCourse?.map((item, index) => (
                      <li key={index}>{`${item?.course?.name} - ${item?.batchCode}`}</li>
                    ))}
                </ol>
              </>
            }
            placement='left'
          >
            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant='body2'>
              {intkaCoursesCourse?.map(item => `${item?.course?.name} - ${item?.batchCode}`).join(',')}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            {row?.application?.status === intakeStatue.progAdmitted ? (
              <CustomChip
                skin='light'
                size='small'
                label={ProgAdmitted[row?.application?.status]}
                color={applicationStatusColor[row?.application?.status]}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            ) : (
              '-'
            )}
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'enrolledDate',
      headerName: 'Enrollment Date',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            {row?.application?.status === intakeStatue.progAdmitted ? (
              <Typography variant='body2'>
                {row?.enrolmentDate ? dateFormat(new Date(row?.enrolmentDate)) : '-'}
              </Typography>
            ) : (
              '-'
            )}
          </Box>
        )
      }
    }
  ]
  useEffect(() => {
    getStudentList({ pageNumber: pageNumber, pageSize: pageSize, intakeCode: selectedRows?.intakeCode })
  }, [pageNumber, pageSize])

  return (
    <Dialog
      open={conformationOpen}
      onClose={(event: any, reason: string) => {
        reason !== 'backdropClick' && handleCloseConfirmationPopup()
      }}
      fullWidth
      maxWidth='lg'
      scroll='body'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Grid container display='flex'>
          <Grid item xs={11}>
            <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
              {selectedRows?.group?.name}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={handleCloseConfirmationPopup} color='primary'>
              <Close fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <StudentPopUpheader value={value} handleFilter={handleFilterStudent} />
      <DialogContent>
        {RowArray ? (
          <DataGrid
            loading={loader}
            autoHeight
            pagination
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={RowArray?.map((item: IRowContent | any, index: number) => ({
              ...item,
              itemNumber: serialNumber(index, pageNumber, pageSize)
            }))}
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
  )
}

export default StudentListPopup
