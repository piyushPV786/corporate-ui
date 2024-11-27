// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { INotes } from 'src/types/apps/invoiceTypes'
import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Third Party Styles Imports
import { DashboardService } from 'src/service'
import { TablePagination, Typography } from '@mui/material'
import { successToast } from 'src/components/Toast'
import { IAddNotes } from 'src/context/types'
import { NotesMessages } from 'src/context/common'
import DeleteDialog from 'src/views/pages/dialog/Delete'
import NoteDialogs from 'src/views/pages/dialog/NotesDialog'

const initialState = {
  statusCode: 1,
  message: '',
  data: []
}

interface DataParams {
  status: string
  pageSize: number
  pageNumber: number
  projectCode: any
}

interface IProject {
  projectData: { code: string }
}
const ReadMore = ({ children }: { children: string }) => {
  const text = children
  const [isReadMore, setIsReadMore] = useState(true)

  const truncatedText = text.length > 50 ? text.slice(0, 50) + '...' : text

  return (
    <Box>
      {isReadMore ? truncatedText : text}

      {text.length > 50 && (
        <Button variant='text' size='small' onClick={() => setIsReadMore(!isReadMore)}>
          <Typography sx={{ color: theme => theme.palette.primary.main, textDecoration: 'underline' }}>
            {' '}
            {isReadMore ? 'more ' : 'less'}
          </Typography>
        </Button>
      )}
    </Box>
  )
}
const Notes = ({ projectData }: IProject) => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [response, setResponse] = useState<any>(initialState)
  const projectCode: string = projectData?.code

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(+event.target.value)
    setPageNumber(0)
  }
  const user = JSON.parse(`${window.localStorage.getItem('userData')}`)
  const userName: string = user.code

  const handleEdit = () => {
    successToast(NotesMessages.Edit)
  }
  const handleDelete = () => {
    successToast(NotesMessages.Delete)
  }
  const handleSuccess = () => {
    successToast(NotesMessages.Add)
  }

  const getNotesList = async (params: DataParams) => {
    const adjustedParams = { ...params, pageNumber: params.pageNumber + 1 } // Adjust the pageNumber before passing
    const response = await DashboardService?.getNotesList(adjustedParams)
    if (response?.status === 200 && response?.data?.data) {
      setResponse(response?.data?.data)
    }
  }

  const createNotes = async (params: IAddNotes) => {
    const response = await DashboardService?.createNotes(params)
    if (response?.status === 201) {
      handleSuccess()
      getNotesList({ pageSize: pageSize, pageNumber: pageNumber, status: '', projectCode: projectCode })
    }
  }
  const updateNotes = async (params: { notes: string }, id: string | number | undefined) => {
    const response = await DashboardService?.updateNotes(params, id)
    if (response?.status === 200) {
      handleEdit()
      getNotesList({ pageSize: pageSize, pageNumber: pageNumber, status: '', projectCode: projectCode })
    }
  }
  const deleteNotes = async (id: string | number | undefined) => {
    const response = await DashboardService?.deleteNotes(id)
    if (response?.status === 200) {
      handleDelete()
      getNotesList({ pageSize: pageSize, pageNumber: pageNumber, status: '', projectCode: projectCode })
    }
  }
  useEffect(() => {
    getNotesList({
      pageSize: pageSize,
      pageNumber: pageNumber,
      status: '',
      projectCode: projectCode
    })
  }, [pageSize, pageNumber])

  return (
    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Card>
          <Grid
            item
            xs={12}
            sx={{
              p: 2,
              pb: 3,
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant='h5'>Notes</Typography>
            </Box>
            <NoteDialogs title='Add' projectCode={projectCode} userName={userName} createNotes={createNotes} />
          </Grid>
          <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#ededf0' }}>
                      <TableCell sx={{ frontWidth: 600, color: 'black' }}>#</TableCell>
                      <TableCell sx={{ minWidth: 250, frontWidth: 600, color: 'black' }}>Notes</TableCell>
                      <TableCell sx={{ minWidth: 150, frontWidth: 600, color: 'black' }}>Created By</TableCell>
                      <TableCell sx={{ minWidth: 150, frontWidth: 600, color: 'black' }}>Creation Date</TableCell>
                      <TableCell sx={{ minWidth: 150, frontWidth: 600, color: 'black', fontSize: 14 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {response?.data?.map((row: INotes, i: number) => {
                      const date = new Date(row.createdAt)

                      return (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            <Typography>
                              {' '}
                              <ReadMore>{row.notes}</ReadMore>
                            </Typography>
                          </TableCell>
                          <TableCell>{row?.madeBy == userName ? 'You' : row?.madeByName}</TableCell>

                          <TableCell> {`${date.getDate()}/ ${date.getMonth() + 1}/${date.getFullYear()}`}</TableCell>
                          <TableCell>
                            {' '}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Tooltip title='Edit'>
                                <NoteDialogs title='Edit' data={row} userName={userName} updateNotes={updateNotes} />
                              </Tooltip>
                              <Tooltip title='delete'>
                                <DeleteDialog row={row} userName={userName} deleteNotes={deleteNotes} />
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={response?.data?.length}
                rowsPerPage={pageSize}
                page={pageNumber}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Notes
