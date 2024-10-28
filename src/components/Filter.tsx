// ** React Imports
import { Fragment, useMemo, useState } from 'react'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Mui Imports
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Theme,
  Typography
} from '@mui/material'

// ** Icon Imports
import { Close, FilterVariant } from 'mdi-material-ui'

// Custom Services and Component
import CustomChip from 'src/@core/components/mui/chip'
import { admissionStatus, messages } from 'src/context/common'
import { errorToast, successToast } from './Toast'
import { IDynamicObject, IFilterOptionsTypes } from 'src/types/apps/corporatTypes'
import FallbackSpinner from 'src/@core/components/spinner'
import { IAllIntake, IFilterFieldsTypes } from 'src/types/apps/invoiceTypes'
import EmptyBox from './icons/EmptyBox'
import { getName } from 'src/utils'

interface IFilterProps {
  studentData: Array<IDynamicObject>
  handleSort: (val: IDynamicObject) => void
  filterOptions?: IFilterOptionsTypes
  fields?: Array<IFilterFieldsTypes>
  filterDefaultValues?: IDynamicObject
  setSearchValue: (val: string) => void
  allIntake?: IAllIntake[]
  getStudentList?: (() => void) | undefined
  filterSubStatus?: boolean
}

const schema = yup.object().shape({
  firstName: yup.string(),
  email: yup.string().email(messages.validEmail),
  courseType: yup.string(),
  enrolmentCode: yup.string(),
  status: yup.string(),
  projectName: yup.string(),
  programName: yup.string()
})
const defaultValues = {
  firstName: '',
  email: '',
  courseType: '',
  enrolmentCode: '',
  status: '',
  projectName: '',
  programName: '',
  studentTypeCode: ''
}

