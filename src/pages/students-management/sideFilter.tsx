import {
  Box,
  Button,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Close } from 'mdi-material-ui'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { enrollStatusSelect } from 'src/context/common'
import { IIntakeType, IProgramAPITypes } from 'src/context/types'
import { IStudentManagementfilter } from 'src/types/apps/invoiceTypes'

interface DefaultStateType {
  groupCode: string
  groupName: string
  programName: string
  academicYear: string
  intakeName: string
  status: string
}

interface IProps {
  openFilterSidebar: boolean
  handleSidebarClose: () => void
  intakeLists: IIntakeType[]
  years: Array<string>
  searchFilter: (arg1: IStudentManagementfilter) => void
  programList: IProgramAPITypes[]
  getStudentGroupList: any
  setSearchValue: (val: string) => void
}

const defaultValue: DefaultStateType = {
  groupCode: '',
  groupName: '',
  programName: '',
  academicYear: '',
  intakeName: '',
  status: ''
}

const SideFilterBar = ({
  openFilterSidebar,
  handleSidebarClose,
  intakeLists,
  years,
  searchFilter,
  programList,
  setSearchValue
}: IProps) => {
  const [filterFormData, setFilterFormData] = useState(defaultValue)
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: {}
  } = useForm({ defaultValues: filterFormData })

  const onSubmit = (data: DefaultStateType) => {
    setSearchValue('')
    const payload = {
      groupCode: data.groupCode,
      groupName: data.groupName,
      programName: data.programName,
      academicYear: data.academicYear,
      intakeName: data.intakeName,
      status: data.status
    }
    setFilterFormData(defaultValue)
    searchFilter(payload)

    // reset()
  }

  const resetToEmptyValues = useCallback(() => {
    searchFilter(defaultValue)
    reset(defaultValue)
    setFilterFormData(defaultValue)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue])

  return (
    <Drawer
      anchor='right'
      open={openFilterSidebar}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 350] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255)
        }}
      >
        <Typography variant='h6'>Filters</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Close fontSize='small' onClick={handleSidebarClose} sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='groupCode'
              control={control}
              render={({ field }) => <TextField {...field} size='small' label='Group Code' variant='standard' />}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='groupName'
              control={control}
              render={({ field }) => <TextField {...field} size='small' label='Group Name' variant='standard' />}
            />
          </FormControl>
          <Controller
            control={control}
            name='programName'
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 6 }} variant='standard'>
                <InputLabel>Qualification Name</InputLabel>
                <Select
                  {...field}
                  endAdornment={
                    field.value ? (
                      <InputAdornment position='end' style={{ marginRight: 20 }}>
                        <IconButton edge='end' onClick={() => setValue('programName', '')}>
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  {programList?.map(item => (
                    <MenuItem key={`program-list--${item?.id}`} value={item?.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='academicYear'
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 6 }} variant='standard'>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  {...field}
                  endAdornment={
                    field.value ? (
                      <InputAdornment position='end' style={{ marginRight: 20 }}>
                        <IconButton edge='end' onClick={() => setValue('academicYear', '')}>
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  {years?.map(item => (
                    <MenuItem key={`academic-year-${item}`} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='intakeName'
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 6 }} variant='standard'>
                <InputLabel>Intake Name</InputLabel>
                <Select
                  {...field}
                  endAdornment={
                    field.value ? (
                      <InputAdornment position='end' style={{ marginRight: 20 }}>
                        <IconButton edge='end' onClick={() => setValue('intakeName', '')}>
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  {intakeLists?.map(item => (
                    <MenuItem key={`intake-name-${item?.id}`} value={`${item?.code}`}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 6 }} variant='standard'>
                <InputLabel>Status</InputLabel>
                <Select
                  {...field}
                  endAdornment={
                    field.value ? (
                      <InputAdornment position='end' style={{ marginRight: 20 }}>
                        <IconButton edge='end' onClick={() => setValue('status', '')}>
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  {enrollStatusSelect?.map(item => (
                    <MenuItem key={item.name} value={item.value}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }} justifyContent={'space-between'}>
            <Button size='small' type='submit' variant='contained'>
              Apply Filter
            </Button>
            <Button size='small' variant='outlined' color='secondary' onClick={resetToEmptyValues}>
              Clear Filter
            </Button>
            <Button size='small' variant='outlined' color='secondary' onClick={handleSidebarClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SideFilterBar
