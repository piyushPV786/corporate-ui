import * as React from 'react'
import { useState } from 'react'

// ** MUI Imports
import { Box, Grid, Tooltip, Typography, TableCell, TableRow, Collapse } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import 'react-datepicker/dist/react-datepicker.css'

import { IAcademicApiType } from 'src/context/types'
import AcademicRecordList from './academicRecord/RecordList'
import { ThemeColor } from 'src/@core/layouts/types'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { getName, minTwoDigits, serialNumber } from 'src/utils'
import { IProgramList } from 'src/types/apps/invoiceTypes'
import { applicationStatusColor, studentApplicationAllStatus } from 'src/context/common'

interface IRowProps {
  row: IAcademicApiType
  index: number
  programList: IProgramList[]
  pageNumber: number
  pageSize: number
  handleOnDownloadClick: (studentCode: string, programCode: string) => void
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  completed: 'primary',
  studying: 'warning',
  discontinued: 'error'
}

function Row({ row, index, programList, pageNumber, pageSize, handleOnDownloadClick }: IRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ minWidth: 50, flex: 0.15 }}>
          <Box>
            <Typography variant='body2'>{minTwoDigits(serialNumber(index, pageNumber + 1, pageSize))}</Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ minWidth: 145, flex: 0.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2'>{row?.lead?.studentCode}</Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell sx={{ flex: 0.17, minWidth: 200 }}>
          <Typography variant='body2'>
            {row?.lead?.firstName ? `${row?.lead?.firstName} ${row?.lead?.lastName}` : '-'}
          </Typography>
          <Tooltip title='Student Email'>
            <Typography noWrap variant='caption'>
              {row?.lead?.email}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ flex: 0.25, minWidth: 150 }}>
          <Typography variant='body2'>
            {row?.lead?.mobileCountryCode ? `+${row?.lead?.mobileCountryCode} ${row?.lead?.mobileNumber}` : '-'}
          </Typography>
        </TableCell>
        <TableCell sx={{ flex: 0.25, minWidth: 310 }}>
          <Tooltip
            title={`${row?.education?.programCode || '_'} - ${getName(programList, row?.education?.programCode)}`}
            placement='top'
          >
            <Typography variant='body2'>
              {row?.education?.programCode || '_'} - {getName(programList, row?.education?.programCode)}
            </Typography>
          </Tooltip>
          <Typography>
            <Tooltip title='Study Type'>
              <Typography variant='caption'>{row?.education?.studyModeCode}</Typography>
            </Tooltip>{' '}
            |{' '}
            <Tooltip title='Student Type'>
              <Typography variant='caption'>{row?.education?.studentTypeCode}</Typography>
            </Tooltip>
          </Typography>
        </TableCell>
        <TableCell sx={{ flex: 0.17, minWidth: 151 }}>
          <Tooltip title={studentApplicationAllStatus[row?.status] ?? row?.status} placement='top'>
            <Box>
              <CustomChip
                skin='light'
                size='small'
                label={studentApplicationAllStatus[row?.status] ?? row?.status}
                color={userStatusObj[row?.status] ?? applicationStatusColor[row?.status]}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='View'>
              <Box>
                <IconButton
                  size='small'
                  component='a'
                  color='primary'
                  sx={{ textDecoration: 'none', mr: 0.5 }}
                  onClick={() => setOpen(!open)}
                >
                  <EyeOutline />
                </IconButton>
              </Box>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow sx={{ bgcolor: '#f5f5f7' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={100}>
          <Collapse in={open} timeout='auto' unmountOnExit sx={{ paddingBottom: 10, paddingTop: 4 }}>
            <Grid item xs={12}>
              <AcademicRecordList
                studentCode={row?.lead?.studentCode}
                handleOnDownloadClick={handleOnDownloadClick}
                programCode={row?.education?.programCode}
              />
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default Row