const Filter = ({
  studentData,
  handleSort,
  filterOptions,
  fields,
  filterDefaultValues = defaultValues,
  setSearchValue,
  allIntake,
  getStudentList,
  filterSubStatus = false
}: IFilterProps) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [data, setData] = useState<IDynamicObject>(filterDefaultValues)
  const [filterData, setFilterData] = useState<Array<string>>([])

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, touchedFields }
  } = useForm<IDynamicObject>({
    defaultValues: data,
    resolver: yupResolver(schema)
  })

  const corporateFilterFields = [
    {
      id: 0,
      name: 'firstName',
      label: 'Name'
    },
    {
      id: 1,
      name: 'email',
      label: 'Email'
    },
    {
      id: 2,
      name: 'studentCode',
      label: 'Student Code'
    },
    {
      id: 3,
      name: 'projectCode',
      label: 'Project',
      list: filterOptions?.projects
    },
    {
      id: 4,
      name: 'programCode',
      label: 'Qualification Name',
      list: filterOptions?.programs
    },
    {
      id: 6,
      name: 'status',
      label: 'Status',
      list: filterOptions?.status
    }
  ]
  const filterFields = !!fields?.length ? fields : corporateFilterFields

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent | React.BaseSyntheticEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setOpenDrawer(open)
    }
  const handleOpenFilter = (event: React.MouseEvent) => {
    toggleDrawer(true)(event)
  }

  const clearFilter = () => {
    setData(filterDefaultValues)
    reset(filterDefaultValues)
    if (!!filterData.length) {
      handleSort(filterDefaultValues)
    }
    setSearchValue('')
    setFilterData([])
    successToast(messages.filtersCleared)
  }
  useMemo(() => {
    getStudentList && getStudentList()
  }, [filterData])

  const onSubmit = (data: IDynamicObject, event?: React.BaseSyntheticEvent) => {
    let updatedData = data
    if (filterSubStatus) {
      const splitStatus = data?.status?.split('/')
      const status = splitStatus?.[0]
      const subStatus = splitStatus?.[1] || ''
      updatedData = { ...data, status, subStatus }
    }

    setSearchValue('')
    if (Object.keys(touchedFields)?.length > 0) {
      setData(updatedData)

      const newFilterData = Object.values(updatedData)
        .map(item => {
          if (data.status && item === data.status.split('/')[0]) {
            return data.status
          }

          if (data.status && item === data.status.split('/')[1]) {
            return ''
          }

          return item
        })
        .filter(item => item)

      handleSort(updatedData)
      setFilterData(newFilterData)

      if (event) toggleDrawer(false)(event)
      successToast(messages.filtersApplied)
    } else {
      errorToast('Please Fill any of the Fields')
    }
  }

  const qualificationStatusObj = fields?.find(items => items.name === 'status')
  const progName = filterFields?.find(items => items?.name === 'programCode')
  const agentObject = filterFields?.find(items => items?.name === 'SsaCode')
  const statusObject = filterFields?.find(items => items?.name === 'SsaStatus')
  const studyModeCodeObject = filterFields?.find(items => items?.name === 'studyModeCode')
  const studentTypeObject = filterFields?.find(items => items?.name === 'studentTypeCode')

  return (
    <Fragment>
      <Box display='flex' alignItems='center'>
        {filterData?.length > 0 && (
          <Fragment>
            {filterData?.map(
              (types: string) =>
                !!types && (
                  <Box pr={2} key={types}>
                    <CustomChip
                      label={
                        (types.includes('INT') && getName(allIntake, types)) ||
                        getName(admissionStatus, types) ||
                        (types.includes('Prog') && getName(progName?.list, types)) ||
                        getName(qualificationStatusObj?.list, types) ||
                        getName(agentObject?.list, types) ||
                        getName(statusObject?.list, types) ||
                        getName(studyModeCodeObject?.list, types) ||
                        getName(studentTypeObject?.list, types) ||
                        types
                      }
                      skin='light'
                      size='small'
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                )
            )}
            <Box sx={{ mr: 2 }}>
              <Button variant='outlined' size='small' startIcon={<Close />} onClick={clearFilter}>
                Clear Filters
              </Button>
            </Box>
          </Fragment>
        )}

        <Box>
          <Button onClick={handleOpenFilter} variant='outlined' size='small' startIcon={<FilterVariant />}>
            Filters
          </Button>
        </Box>
      </Box>

      {!!data ? (
        <SwipeableDrawer anchor='right' open={openDrawer} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
          <Box minWidth='390px'>
            <Box
              p={2}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              sx={{ bgcolor: (theme: Theme) => theme.palette.grey[100] }}
            >
              <Box display='flex'>
                <FilterVariant />
                <Typography variant='h6' pl={2}>
                  Filters
                </Typography>
              </Box>

              <IconButton onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <Close color='error' />
              </IconButton>
            </Box>

            {studentData || filterData?.length > 0 ? (
              <Box
                sx={{
                  '& > :not(style)': { width: '36ch' }
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={4} m={4}>
                    {filterFields?.map(item => (
                      <Grid key={item.id} item xs={12}>
                        <Controller
                          control={control}
                          name={item.name}
                          render={({ field }) =>
                            item?.list ? (
                              <FormControl fullWidth variant='standard'>
                                <InputLabel>{item.label}</InputLabel>
                                <Select
                                  {...field}
                                  endAdornment={
                                    field.value ? (
                                      <InputAdornment position='end' style={{ marginRight: 20 }}>
                                        <IconButton
                                          edge='end'
                                          onClick={() =>
                                            item?.name == 'studentTypeCode'
                                              ? setValue(item?.name, null)
                                              : setValue(item?.name, '')
                                          }
                                        >
                                          <Close />
                                        </IconButton>
                                      </InputAdornment>
                                    ) : null
                                  }
                                  MenuProps={{
                                    anchorOrigin: {
                                      vertical: 'bottom',
                                      horizontal: 'left'
                                    }
                                  }}
                                >
                                  {item?.list?.map(item =>
                                    typeof item === 'string' ? (
                                      <MenuItem key={item} value={item}>
                                        {item}
                                      </MenuItem>
                                    ) : (
                                      <MenuItem key={item.code} value={item.code}>
                                        {item.name}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                            ) : item?.name === 'mobileNumber' ||
                              item?.name === 'studentCode' ||
                              item?.name === 'name' ? (
                              <TextField
                                {...field}
                                label={item.label}
                                variant='standard'
                                fullWidth
                                error={!!errors[item.name]}
                                helperText={errors[item.name]?.message as string | undefined}
                                type='text'
                                onChange={e => {
                                  item?.name === 'mobileNumber'
                                    ? setValue(`${item.name}`, e.target.value.replace(/[^0-9]/g, ''))
                                    : item?.name === 'name'
                                      ? setValue(`${item.name}`, e.target.value.replace(/[^A-Za-z ]/g, ''))
                                      : setValue(`${item.name}`, e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
                                }}
                              />
                            ) : (
                              <TextField
                                {...field}
                                label={item.label}
                                variant='standard'
                                fullWidth
                                error={!!errors[item.name]?.message}
                                helperText={errors[item.name]?.message as string | undefined}
                                type='text'
                              />
                            )
                          }
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Grid container columnSpacing={3} pt={6}>
                        <Grid item xs={4}>
                          <Button fullWidth size='small' variant='contained' type='submit'>
                            Apply Filter
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button fullWidth size='small' variant='outlined' onClick={clearFilter}>
                            Clear Filter
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button fullWidth size='small' variant='outlined' onClick={toggleDrawer(false)}>
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            ) : (
              <Grid container height='calc(100vh - 60px)'>
                <Grid item xs={12}>
                  <EmptyBox message='There is No List to be filtered' />
                </Grid>
              </Grid>
            )}
          </Box>
        </SwipeableDrawer>
      ) : (
        <FallbackSpinner />
      )}
    </Fragment>
  )
}

export default Filter
