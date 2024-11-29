import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Close } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import { Enrolment, Group, Intake } from 'src/context/types'
import { ICorporateStudentRowContent } from 'src/types/apps/invoiceTypes'
import { dateFormat, serialNumber } from 'src/utils'
import StudentPopUpheader from './StudentPopUpheader'
import FallbackSpinner from 'src/@core/components/spinner'
import { applicationStatusColor, studentApplicationAllStatus } from 'src/context/common'
import CustomChip from 'src/@core/components/mui/chip'

interface ISelectedCorporateGroup {
  itemNumber: number
  isActive: boolean
  id: number
  name: string
  intakeCode: string
  status: string
  enrolment: Enrolment[]
  group: Group
  intake: Intake[]
}
interface CellType {
  row: ICorporateStudentRowContent
}

type params = {
  conformationOpen: boolean
  loader: boolean
  handleCloseConfirmationPopup: () => void
  selectedCorporateGroup: ISelectedCorporateGroup
  response: { data: any[]; count: number }
  getStudentList: (params: any) => Promise<void>
  value: string
}

const CorporateStudentListPopup = ({
  conformationOpen,
  handleCloseConfirmationPopup,
  response,
  selectedCorporateGroup,
  getStudentList,
  loader,
  value
}: params) => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const handleFilterStudent = (val: string) => {
    if (val.length > 3) {
      getStudentList({ pageNumber: pageNumber, pageSize: pageSize, q: val })
    } else if (val.length === 0) {
      getStudentList({ pageNumber: pageNumber, pageSize: pageSize, q: val })
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
        return <Typography>{row?.enrolment?.application?.lead?.studentCode}</Typography>
      }
    },
    {
      flex: 0.25,
      maxWidth: 150,
      field: 'name',
      headerName: 'Student Name',
      renderCell: ({ row }: CellType) => {
        return row?.enrolment?.application?.lead?.firstName ? (
          <Tooltip
            title={`${row?.enrolment?.application?.lead?.firstName} ${row?.enrolment?.application?.lead?.lastName}`}
            placement='top'
          >
            <Typography
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >{`${row?.enrolment?.application?.lead?.firstName} ${row?.enrolment?.application?.lead?.lastName}`}</Typography>
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
        const intakeName = row?.enrolment?.corporateGroup?.intake?.name;
    
        return (
          <Tooltip title={intakeName || 'No intake name available'} arrow>
            <Typography variant='body2' noWrap>
              {intakeName}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      flex: 0.25,
      field: 'courseDetails',
      headerName: 'Module Details',
      renderCell: ({ row }: CellType) => {
        const intkaCoursesCourse = row?.enrolment?.corporateGroup?.intake?.courses

        if (!intkaCoursesCourse || intkaCoursesCourse?.length === 0) {
          return null
        }

        return (
          <Tooltip
            title={
              <>
                <ol style={{ paddingLeft: 10 }}>
                  {intkaCoursesCourse &&
                    intkaCoursesCourse?.map((course, index) => (
                      <li key={index}>{`${course?.name} - ${course?.code}`}</li>
                    ))}
                </ol>
              </>
            }
            placement='left'
          >
            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant='body2'>
              {intkaCoursesCourse?.map((course: any) => `${course?.name} - ${course.code}`).join(',')}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            {row?.enrolment?.application?.status ? (
              <CustomChip
                skin='light'
                size='small'
                label={
                  !!studentApplicationAllStatus[row?.enrolment?.application?.status]
                    ? studentApplicationAllStatus[row?.enrolment?.application?.status]
                    : row?.enrolment?.application?.status
                }
                color={applicationStatusColor[row?.enrolment?.application?.status]}
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
            {row?.enrolment?.application?.status ? (
              <Typography variant='body2'>
                {row?.enrolment?.enrolmentDate ? dateFormat(new Date(row?.enrolment?.enrolmentDate)) : '-'}
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
    getStudentList({ pageNumber: pageNumber, pageSize: pageSize })
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
              {selectedCorporateGroup?.name}
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
            rows={RowArray?.map((item: ICorporateStudentRowContent | any, index: number) => ({
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

export default CorporateStudentListPopup
