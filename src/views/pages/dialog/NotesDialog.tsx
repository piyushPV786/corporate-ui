/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

// ** Third Party Styles Imports
import { IAddNotes } from 'src/context/types'
import { PencilOutline } from 'mdi-material-ui'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import { useForm } from 'react-hook-form'
import { INotes } from 'src/types/apps/invoiceTypes'
import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import RequiredLabel from 'src/components/RequiredLabel'

interface INoteDialogsProps {
  data?: INotes
  title: string
  projectCode?: string | number | undefined
  userName: string
  createNotes?: (arg: IAddNotes) => Promise<void>
  updateNotes?: (arg: { notes: string }, id: string | number | undefined) => Promise<void>
}

const schema = yup.object().shape({
  notes: yup
    .string()
    .required('Note is required')
    .test('words', 'Must be less than 200 words', (val: any) => {
      if (!val || val.trim().length === 0) {
        return new yup.ValidationError('Note cannot be empty or just spaces', null, 'notes')
      }

      const wordCount = val.trim().split(/\s+/).length
      if (wordCount > 200) {
        return new yup.ValidationError('Must be less than 200 words', null, 'notes')
      }

      return true
    })
})

const NoteDialogs = ({ title, data, projectCode, userName, createNotes, updateNotes }: INoteDialogsProps) => {
  const id: number | string = data ? data?.id : ''

  // ** State
  const [show, setShow] = useState<boolean>(false)

  //   const id: number | string = data ? data?.id : ''
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      notes: ''
    },
    resolver: yupResolver(schema)
  })
  const onSubmit = async (data: any) => {
    const apiData = {
      projectCode: projectCode,
      notes: data.notes,
      madeBy: userName
    }
    createNotes && (await createNotes(apiData))
    updateNotes && (await updateNotes({ notes: data.notes }, id))
    setShow(false)
    reset()
  }

  useEffect(() => {
    if (show && data) {
      reset({ notes: data.notes })
    }
  }, [data, show])

  return (
    <>
      <Grid>
        <Box display='flex' justifyContent='flex-end'>
          {data ? (
            <Box>
              {data?.madeBy === userName ? (
                <IconButton
                  onClick={() => setShow(true)}
                  size='small'
                  component='a'
                  color='primary'
                  sx={{ textDecoration: 'none', mr: 2, border: '1px solid green' }}
                >
                  <PencilOutline />
                </IconButton>
              ) : (
                <IconButton
                  disabled={true}
                  size='small'
                  component='a'
                  color='secondary'
                  sx={{ textDecoration: 'none', mr: 2, border: '1px solid grey' }}
                >
                  <PencilOutline />
                </IconButton>
              )}
            </Box>
          ) : (
            <Button size='small' variant='contained' onClick={() => setShow(true)} sx={{ color: 'white' }}>
              <Typography sx={{ color: 'white' }}>Add Notes</Typography>
            </Button>
          )}
        </Box>
        <Dialog
          open={show}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 750, p: [1, 5] } }}
          aria-describedby='user-view-edit-description'
          onClose={(event, reason) => {
            reason != 'backdropClick' && setShow(false)
          }}
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            {title} Notes
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12}>
                  {data ? (
                    <TextField
                      {...register('notes')}
                      fullWidth
                      label={'Notes( 200 Words Max)'}
                      multiline={true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue('notes', e.target.value)
                        clearErrors('notes')
                        trigger('notes')
                      }}
                      defaultValue={data?.notes}
                      error={!!errors?.notes}
                      helperText={errors?.notes && (errors?.notes?.message as string | undefined)}
                    />
                  ) : (
                    <TextField
                      {...register('notes')}
                      fullWidth
                      label={<RequiredLabel label='Notes( 200 Words Max)' />}
                      multiline={true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue('notes', e.target.value)
                        clearErrors('notes')
                        trigger('notes')
                      }}
                      error={!!errors?.notes}
                      helperText={errors?.notes && (errors?.notes?.message as string | undefined)}
                    />
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' sx={{ mr: 1 }}>
                {data ? (
                  <Typography sx={{ color: 'white' }}>Save</Typography>
                ) : (
                  <Typography sx={{ color: 'white' }}>Add Notes</Typography>
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </>
  )
}

export default NoteDialogs
