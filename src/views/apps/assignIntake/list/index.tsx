import { Box, Button, Grid, Tooltip, Typography } from '@mui/material'
import Chip from 'src/@core/components/mui/chip'

import {
  applicationStatusColor,
  intakeStatue,
  intakeStatusColor,
  studentApplicationAllStatus
} from 'src/context/common'
import { TypographyEllipsis } from 'src/styles/style'
import { CellType } from 'src/types/apps/common'
import { IIntakeData } from 'src/types/apps/invoiceTypes'
import { getName, minTwoDigits, serialNumber } from 'src/utils'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, PermissionsCodes, moduleKeys } from 'src/components/common/featureData'

// remove when Api Integration completed

interface IActionButtonPropTypes {
  row: IIntakeData
  setShowAssignChangeDialogue: (arg0: IIntakeData) => void
}

interface IIndex {
  api: {
    getRowIndex: (arg0: number) => number
  }
  row: {
    id: number
  }
}

const ActionButtons = ({ row, setShowAssignChangeDialogue }: IActionButtonPropTypes) => {
  let actionText = 'Assign Intake'
  if (row?.status === intakeStatue.assigned) {
    actionText = 'Change Intake'
  }

  return (
    <Button
      size='small'
      variant='outlined'
      disabled={row?.status === intakeStatue.enrolled || row?.status === intakeStatue.progAdmitted}
      onClick={() => {
        setShowAssignChangeDialogue(row)
      }}
    >
      {actionText}
    </Button>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columns = (
  setShowAssignChangeDialogue: () => void,
  programList: any,
  allIntake: any,
  pageNumber: number,
  pageSize: number
) => {
  const fullPermission = ModuleFeaturePermission(FeatureCodes.EMS.assignIntake, PermissionsCodes.full, moduleKeys.sales)

  const column = [
    {
      field: 'id',
      maxWidth: 50,
      headerName: '#',
      renderCell: (index: IIndex) => {
        return <Box>{`${minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))}`}</Box>
      }
    },
    {
      flex: 0.4,
      minWidth: 120,
      field: 'studentId',
      headerName: ' STUDENT ID',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{`${
            row?.lead?.studentCode === null ? '-' : (row?.lead?.studentCode ?? '-')
          }`}</Typography>
        </Box>
      )
    },
    {
      flex: 0.7,
      minWidth: 200,
      field: 'studentName',
      headerName: 'STUDENT NAME',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography
            noWrap
            variant='body2'
            sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
          >{`${row?.lead?.firstName === null ? '-' : row?.lead?.firstName} ${
            row?.lead?.lastName === null ? '-' : row?.lead?.lastName
          }`}</Typography>
          <Tooltip title='Student Mail'>
            <Typography noWrap variant='caption'>
              {row?.lead?.email === null ? '-' : (row?.lead?.email ?? '-')}
            </Typography>
          </Tooltip>
        </Box>
      )
    },
    {
      minWidth: 140,
      field: 'contact',
      headerName: 'CONTACT',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography variant='body2'>{`+${
            row?.lead?.mobileCountryCode === null ? '-' : (row?.lead?.mobileCountryCode ?? '-')
          } ${row?.lead?.mobileNumber === null ? '-' : (row?.lead?.mobileNumber ?? '-')}`}</Typography>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'interestedProgram',
      headerName: 'qualification details',
      renderCell: ({ row }: CellType) => (
        <Grid container>
          <Grid item xs={12}>
            <Tooltip
              title={`${row?.education?.programCode || '_'} - ${
                row?.education?.programCode === null ? '-' : getName(programList, row?.education?.programCode)
              }`}
            >
              <TypographyEllipsis variant='body2'>{`${row?.education?.programCode || '_'} - ${
                row.education?.programCode === null ? '-' : getName(programList, row?.education?.programCode)
              }`}</TypographyEllipsis>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Tooltip title='Academic Year'>
              <Typography variant='caption'>
                {`${row?.enrolment?.intakeAcademicYear === null ? '-' : row?.enrolment?.intakeAcademicYear}`} |{' '}
              </Typography>
            </Tooltip>
            <Tooltip title='Student Type'>
              <Typography variant='caption'>
                {`${row.education?.studentTypeCode === null ? '-' : row.education?.studentTypeCode}`} |{' '}
              </Typography>
            </Tooltip>
            <Tooltip title='Study Mode'>
              <Typography variant='caption'>{`${
                row.education?.studyModeCode === null ? '-' : row.education?.studyModeCode
              }`}</Typography>
            </Tooltip>
          </Grid>
        </Grid>
      )
    },
    {
      flex: 0.8,
      minWidth: 220,
      field: 'intakeName',
      headerName: 'INTAKE NAME',
      renderCell: ({ row }: CellType) => (
        <Tooltip
          title={row?.enrolment?.intake?.code ? `${getName(allIntake, row?.enrolment?.intake?.code)}` : ''}
          placement='top'
        >
          <Box>
            <Typography variant='body2'>
              {row?.enrolment?.intake?.code ? `${getName(allIntake, row?.enrolment?.intake?.code)}` : 'Not Assigned'}
            </Typography>
          </Box>
        </Tooltip>
      )
    },
    {
      flex: 0.6,
      field: 'status',
      minWidth: 210,
      headerName: 'STATUS',
      renderCell: ({ row }: CellType) => (
        <Tooltip title={studentApplicationAllStatus[row.status] ?? row.status} placement='top'>
          <Box>
            <Chip
              skin='light'
              label={studentApplicationAllStatus[row.status] ?? row.status}
              size='small'
              color={intakeStatusColor[row.status] ?? applicationStatusColor[row.status] ?? 'secondary'}
            />
          </Box>
        </Tooltip>
      )
    }
  ]
  if (fullPermission) {
    column.push({
      field: 'action',
      minWidth: 150,
      headerName: 'Action',
      renderCell: ({ row }: CellType) => (
        <Box>
          <ActionButtons row={row} setShowAssignChangeDialogue={setShowAssignChangeDialogue} />
        </Box>
      )
    })
  }

  return column
}
