import { Grid, Card } from '@mui/material'

import Typography from '@mui/material/Typography'
import TableHeader from 'src/views/apps/admission/list/TableHeader'

import * as React from 'react'
import { useState, useEffect } from 'react'

// ** Third Party Library
import 'react-datepicker/dist/react-datepicker.css'
import Row from 'src/views/apps/acadmic/list/acadmicList'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  TablePagination,
  CircularProgress,
  Box
} from '@mui/material'
import { IProgramList } from 'src/types/apps/invoiceTypes'

import 'react-datepicker/dist/react-datepicker.css'
import { AcademicHeaders, messages, status } from 'src/context/common'
import { IAcademicApiType } from 'src/context/types'
import { ApplyService, AcademicService } from 'src/service'
import { errorToast, loadingToast, successToast } from 'src/components/Toast'
import CustomNoRowsOverlay from 'src/components/no-records'

interface IDataParams {
  q: string
  pageSize: number
  pageNumber: number
}

const AcademicList = () => {
  const [value, setValue] = useState('')
  const [studentRecord, setStudentRecord] = useState<any>({ data: [], count: 0 })
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [programList, setProgramList] = useState<IProgramList[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const TableHeaderTypography = styled(Typography)(() => ({
    fontWeight: 'bold',
    fontSize: '0.75rem',
    letterSpacing: '0.17px'
  }))

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStudentAllRecordList = async (param: IDataParams) => {
    setLoading(true)
    const studentRecord = await ApplyService?.getStudentRecordList(param)
    if (studentRecord) {
      setStudentRecord(studentRecord)
    }
    setLoading(false)
  }

  const getProgramList = async () => {
    setLoading(true)
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
    setLoading(false)
  }

  const handleFilter = (val: string) => {
    setValue(val)
    if (page >= 1) {
      setPage(0)
    }
  }

  useEffect(() => {
    getStudentAllRecordList({
      q: value,
      pageSize: rowsPerPage,
      pageNumber: page + 1
    })
  }, [page, rowsPerPage, value])

  useEffect(() => {
    getProgramList()
  }, [])

  const handleOnDownloadClick = async (studentCode: string, programCode: string) => {
    loadingToast('Downloading...')
    const downloadedTranscript = await AcademicService.downloadTranscript(studentCode, programCode)
    if (downloadedTranscript?.status == status.successCode) {
      downloadTranscripts(downloadedTranscript?.data)
    } else {
      errorToast(messages.error)
    }
  }
  const downloadTranscripts = (fileName: Blob) => {
    const url = URL.createObjectURL(fileName)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Academic Transcript'
    a.click()
    successToast(messages.downloadAcademicTranscript)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography className='page-header'> Student Academic Transcripts</Typography>
        <Typography
          className='breadcrumb-section'
          sx={{
            '& .breadcrumb': {
              color: '#008554'
            }
          }}
        >
          <span className='breadcrumb'>Dashboard</span> / Student Academic Transcripts
        </Typography>

        <Card>
          <Box>
            <TableHeader value={value} handleFilter={handleFilter} />
            <TableContainer>
              <Table aria-label='collapsible table' className='custom-table'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F5F5F7' }}>
                    {AcademicHeaders.map((item: any) => (
                      <TableCell
                        key={item.name}
                        sx={{
                          flex: item.flex,
                          minWidth: item.minWidth,
                          display: item.display,
                          justifyContent: item.justifyContent
                        }}
                      >
                        <TableHeaderTypography>{item.name}</TableHeaderTypography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box textAlign='center'>
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : studentRecord?.data?.length > 0 ? (
                    studentRecord?.data?.map((row: IAcademicApiType, index: number) => (
                      <Row
                        key={row.id}
                        row={row}
                        index={index}
                        programList={programList}
                        pageNumber={page}
                        pageSize={rowsPerPage}
                        handleOnDownloadClick={handleOnDownloadClick}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11}>
                        <CustomNoRowsOverlay />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              count={studentRecord?.count}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AcademicList
