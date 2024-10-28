// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// ** Third Party Styles Imports
import Styles from './DocumentUpload.module.css'

import { CloseCircleOutline, FileUpload } from 'mdi-material-ui'
import DialogTitle from '@mui/material/DialogTitle'
import { Dialog, DialogActions, DialogContent, FormHelperText, TextField, Theme, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { FileDocumentOutline } from 'mdi-material-ui'
import { FileSize, messages, projectStudentDocumentMessage } from 'src/context/common'
import { useForm } from 'react-hook-form'
import { CommonService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { calculateFileSize } from 'src/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ControlledAutocomplete from 'src/components/ControlledAutocomplete'

const schema = yup.object().shape({
  documentTypeCode: yup.string().required(messages.programDocumentTypeValidation),
  comment: yup.string(),
  file: yup.mixed().required(messages.programDocumentFileValidation)
})

interface IDocumentDialoge {
  addAllProjectStudentDocumentApi: (param: IUploadDocumentParam) => void
}

interface IUploadDocumentParam {
  file: File
  documentTypeCode: string
  comment: string
}

const DocumentDialog = ({ addAllProjectStudentDocumentApi }: IDocumentDialoge) => {
  // ** State
  const [show, setShow] = useState<boolean>(false)

  const [documentTypeList, setDocumentTypeList] = useState<Array<commonListTypes>>([])

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    unregister,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.pdf']
    },
    multiple: false,
    maxSize: FileSize.maxSize,
    onDrop: acceptedFiles => (setValue('file', acceptedFiles[0]), clearErrors('file'))
  })
  const onSubmit = (param: any) => {
    const payload = {
      ...param,
      name: param.file.name,
      fileExtension: param.file.type
    }
    addAllProjectStudentDocumentApi(payload)
    setShow(false)
    reset()
  }

  const handleDialogClose = () => {
    setShow(false)
    reset()
  }

  const getDocumentTypeList = async () => {
    const response = await CommonService.getProjectDocumentTypeList()
    if (response) {
      setDocumentTypeList(response.data)
    }
  }

  useEffect(() => {
    getDocumentTypeList()
  }, [])

  return (
    <>
      <Grid>
        <Box display='flex' justifyContent='flex-end'>
          <Button
            size='small'
            variant='contained'
            startIcon={<FileDocumentOutline />}
            onClick={() => setShow(true)}
            sx={{ color: 'white' }}
          >
            <Typography sx={{ color: 'white' }}>Upload</Typography>
          </Button>
        </Box>
        <Dialog
          open={show}
          onClose={(event, reason) => {
            reason != 'backdropClick' && handleDialogClose()
          }}
          fullWidth
        >
          <DialogTitle textAlign='center'>Add Document</DialogTitle>
          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <ControlledAutocomplete
                    control={control}
                    name='documentTypeCode'
                    options={documentTypeList}
                    renderInput={params => <TextField {...params} label='Document Type' />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('comment')}
                    fullWidth
                    label='Comments (optional)'
                    error={!!errors?.comments}
                    helperText={errors?.comments?.message as string | undefined}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container {...getRootProps()}>
                    <Box width='100%' className={Styles.UploadDocsContainer}>
                      <Box width='100%' className='text-center'>
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
                        <Box width='100%' onClick={e => e.stopPropagation()}>
                          {!!watch('file') && (
                            <Box className={Styles.Document}>
                              <Box>
                                <Box textAlign='start'>
                                  <Typography variant='body1'>{watch('file')?.name}</Typography>
                                  <Typography variant='body2'>{calculateFileSize(watch('file')?.size)}</Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CloseCircleOutline color='error' onClick={() => unregister('file')} />
                              </Box>
                            </Box>
                          )}
                        </Box>
                        {!!errors?.file && (
                          <FormHelperText error>{errors?.file?.message as string | undefined}</FormHelperText>
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
              <Button variant='outlined' color='secondary' onClick={handleDialogClose}>
                CANCEL
              </Button>
              <Button type='submit' variant='contained'>
                UPLOAD
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Grid>
    </>
  )
}

export default DocumentDialog
