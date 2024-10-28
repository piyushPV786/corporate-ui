// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'

// ** Custom Components and Services
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

// ** Third Party Library
import { FieldValues, useForm } from 'react-hook-form'
import { ProgramNameField } from 'src/styles/style'
import { ISSACommonListTypes } from 'src/views/apps/ssa/sssConstants'

interface IAssignSSADialogProps {
  assignSSA: (ssaName: string) => void
  selectedRows?: GridRowId[]
  commonList: ISSACommonListTypes
}

const AssignSSADialog = ({ assignSSA, selectedRows, commonList }: IAssignSSADialogProps) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => {
    reset({ SsaCode: '' })
    setOpen(true)
  }
  const handleClose = () => {
    reset({ SsaCode: '' })
    setOpen(false)
  }
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm()

  const handleEnroll = (data: FieldValues) => {
    reset({}, { keepDefaultValues: true })
    assignSSA(data.SsaCode)
    handleClose()
  }

  return (
    <Fragment>
      <Box>
        <Tooltip title={selectedRows?.length ? 'Assign Student Support Administration' : 'Select at least one student'}>
          <Box>
            <Button
              variant='contained'
              size='small'
              disabled={!selectedRows?.length}
              onClick={handleOpen}
              color='primary'
            >
              Assign SSA
            </Button>
          </Box>
        </Tooltip>
      </Box>
      <Dialog
        maxWidth='xs'
        open={open}
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleClose()
        }}
      >
        <form onSubmit={handleSubmit(handleEnroll)}>
          <DialogTitle textAlign='center'>Assign SSA</DialogTitle>
          <DialogContent>
            <Grid container rowGap={5}>
              <ProgramNameField item xs={12} p={5}>
                <Typography color='common.white'>No of Student Selected</Typography>
                <Typography variant='h6' color='common.white'>
                  <strong>{selectedRows?.length}</strong>
                </Typography>
              </ProgramNameField>
              <Grid item xs={12}>
                <ControlledAutocomplete
                  name='SsaCode'
                  control={control}
                  options={commonList?.ssaList}
                  rules={{
                    required: 'Please Select SSA Person'
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Select Student Support Person'
                      error={!!errors?.SsaCode}
                      helperText={errors?.SsaCode?.message as string | undefined}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' type='submit' disabled={!isDirty || !!errors?.SsaCode}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default AssignSSADialog
