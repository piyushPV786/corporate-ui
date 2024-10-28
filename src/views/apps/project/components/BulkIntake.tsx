// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Autocomplete, Box, TextField } from '@mui/material'
import { Directions } from 'mdi-material-ui'
import { getSelectedEnrollStudent } from 'src/utils'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DashboardService } from 'src/service'
import { errorToast, successToast } from 'src/components/Toast'
import { messages, status } from 'src/context/common'

const schema = yup.object().shape({
  name: yup.string().required('Group is required')
})

export interface IAssignIntake {
  corporateGroupId: number
  applicationCode: string[]
}

const BulkIntake = ({ selectedRow, studentList, projectCode, getStudent, setSelectedRow }: any) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [group, setGroup] = useState([])
  const [disable, setDisabled] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
    reset()
  }
  const handleClose = () => setOpen(false)

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<any>({
    mode: 'all',
    resolver: yupResolver(schema)
  })

  const selectedStudentList = getSelectedEnrollStudent(selectedRow, studentList)

  const studentCodeList = selectedStudentList?.map(i => i?.applicationCode)
  const assignGroup = async (payload: IAssignIntake) => {
    const response = await DashboardService?.assignCorporateGroup(payload)

    return response
  }

  const getAllGroup = async (projectCode: string) => {
    const response = await DashboardService?.getAllGroupByProgCode(projectCode)
    setGroup(response)
  }

  const handleEnroll = async (data: any) => {
    setDisabled(true)
    const payload = {
      corporateGroupId: Number(data?.name),
      applicationCode: studentCodeList
    }

    const res = await assignGroup(payload)
    if (res?.status === status.successCode) {
      getStudent()
      successToast(messages.assignIntake)
    } else {
      errorToast(messages.error)
    }
    handleClose()
    setSelectedRow([])
    setDisabled(false)
  }

  useEffect(() => {
    projectCode && getAllGroup(projectCode)
  }, [])

  return (
    <Fragment>
      <Box>
        <Button
          sx={{ mr: 2 }}
          variant='contained'
          size='small'
          onClick={handleClickOpen}
          disabled={!selectedRow.length}
          color='primary'
        >
          <Directions sx={{ mr: 1 }} />
          Assign Group
        </Button>
      </Box>
      <Dialog
        fullWidth
        open={open}
        onClose={(event, reason) => {
          reason !== 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
      >
        <form onSubmit={handleSubmit(handleEnroll)}>
          <DialogTitle id='form-dialog-title'>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>Bulk Group Assign</Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText variant='body2' sx={{ mt: 2 }}>
              <Controller
                name='name'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                      newValue && onChange(newValue?.id)
                    }}
                    onBlur={onBlur}
                    options={group}
                    getOptionLabel={option => option.name || ''}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Select Group'
                        helperText={errors.name?.message as string | undefined}
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                )}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={disable}>
              Enroll
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default BulkIntake
