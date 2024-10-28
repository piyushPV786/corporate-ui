import { Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography, styled, Box } from '@mui/material'
import { Close } from 'mdi-material-ui'
import { Fragment, useState } from 'react'
import { AcademicService } from 'src/service'
import { DataGrid } from '@mui/x-data-grid'
import { IAllIntake, InvoiceType } from 'src/types/apps/invoiceTypes'
import { getName, serialNumber } from 'src/utils'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { CreditAffordableDataStatus, checkPaymentType, status } from 'src/context/common'

interface CellType {
  row: IDynamicObject
}

type IIntakeCourseListDialogPropsType = {
  studentData: InvoiceType
  intakeList: IAllIntake[]
}

// ** Styled component for the Intake Title in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: 'pointer'
}))

const IntakeCourseListDialog = ({ studentData, intakeList }: IIntakeCourseListDialogPropsType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [intakeCourseList, setIntakeCourseList] = useState([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const getCourseByIntakeCode = async () => {
    const response = await AcademicService.getIntakeLists(studentData?.enrolment?.intake?.code)
    if (response?.statusCode === status.successCode && !!response?.data) {
      setIntakeCourseList(response?.data?.courses)
    }
    setIsLoading(false)
  }

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      headerName: '#',
      renderCell: ({ row }: CellType) => {
        return <Typography>{`${row?.itemNumber?.toString().padStart(2, '0')}`}</Typography>
      }
    },
    {
      flex: 1,
      field: 'code',
      headerName: 'Module Code'
    },
    {
      flex: 1,
      field: 'name',
      headerName: 'Module Name'
    },
    {
      flex: 1,
      field: 'type',
      headerName: 'Module Type'
    }
  ]

  const handleDialogClose = () => {
    setOpenDialog(false)
  }
  const handleDialogOpen = () => {
    setIsLoading(true)
    setOpenDialog(true)
    getCourseByIntakeCode()
  }

  const customTitle = (
    <Box padding={1} display={'flex'} justifyContent={'space-between'}>
      <Box>
        <Typography style={{ color: 'white', fontSize: '11px' }}>Affordability Rank</Typography>
        <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
          <strong>{studentData?.affordableRank ? CreditAffordableDataStatus[studentData?.affordableRank] : '-'}</strong>
        </Typography>
      </Box>
      <Box paddingLeft={'20px'}>
        <Typography style={{ color: 'white', fontSize: '11px' }}>Credit Risk</Typography>
        <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
          <strong>{studentData?.creditRisk ? CreditAffordableDataStatus[studentData?.creditRisk] : '-'}</strong>
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Fragment>
      <StyledLink onClick={handleDialogOpen}>
        <Tooltip
          title={
            studentData?.affordableRank === checkPaymentType.affordableValue ||
            studentData?.creditRisk === checkPaymentType.creditRiskValue
              ? customTitle
              : ''
          }
        >
          <strong>{getName(intakeList, studentData?.enrolment?.intake?.code) ?? '-'}</strong>
        </Tooltip>
      </StyledLink>
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleDialogClose()
        }}
        fullWidth
        maxWidth='lg'
        scroll='body'
      >
        <IconButton
          onClick={handleDialogClose}
          color='primary'
          sx={{
            right: 20,
            top: 30,
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
        >
          <Close fontSize='large' />
        </IconButton>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important', fontWeight: 'bold' }}>
            {getName(intakeList, studentData?.enrolment?.intake?.code)} - Module List
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DataGrid
            autoHeight
            pagination
            loading={isLoading}
            paginationMode='server'
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={
              intakeCourseList && Array.isArray(intakeCourseList)
                ? intakeCourseList?.map((item: IDynamicObject, index: number) => ({
                    ...item,
                    itemNumber: serialNumber(index, pageNumber, pageSize)
                  }))
                : []
            }
            rowCount={intakeCourseList && intakeCourseList?.length}
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
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default IntakeCourseListDialog
