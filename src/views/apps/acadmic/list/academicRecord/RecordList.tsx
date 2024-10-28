import { useState, useEffect } from 'react'
import { Box, Button, Grid, Theme, Tooltip, Typography, styled } from '@mui/material'
import * as React from 'react'
import Card from '@mui/material/Card'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { Download } from 'mdi-material-ui'
import { AcademicService } from 'src/service'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { roundToTwoDecimalPlaces } from 'src/utils'

interface IAcademicRecord {
  studentCode: string
  handleOnDownloadClick: (studentCode: string, programCode: string) => void
  programCode: string
}

const AcademicRecordList = ({ studentCode, handleOnDownloadClick, programCode }: IAcademicRecord) => {
  const [studentData, setStudentData] = useState<any>()

  const AcademicTypography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.common.white
  }))

  const getAcadmicStudentList = async () => {
    const studentDataRecord = await AcademicService?.getAllStudentDetailsById(studentCode, programCode)
    if (studentDataRecord) {
      setStudentData(studentDataRecord.data.data)
    }
  }

  useEffect(() => {
    getAcadmicStudentList()
  }, [])

  const TableCard = styled(Card)(() => ({
    '& .digital-assessment': {
      backgroundColor: 'rgba(106, 118, 124, .1)'
    },
    '& .final-digital-assessment': {
      backgroundColor: 'rgba(106, 118, 124, .1)'
    },
    '& .assignments': {
      backgroundColor: 'rgba(42, 107, 100, .1)'
    },
    '& .examination': {
      backgroundColor: 'rgba(91, 70, 78, .1)'
    },
    '& .total': {
      backgroundColor: 'rgba(75, 183, 74, .1)'
    }
  }))

  const columns: GridColumns<IDynamicObject> = [
    {
      minWidth: 76,
      flex: 0,
      field: 'year',
      headerName: 'Year'
    },
    {
      minWidth: 240,
      flex: 0.25,
      field: 'courseCode',
      headerName: 'Module Code',
      renderCell: ({ row }) => row.course?.code
    },
    {
      minWidth: 240,
      flex: 0.25,
      field: 'courseName',
      headerName: 'Module Name',
      renderCell: ({ row }) => (
        <Tooltip title={`${row.course?.name || '-'}`}>
          <Typography variant='body2' sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.course?.name ? row.course?.name : '-'}
          </Typography>
        </Tooltip>
      )
    },
    {
      minWidth: 240,
      flex: 0.1,
      field: 'finalAssesment',
      headerClassName: 'digital-assessment',
      cellClassName: 'digital-assessment',
      renderHeader: () => <AcademicTypography>Digital Assessment</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 150,
      flex: 0.1,
      field: 'finalAssignments',
      headerClassName: 'assignments',
      cellClassName: 'assignments',
      renderHeader: () => <AcademicTypography>Assignments</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 160,
      flex: 0.1,
      field: 'finalExamination',
      headerClassName: 'examination',
      cellClassName: 'examination',
      renderHeader: () => <AcademicTypography>Examination</AcademicTypography>,
      renderCell: ({ value }) => (value > 0 && value != 0 ? value : '-')
    },
    {
      minWidth: 160,
      flex: 0.1,
      field: 'finalTotalMarks',
      headerClassName: 'total',
      cellClassName: 'total',
      renderHeader: () => <AcademicTypography>Total(100%)</AcademicTypography>,
      renderCell: ({ row }: any) => {
        return (
          <>
            <Typography variant='body2'>
              {row?.finalAssignments > 0 &&
              row?.finalAssesment > 0 &&
              row?.finalExamination > 0 &&
              row?.finalTotalMarks > 0
                ? roundToTwoDecimalPlaces(row?.finalTotalMarks)
                : '-'}
            </Typography>
          </>
        )
      }
    },
    {
      minWidth: 160,
      flex: 0.1,
      field: 'symbol',
      headerName: 'Symbol',
      renderCell: ({ value }: any) => (value ? (value !== '--' ? value : '-') : '-')
    },
    {
      minWidth: 160,
      flex: 0.1,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ value }: any) => (value ? (value !== '--' ? value : '-') : '-')
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid item xs={12} mt={12}>
          <TableCard>
            <Box
              sx={{
                p: 5,
                pb: 3,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant='h6' color='primary.main'>
                  Academic Transcript
                </Typography>
              </Box>

              <Box>
                <Button
                  startIcon={<Download />}
                  variant='outlined'
                  onClick={() => handleOnDownloadClick(studentCode, programCode)}
                >
                  DOWNLOAD
                </Button>
              </Box>
            </Box>
            <DataGrid
              autoHeight
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              rows={studentData || []}
              getRowId={row => row?.id}
              columns={columns}
              disableSelectionOnClick
            />
          </TableCard>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AcademicRecordList
