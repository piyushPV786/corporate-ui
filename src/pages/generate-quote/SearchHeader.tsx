// ** MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Card, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { userInformationStatus } from 'src/context/common'
import { DashboardService } from 'src/service'
import { messages, status } from 'src/context/common'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { errorToast } from 'src/components/Toast'
import { Magnify } from 'mdi-material-ui'

interface SearchHeaderProps {
  value: string
  onSubmit: (data: any) => void
  onReset: React.Dispatch<React.SetStateAction<boolean>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setFormData: any
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSubmit, onReset, setLoading, setFormData }) => {
  const schema = yup.object().shape({
    searchParam: yup.string().required(userInformationStatus.searchParam)
  })

  const { register, handleSubmit, control, reset, setValue } = useForm<any>({
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const onSearchStudent = async (data: FieldValues, event: any) => {
    event.preventDefault()
    setLoading(true)
    reset(data, { keepValues: true })
    const result = await DashboardService.getStudentDataByCode(data?.searchParam)
    if (result?.status === status.successCode) {
      if (result?.data?.data) {
        onSubmit(result?.data?.data)
        reset()
      } else {
        errorToast(messages.nullData)
        onReset(true)
      }
    } else {
      errorToast(messages.error)
      onReset(true)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    onReset(true)
    reset({ keepValues: false })
    setFormData(null)
  }

  return (
    <Card sx={{ p: 4 }}>
      <form onSubmit={handleSubmit(onSearchStudent)}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography sx={{ mr: 2, maxWidth: '280px', fontSize: '12px', color: 'text.primary' }}>
              Search and pull the student details & choose the appropriate values to generate a Quote
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Controller
              {...register('searchParam')}
              name='searchParam'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder='Search by Reggie Number / National ID / E-Mail /Contact Number'
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState?.error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start' sx={{ color: 'green' }}>
                        <Magnify />
                      </InputAdornment>
                    )
                  }}
                  onBlur={event => setValue('searchParam', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size='small'
                  sx={{ mr: 2, maxWidth: '500px', fontSize: '5px' }}
                />
              )}
            />
          </Grid>
          <Grid container item xs={3}>
            <Grid item sx={{ ml: 4 }}>
              <Button
                variant='contained'
                type='submit'
                sx={{
                  mr: 1,
                  fontSize: 12, // Increase font size
                  padding: '9px 10px !important' // Increase padding
                }}
                size='small'
              >
                Search
              </Button>
              <Button
                variant='outlined'
                type='button'
                onClick={handleCancel}
                sx={{
                  fontSize: 12, // Increase font size
                  padding: '9px 10px !important' // Increase padding
                }}
                size='small'
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Card>
  )
}

export default SearchHeader
