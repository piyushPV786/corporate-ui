import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Close } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import FallbackSpinner from 'src/@core/components/spinner'
import { applicationStatusColor, status, studentApplicationAllStatus } from 'src/context/common'
import { DashboardService } from 'src/service'
import { DataParams } from 'src/service/Dashboard'
import { TypographyEllipsis } from 'src/styles/style'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { ICorporateStudentRowContent } from 'src/types/apps/invoiceTypes'
import { serialNumber } from 'src/utils'
import { IStudent } from 'src/views/apps/project/Preview'

type params = {
  open: boolean
  handleCloseStudentListPopup: () => void
  selectedProject: any
}

const ProjectStudentListDialog = ({ open, handleCloseStudentListPopup, selectedProject }: params) => {
  console.log(selectedProject)

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [projectStudentListData, setProjectStudentListData] = useState<IStudent>()
  const [loading, setIsLoading] = useState<boolean>(false)

  const getStudentList = async (param: DataParams) => {
    if (!selectedProject?.code) return

    setIsLoading(true)
    const response = await DashboardService?.getProjectStudentList(selectedProject?.code, param)
    if (response?.status === status.successCode && response?.data?.data) {
      setProjectStudentListData(response?.data?.data)
    }
    setIsLoading(false)
  }

  const RowArray = projectStudentListData?.data

  const columns = [
    {
      flex: 0.1,
      maxWidth: 70,
      field: 'id',
      headerName: '#',
      renderCell: (row: IDynamicObject) => serialNumber(row.api.getRowIndex(row.row.id), pageNumber, pageSize)
    },
    {
      flex: 0.1,
      minWidth: 125,
      field: 'regNo',
      headerName: 'Reg No',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Typography style={{ fontWeight: 'bold' }} variant='body1'>
            {row?.lead?.studentCode ?? '-'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 150,
      headerName: 'Name',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography style={{ fontWeight: 'bold' }} variant='body1'>
              {row?.lead?.firstName ? `${row?.lead?.firstName} ${row?.lead?.lastName}` : ''}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'contact',
      headerName: 'Email & Contact Details',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <Tooltip title={row?.lead?.email ?? ''}>
              <TypographyEllipsis variant='body1'>{row?.lead?.email ?? ''}</TypographyEllipsis>
            </Tooltip>
            <Tooltip title={row?.lead?.mobileNumber ?? ''}>
              <TypographyEllipsis variant='body2'>
                {row?.lead?.mobileCountryCode ? `+${row?.lead?.mobileCountryCode}` : ''} {row?.lead?.mobileNumber ?? ''}
              </TypographyEllipsis>
            </Tooltip>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 160,
      field: 'idNo',
      headerName: 'National ID',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Typography style={{ fontWeight: 'bold' }} variant='body1'>
            {row?.lead?.identificationNumber ?? '-'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'groups',
      headerName: 'Group Details',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title='Group Name'>
              <Typography
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.enrolment?.corporateGroup?.name || '-'}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={!!studentApplicationAllStatus[row.status] ? studentApplicationAllStatus[row.status] : row.status}
          >
            <Box>
              <CustomChip
                skin='light'
                size='small'
                label={!!studentApplicationAllStatus[row.status] ? studentApplicationAllStatus[row.status] : row.status}
                color={applicationStatusColor[row.status]}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '5px',
                  textTransform: 'capitalize'
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      )
    }
  ]
  useEffect(() => {
    getStudentList({ pageNumber: pageNumber, pageSize: pageSize })
  }, [pageNumber, pageSize])

  useEffect(() => {
    if (selectedProject?.code) {
      getStudentList({ pageNumber: pageNumber, pageSize: pageSize })
    }
  }, [selectedProject])

  return (
    <Dialog
      open={open}
      onClose={(event: any, reason: string) => {
        reason !== 'backdropClick' && handleCloseStudentListPopup()
      }}
      fullWidth
      maxWidth='lg'
      scroll='body'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Grid container display='flex'>
          <Grid item xs={11}>
            <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
              {selectedProject?.name}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={handleCloseStudentListPopup} color='primary'>
              <Close fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        {RowArray ? (
          <DataGrid
            loading={loading}
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
            rowCount={projectStudentListData?.count}
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

export default ProjectStudentListDialog
