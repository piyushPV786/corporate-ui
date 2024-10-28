// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Grid,
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Backdrop
} from '@mui/material'
import { successToast } from 'src/components/Toast'
import CustomChip from 'src/@core/components/mui/chip'
import DialogTitle from '@mui/material/DialogTitle'
import { StudentService } from 'src/service'
import { AccountBoxMultiple } from 'mdi-material-ui'
import { useForm } from 'react-hook-form'
import { getExemptCourseName } from 'src/utils'
import { IExemptCoursePayloadType } from 'src/context/types'
import { status } from 'src/context/common'
import FallbackSpinner from 'src/@core/components/spinner'

interface propsType {
  Courses: any[]
  applicationCode: string
  edit: boolean
  getStudentDetailById: any
  exemptedCourse: any
}
interface IFormTypes {
  selectCourses: string[]
}
const defaultValues = {
  selectCourses: []
}

const ExemptCourse = ({ Courses, applicationCode, edit, getStudentDetailById, exemptedCourse }: propsType) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { register, watch, setValue } = useForm<IFormTypes>({
    defaultValues
  })

  useEffect(() => {
    if (exemptedCourse && exemptedCourse?.length > 0) {
      const courseCode = exemptedCourse?.map((data: any) => {
        if (data?.course) {
          return data?.course?.code
        }
      })
      setValue('selectCourses', courseCode)
    } else {
      setValue('selectCourses', [])
    }
  }, [])

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmitCourse = async () => {
    setLoading(true)
    const selectedCourses = watch('selectCourses')
    const exemptCourseArray: IExemptCoursePayloadType[] = []
    selectedCourses?.length > 0 &&
      selectedCourses?.map((item: string) =>
        exemptCourseArray.push({
          name: getExemptCourseName(Courses, item),
          code: item
        })
      )
    setOpen(false)
    const payload = {
      exemptCourse: exemptCourseArray,
      applicationCode: applicationCode
    }
    const response = edit
      ? await StudentService.updateExemptCourse(payload, applicationCode)
      : await StudentService.addExemptCourse(payload)

    if (status.successCodeArr.includes(response?.statusCode)) {
      successToast(`Modules Exempted from the Qualification${edit ? ' Updated' : ''} Successfully`)
      getStudentDetailById()
    }
    setLoading(false)
  }

  return (
    <Fragment>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <FallbackSpinner />
      </Backdrop>
      <Button size='small' onClick={handleClickOpen} startIcon={<AccountBoxMultiple />} variant='contained'>
        {edit == true ? 'Edit Exempt Module' : 'Exempt Module'}
      </Button>

      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title' textAlign='center'>
          Exempt Module
        </DialogTitle>
        <form>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id='selectCourses'>Select Modules</InputLabel>
              <Select
                {...register('selectCourses', { required: 'Courses are required' })}
                labelId='selectCourses'
                multiple
                value={watch('selectCourses')}
                label='Select Modules'
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value: any) => (
                      <CustomChip
                        color='error'
                        skin='light'
                        onMouseDown={(event: any) => {
                          event.stopPropagation()
                        }}
                        key={value}
                        label={getExemptCourseName(Courses, value)}
                        onDelete={() =>
                          setValue(
                            'selectCourses',
                            watch('selectCourses').filter((item: string) => item !== value)
                          )
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                {Courses.length > 0 ? (
                  Courses?.map(item => (
                    <MenuItem key={item.id} value={item?.course?.code}>
                      {item?.course?.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>There are no modules added in the qualification</MenuItem>
                )}
              </Select>
            </FormControl>
            {watch('selectCourses').length > 0 && (
              <Grid item xs={12} justifyContent='center' sx={{ display: 'flex', marginTop: 10 }}>
                <Alert severity='warning'>The selected course(s) will be exempt from the student's academics</Alert>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={handleClose} variant='outlined'>
              Cancel
            </Button>
            <Button variant='contained' type='button' onClick={handleSubmitCourse}>
              Exempt Module
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default ExemptCourse
