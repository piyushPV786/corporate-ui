import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { FileDocumentEdit } from 'mdi-material-ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { successToast } from 'src/components/Toast'
import { messages } from 'src/context/common'
import { IChangeFileRow, IFileTypePayload, commonListTypes } from 'src/types/apps/dataTypes'
import { checkDocumentType, getName } from 'src/utils'
import Styles from './OverrideDocuments.module.css'

interface IChangeFileType {
  row: IChangeFileRow
  documentTypeList?: commonListTypes[] | undefined
  updateDocumentFileType?: (params: IFileTypePayload, documentTypeCode: string) => Promise<void> | undefined
}

const ChangeFileType = ({ row, updateDocumentFileType, documentTypeList }: IChangeFileType) => {
  const [openModal, setOpenModal] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      documentTypeCode: row?.documentTypeCode
    }
  })

  const onSubmit = (param: IFileTypePayload) => {
    const payload = {
      documentTypeCode: param?.documentTypeCode
    }
    updateDocumentFileType && updateDocumentFileType(payload, row?.code)
    setOpenModal(!openModal)
    successToast(messages.FileTypeMessage)
  }

  return (
    <Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
        <Tooltip placement='top' arrow title='Change File Type'>
          <IconButton
            size='small'
            component='a'
            sx={{ textDecoration: 'none', mr: 0.5 }}
            disabled={checkDocumentType(row.documentTypeCode)}
            onClick={() => setOpenModal(!openModal)}
          >
            <FileDocumentEdit color={checkDocumentType(row.documentTypeCode) ? 'inherit' : 'primary'} />
          </IconButton>
        </Tooltip>
      </Box>
      <Dialog
        fullWidth
        open={openModal!}
        maxWidth='sm'
        scroll='body'
        onClose={(event, reason) => {
          reason != 'backdropClick' && setOpenModal(!openModal)
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle textAlign='center'>Change File Type</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Grid container className={Styles.overrideContainer} p={3} py={5}>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      File Name
                    </Typography>
                    <Typography color='white' variant='subtitle2' pt={2}>
                      {row.name}
                    </Typography>
                  </Grid>
                  <Grid item sm={6} xs={12} p={2}>
                    <Typography variant='body2' color='common.white'>
                      Current File Type
                    </Typography>
                    <Typography color='white' variant='subtitle2' pt={2}>
                      {getName(documentTypeList, row?.documentTypeCode)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ mb: 3, lineHeight: '2rem', pt: 10 }}>
                <Autocomplete
                  fullWidth
                  {...register('documentTypeCode', { required: 'FileType is required' })}
                  options={documentTypeList as any}
                  getOptionLabel={option => option.name}
                  defaultValue={documentTypeList?.find((i: any) => i.code == watch('documentTypeCode'))}
                  onChange={(_, value) => setValue('documentTypeCode', value?.code)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select File Type'
                      error={errors.documentTypeCode as boolean | undefined}
                    />
                  )}
                />

                {errors.documentTypeCode && errors.documentTypeCode && (
                  <FormHelperText sx={{ color: 'red' }}>
                    {errors.documentTypeCode?.message as string | undefined}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setOpenModal(!openModal)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 3 }} type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default ChangeFileType
