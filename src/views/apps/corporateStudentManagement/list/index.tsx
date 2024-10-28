import { Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import { dateFormat, minTwoDigits, serialNumber } from 'src/utils'
import { IEnrollCorporateRowContent } from 'src/context/common'
import { Key, useState } from 'react'

interface CellType {
  row: IEnrollCorporateRowContent
}
interface IStudentList {
  responseData: IEnrollCorporateRowContent[]
  count: number
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const StudentList = ({ responseData, count }: IStudentList) => {
  const [pageNumber, setPageNumber] = useState<number>(1)

  const columns = [
    {
      flex: 0.1,
      maxWidth: 70,
      field: 'id',
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index?.row?.id), pageNumber, 10))}`}</Box>
      }
    },
    {
      flex: 0.15,
      maxWidth: 150,
      field: 'studentCode',
      headerName: 'Student ID',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row?.application?.lead?.studentCode}</Typography>
      }
    },
    {
      flex: 0.15,
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
      flex: 0.2,
      maxWidth: 360,
      field: 'groupName',
      headerName: 'Group Name',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.groupDetails?.name} placement='left'>
            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant='body2'>
              {row?.groupDetails?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.2,
      maxWidth: 380,
      field: 'Intakename',
      headerName: 'Intake Name',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row?.intakeData?.name} placement='left'>
            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant='body2'>
              {row?.intakeData?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.25,
      field: 'courseDetails',
      headerName: 'Module Details',
      renderCell: ({ row }: CellType) => {
        const courses = row?.intakeData?.courses

        if (!courses || courses?.length === 0) {
          return null
        }

        return (
          <Tooltip
            title={
              <>
                <ol style={{ paddingLeft: 10 }}>
                  {courses &&
                    courses?.map((item: any, index: Key | null | undefined) => (
                      <li key={index}>{`${item?.name} - ${item?.code}`}</li>
                    ))}
                </ol>
              </>
            }
            placement='left'
          >
            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant='body2'>
              {courses?.map((item: any) => `${item?.name} - ${item?.code}`).join(',')}
            </Typography>
          </Tooltip>
        )
      }
    },

    {
      flex: 0.2,
      maxWidth: 240,
      field: 'enrolledDate',
      headerName: 'Enrollment Date',
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            {row?.enrolmentDate ? (
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

  return (
    <>
      {responseData && (
        <DataGrid
          autoHeight
          pagination
          paginationMode='client'
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          rows={responseData}
          rowCount={count}
          columns={columns}
          pageSize={10}
          sx={{
            '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },

            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: ' bold' }
          }}
          onPageChange={newPage => setPageNumber(newPage + 1)}
        />
      )}
    </>
  )
}
export default StudentList
