import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Theme,
  Typography,
  Tooltip
} from '@mui/material'
import { FileUpload, CloseCircleOutline } from 'mdi-material-ui'
import { useState } from 'react'
import {
  FileSize,
  OverrideDocumentsData,
  documentStatus,
  messages,
  projectStudentDocumentMessage
} from 'src/context/common'
import { IUpldateDocRow, commonListTypes } from 'src/types/apps/dataTypes'
import Styles from './OverrideDocuments.module.css'
import { useForm } from 'react-hook-form'
import { calculateFileSize, getName } from 'src/utils'

// ** Third Party Library Imports
import { useDropzone } from 'react-dropzone'
import { IUploadDocumentParam } from 'src/types/apps/projectTypes'
import { ReUpload } from 'src/components/icons/ReUpload'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  file: yup.mixed().required(messages.programDocumentFileValidation)
})

interface OverrideDocuments {
  row: IUpldateDocRow
  documentTypeList?: commonListTypes[] | undefined
  reUploadDocument: (param: IUploadDocumentParam, oldFile: IUpldateDocRow) => Promise<void> | undefined
}
const OverrideDocuments = ({ row, reUploadDocument, documentTypeList }: OverrideDocuments) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<OverrideDocumentsData>({
    mode: 'onChange',
    defaultValues: {
      documentTypeCode: row?.documentTypeCode,
      file: null
    },
    resolver: yupResolver(schema)
  })
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.pdf']
    },
    multiple: false,
    maxSize: FileSize.maxSize,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      const isValidType = allowedTypes.some(type => file.type.includes(type))

      if (isValidType) {
        setValue('file', file)
        clearErrors('file')
      } else {
        setError('file', {
          type: 'manual',
          message: projectStudentDocumentMessage['file-invalid-type']
        })
      }
    }
  })
  const onSubmit = (param: any) => {
    reUploadDocument(param, row)
    setOpenModal(!openModal)
  }

  return (
    <Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
        <Tooltip placement='top' arrow title='Re-upload'>
          <IconButton
            size='small'
            disabled={row.status !== documentStatus.pending}
            onClick={() => setOpenModal(!openModal)}
            component='a'
            sx={{ textDecoration: 'none', mr: 0.5 }}
          >
            <ReUpload color={row.status !== documentStatus.pending ? 'inherit' : 'primary'} />
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
          <DialogTitle textAlign='center'>Re-upload Documents</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
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
              <Grid item xs={12}>
                <Grid container {...getRootProps()}>
                  <Box className={Styles.UploadDocsContainer}>
                    <Box className='text-center'>
                      <FileUpload fontSize='large' color='primary' />
                      <input {...register('file')} {...getInputProps()} />
                      <Box className={Styles.GreenFormHeading}>
                        Drag and drop, or <span className={Styles.Text}>browse</span> your files
                      </Box>
                      <Typography
                        variant='body2'
                        gutterBottom
                        sx={{ color: (theme: Theme) => theme.palette.grey[600] }}
                      >
                        Only PNG, JPEG and PDF files with max size of 3MB
                      </Typography>
                      <Box onClick={e => e.stopPropagation()}>
                        {!!watch('file') && (
                          <Box className={Styles.Document}>
                            <Box>
                              <Box textAlign='start'>
                                <Typography variant='body1'>{watch('file')?.name}</Typography>
                                <Typography variant='body2'>
                                  {calculateFileSize(Number(watch('file')?.size))}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <CloseCircleOutline color='error' onClick={() => unregister('file')} />
                            </Box>
                          </Box>
                        )}
                      </Box>
                      {!!errors?.file && (
                        <FormHelperText error sx={{ textAlign: 'center' }}>
                          {errors?.file?.message as string | undefined}
                        </FormHelperText>
                      )}
                      {fileRejections.length > 0
                        ? fileRejections.map(({ errors }) =>
                            errors.map(({ code }) => (
                              <FormHelperText key={code} sx={{ textAlign: 'center' }} error>
                                {projectStudentDocumentMessage[code]}
                              </FormHelperText>
                            ))
                          )
                        : null}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setOpenModal(!openModal)
                reset()
                clearErrors()
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}
export default OverrideDocuments
