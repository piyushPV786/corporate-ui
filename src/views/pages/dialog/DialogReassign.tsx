// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import { ArrowRightTop } from 'mdi-material-ui'
import { ProgramNameField } from 'src/styles/style'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'
import { FieldValues, useForm } from 'react-hook-form'
import { DashboardService } from 'src/service'
import { getSelectedEnrollStudent } from 'src/utils'
import { errorToast, successToast } from 'src/components/Toast'
import { messages } from 'src/context/common'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IAgentsType, IReassignPayloadTypes } from 'src/context/types'
import { GridRowId } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'

interface DialogProps {
  selectedRows: GridRowId[]
  response: InvoiceType[]
  agentList: Array<IAgentsType>
  getCallBack: () => void
}

const schema = yup.object().shape({
  agent: yup.string().required()
})

const DialogReassign = (props: DialogProps) => {
  const { selectedRows, response, agentList, getCallBack } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [selectedStudents, setSelectedStudents] = useState<IDynamicObject[]>([])
  const handleClickOpen = () => {
    setOpen(true)
    const selectedData = getSelectedEnrollStudent(selectedRows, response)
    setSelectedStudents(selectedData)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({ resolver: yupResolver(schema) })

  const reassignStudent = async (payload: IReassignPayloadTypes) => {
    const result = await DashboardService.editReassignStudent(payload)
    if (result) {
      successToast(`${payload.applicationCode.join(', ')} reassigned successfully.`)
      handleClose()
      getCallBack()
    } else {
      errorToast(messages.error)
    }
  }

  const onSubmit = (data: FieldValues) => {
    reset({}, { keepValues: true })
    const payload = {
      applicationCode: selectedStudents?.map(item => item?.applicationCode),
      agentCode: data.agent
    }
    reassignStudent(payload)
  }

  return (
    <Fragment>
      <Box>
        <Button
          size='small'
          onClick={handleClickOpen}
          disabled={!selectedRows.length}
          variant='contained'
          color='primary'
        >
          <ArrowRightTop sx={{ mr: 1 }} />
          Reassign
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title' sx={{ display: 'flex', justifyContent: 'center' }}>
          Reassign Application
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <ProgramNameField container spacing={7} mb={8} ml={0} mt={8} pb={8}>
              <Grid item xs={4} display='grid' justifyContent='center'>
                <label>Selected Application</label>
                <Typography color={theme => theme.palette.common.white}>
                  {selectedStudents?.map(item => item.applicationCode)?.join(', ')}
                </Typography>
              </Grid>
            </ProgramNameField>
            <FormControl fullWidth error={!!errors.agent}>
              <ControlledAutocomplete
                name='agent'
                control={control}
                options={agentList}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Select Agent'
                    error={!!errors.agent}
                    helperText={errors?.agent?.message as string | undefined}
                  />
                )}
              />
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={!isDirty}>
              Reassign
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default DialogReassign
