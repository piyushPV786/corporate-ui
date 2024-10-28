import { Autocomplete, Box, Button, Drawer, Grid, TextField, Typography } from '@mui/material'
import { Close } from 'mdi-material-ui'
import { useCallback, useEffect } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { intakeStatusSelect, callFunctionOn } from 'src/context/common'
import { ICommonData, IProgramList, searchFilter } from 'src/types/apps/invoiceTypes'

interface DefaultStateType {
  studentId: string
  name: string
  email: string
  contact: string
  interestedProgram: string
  academicYear: string
  studentType: string
  studyMode: string
  intakeName: string
  status: string
}

interface IProps {
  openFilterSidebar: boolean
  handleSidebarClose: () => void
  commonData: ICommonData
  searchFilter: (arg1: searchFilter, arg0: string) => void
  programList: IProgramList[]
  setSearchValue: (val: string) => void
  filterData: any
}

const defaultValue: DefaultStateType = {
  studentId: '',
  name: '',
  email: '',
  contact: '',
  interestedProgram: '',
  academicYear: '',
  studentType: '',
  studyMode: '',
  intakeName: '',
  status: ''
}

const FilterSideBar = ({
  setSearchValue,
  openFilterSidebar,
  handleSidebarClose,
  commonData,
  searchFilter,
  programList,
  filterData
}: IProps) => {
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: defaultValue
  })

  useEffect(() => {
    reset(filterData)
  }, [filterData, reset])

  const onSubmit = (data: any) => {
    setSearchValue('')
    const payload = {
      name: data.name,
      contact: data.contact,
      email: data.email,
      studentId: data.studentId,
      academicYear: data.academicYear,
      intakeName: data.intakeName,
      interestedProgram: data.interestedProgram,
      status: data.status,
      studentType: data.studentType,
      studyMode: data.studyMode
    }
    searchFilter(payload, callFunctionOn?.onSubmit)
  }

  const resetToEmptyValues = useCallback(() => {
    reset(defaultValue)
    searchFilter(defaultValue, callFunctionOn?.reset)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset])

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
          <Grid container spacing={5} sx={{ pb: 3 }}>
            <Grid item sm={12}>
              <Controller
                name='studentId'
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth size='small' label='Student Id' variant='standard' />
                )}
              />
            </Grid>

            <Grid item sm={12}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth size='small' label='Name' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth size='small' label='Email' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <Controller
                name='contact'
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth size='small' label='Contact' variant='standard' />
                )}
              />
            </Grid>

            <Grid item sm={12}>
              <ControlledAutocomplete
                control={control}
                name='interestedProgram'
                options={programList}
                renderInput={params => <TextField {...params} label='Interested Qualification' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <Controller
                name='academicYear'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={commonData?.academicYears ?? []}
                    key={field.value}
                    onChange={(e, data) => field.onChange(data)}
                    renderInput={params => <TextField {...params} label='Academic Year' variant='standard' />}
                  />
                )}
              />
            </Grid>

            <Grid item sm={12}>
              <ControlledAutocomplete
                control={control}
                name='studentType'
                options={commonData?.studyType ?? []}
                renderInput={params => <TextField {...params} label='Student Type' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <ControlledAutocomplete
                control={control}
                name='studyMode'
                options={commonData?.studyMode ?? []}
                renderInput={params => <TextField {...params} label='Student Mode' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <ControlledAutocomplete
                control={control}
                name='intakeName'
                options={commonData?.intakeList ?? []}
                renderInput={params => <TextField {...params} label='Intake Name' variant='standard' />}
              />
            </Grid>

            <Grid item sm={12}>
              <ControlledAutocomplete
                control={control}
                name='status'
                options={intakeStatusSelect}
                renderInput={params => <TextField {...params} label='Status' variant='standard' />}
              />
            </Grid>
          </Grid>

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

export default FilterSideBar
