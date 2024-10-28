// ** MUI Imports
import { Autocomplete, Button, Grid, TextField } from '@mui/material'

// ** Custom Components and Services
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { ISSACommonListTypes, errorMessage } from 'src/views/apps/ssa/sssConstants'

// ** Third Party Library
import * as yup from 'yup'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ISSAQueryParamTypes } from 'src/pages/Student-Support-Administrative/list'
import { pickBy } from 'lodash'

interface ISSASearchFormTypes {
  commonList: ISSACommonListTypes
  handleSearchQuery: (data: ISSAQueryParamTypes | undefined) => void
}
const schema = yup.object().shape({
  intakeAcademicYear: yup.string().required(errorMessage.academic),
  programCode: yup.string().required(errorMessage.program)
})
const formDefaultValues = {
  intakeAcademicYear: '',
  programCode: ''
}

const SSASearchForm = ({ commonList, handleSearchQuery }: ISSASearchFormTypes) => {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FieldValues>({
    resolver: yupResolver(schema)
  })
  const onSubmit = (data: ISSAQueryParamTypes) => {
    reset({}, { keepValues: true })
    handleSearchQuery(pickBy(data))
  }
  const resetForm = () => {
    reset(formDefaultValues)
    handleSearchQuery(undefined)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container px={5} py={8} gap={4} alignItems='center'>
        <Grid item xs={3}>
          <Controller
            name='intakeAcademicYear'
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                key={field.value}
                options={commonList.academicYear}
                onChange={(event, data) => field.onChange(data)}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Academic Year'
                    error={!!errors?.intakeAcademicYear}
                    helperText={errors?.intakeAcademicYear?.message as string | undefined}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={8}>
          <ControlledAutocomplete
            name='programCode'
            control={control}
            options={commonList.programs}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                label='Program Name'
                error={!!errors?.programCode}
                helperText={errors?.programCode?.message as string | undefined}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} mt={5}>
          <Grid container gap={3} justifyContent='center'>
            <Grid item>
              <Button type='reset' variant='outlined' onClick={resetForm}>
                Clear Search
              </Button>
            </Grid>
            <Grid item>
              <Button type='submit' variant='contained' disabled={!isDirty || !!Object.values(errors).length}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default SSASearchForm
