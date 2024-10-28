// ** MUI Imports
import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'

// ** Custom Components and Services
import Chip from 'src/@core/components/mui/chip'
import { TypographyEllipsis } from 'src/styles/style'
import { IAllStatus, IStatusItem } from 'src/types/apps/dataTypes'
import { getStatus, minTwoDigits, serialNumber } from 'src/utils'

// ** Interfaces
import {
  IIndexTypes,
  ISSACommonListTypes,
  ISSAStudentDataResponseTypes,
  ssaStatusChipColor,
  ssaStatusLabels,
  ssaStatusList
} from 'src/views/apps/ssa/sssConstants'

export const ssaColumns = (pageSize: number, pageNumber: number, commonList: ISSACommonListTypes) => {
  const columns: GridColumns<ISSAStudentDataResponseTypes> = [
    {
      field: 'id',
      minWidth: 50,
      headerName: '#',
      renderCell: (index: IIndexTypes) =>
        minTwoDigits(serialNumber(index.api.getRowIndex(index.row.id), pageNumber, pageSize))
    },
    {
      field: 'studentCode',
      flex: 0.4,
      minWidth: 120,
      headerName: 'Student ID',
      renderCell: ({ row }) => {
        return <Typography variant='caption'>{row?.application?.lead?.studentCode ?? '-'}</Typography>
      }
    },
    {
      field: 'name',
      flex: 1,
      minWidth: 240,
      headerName: 'Student Name',
      renderCell: ({ row }) => {
        return (
          <Box>
            <Typography variant='body2'>
              {`${row?.application?.lead?.firstName} ${row?.application?.lead?.lastName}` ?? '-'}
            </Typography>
            <Typography variant='caption'>{row?.application?.lead?.email}</Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 150,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }) =>
        `+${row?.application?.lead?.mobileCountryCode} ${row?.application?.lead?.mobileNumber}` ?? '-'
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'education',
      headerName: 'Qualification Details',
      renderCell: ({ row }) => {
        return (
          <Grid container>
            <Grid item xs={12}>
              <Tooltip
                title={`${row?.application?.education?.programCode ?? '-'} - ${
                  row?.application?.education?.programName ?? '-'
                }`}
              >
                <TypographyEllipsis variant='body2'>
                  {row?.application?.education?.programCode ?? '-'} - {row?.application?.education?.programName ?? '-'}
                </TypographyEllipsis>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <Tooltip title='Academic Year'>
                  <Typography variant='caption'>{row?.intakeAcademicYear ?? '-'} | </Typography>
                </Tooltip>
                <Tooltip title='Study Type'>
                  <Typography variant='caption'>{row?.application?.education?.studyModeCode ?? '-'} | </Typography>
                </Tooltip>
                <Tooltip title='Student Type'>
                  <Typography variant='caption'>{row?.application?.education?.studentTypeCode ?? '-'}</Typography>
                </Tooltip>
              </Typography>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 0.6,
      minWidth: 210,
      field: 'qualification',
      headerName: 'Qualification Status',
      renderCell: ({ row }) => {
        const status = getAllQualificationStatus(commonList.qualificationStatusList)

        return (
          <Grid container>
            <Grid item>
              {status
                ? getStatus(
                    status,
                    row?.application?.status && row?.application?.subStatus
                      ? `${row?.application?.status}/${row?.application?.subStatus}`
                      : row?.application?.status
                  )
                : row?.application?.status}
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 0.6,
      minWidth: 160,
      field: 'SsaCode',
      headerName: 'Assigned To',
      renderCell: ({ row }) => {
        const SSA = commonList?.ssaList.find(i => i?.code === row?.SsaCode)

        return <Typography variant='body2'>{SSA ? `${SSA?.firstName} ${SSA?.lastName}` : '-'}</Typography>
      }
    },
    {
      flex: 0.6,
      minWidth: 160,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <Tooltip title={ssaStatusLabels[row.SsaStatus] ?? row.SsaStatus} placement='top'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              skin='light'
              size='small'
              label={ssaStatusLabels[row.SsaStatus] ?? row.SsaStatus}
              color={ssaStatusChipColor[row.SsaStatus]}
              sx={{
                textTransform: 'capitalize',
                '& .MuiChip-label': {
                  lineHeight: '18px'
                }
              }}
            />
          </Box>
        </Tooltip>
      )
    }
  ]

  return columns
}

export const ssaFilterFields = (commonList: ISSACommonListTypes) => {
  const fields = [
    {
      id: 0,
      name: 'studentCode',
      label: 'Student Id'
    },
    {
      id: 1,
      name: 'firstName',
      label: 'Name'
    },
    {
      id: 2,
      name: 'email',
      label: 'Email'
    },
    {
      id: 3,
      name: 'mobileNumber',
      label: 'Contact Number'
    },
    {
      id: 4,
      name: 'studentTypeCode',
      label: 'Student Type',
      list: commonList.studyType
    },
    {
      id: 5,
      name: 'studyModeCode',
      label: 'Study Mode',
      list: commonList.studyMode
    },
    {
      id: 6,
      name: 'SsaCode',
      label: 'Assigned To',
      list: commonList.ssaList
    },
    {
      id: 7,
      name: 'status',
      label: 'Qualification Status',
      list: getAllQualificationStatus(commonList.qualificationStatusList)
    },
    {
      id: 8,
      name: 'SsaStatus',
      label: 'Select Status',
      list: ssaStatusList
    }
  ]

  return fields
}

export const getAllQualificationStatus = (studentStatus: IStatusItem[]) => {
  const allStatus: Array<IAllStatus> = []
  studentStatus?.map(item => {
    if (!!item?.subStatus?.length) {
      item.subStatus?.map(itemstatus => {
        allStatus.push({
          name: `${item?.name} - ${itemstatus?.name}`,
          code: `${item?.code}/${itemstatus?.code}`,
          status: item?.code
        })
      })
    }

    allStatus.push({
      name: `${item?.name}`,
      code: item?.code
    })
  })

  return allStatus
}
