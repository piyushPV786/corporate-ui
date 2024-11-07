// ** React Imports
import { SetStateAction, useState } from 'react'

// ** MUI Imports
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Theme,
  Typography
} from '@mui/material'

// ** Icon Imports
import { CloseCircleOutline, FileUpload } from 'mdi-material-ui'

// ** Custom Component and Services Imports
import Styles from './DocumentDetails.module.css'
import { IDocumentDialogPropsTypes } from 'src/types/apps/projectTypes'
import { DocumentType, FileSize, documentStatus, messages, projectStudentDocumentMessage } from 'src/context/common'
import { LinearProgressWithLabel, calculateFileSize } from 'src/utils'

// ** Third Party Library Imports
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CommonService } from 'src/service'
import { errorToast } from 'src/components/Toast'
import RequiredLabel from 'src/components/RequiredLabel'

// Define the DocumentType interface
interface DocumentTypes {
  code: string
  name: string
}

const schema = yup.object().shape({
  documentTypeCode: yup.string().required(messages.programDocumentTypeValidation),
  comment: yup.string(),
  file: yup.mixed().required(messages.programDocumentFileValidation)
})

const defaulDocBtnProps = {
  size: 'small',
  variant: 'contained'
}

const DocumentDialog = ({
  uploadDocumentApi,
  documentAdding = false,
  documentTypeList,
  documentBtnProps = defaulDocBtnProps,
  documentBtnTitle = 'Add Document',
  studentData,
  projectCode
}: IDocumentDialogPropsTypes) => {
  // ** State
  const [show, setShow] = useState<boolean>(false)

  const {
    watch,
    reset,
    register,
    setValue,
    unregister,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const isMBAProg = studentData?.application?.education?.programName === 'Master of Business Administration'
  const [documentCode, setDocumentCode] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.pdf']
    },
    multiple: false,
    maxSize:
      watch('documentTypeCode') === documentStatus?.EdForAllContract ||
      watch('documentTypeCode') === documentStatus?.Study_Flexi_Agreement ||
      watch('documentTypeCode') === documentStatus?.Study_Flexi_Calculation
        ? FileSize.maxSize20Mb
        : FileSize.maxSize3Mb,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      const isValidType = allowedTypes.some(type => file.type.includes(type))

      if (isValidType) {
        setValue('file', file)
        uploadOnAWS(file)
        clearErrors('file')
      } else {
        setError('file', {
          type: 'manual',
          message: projectStudentDocumentMessage['file-invalid-type']
        })
      }
    }
  })

  const updateProgress = (percent: SetStateAction<number>) => {
    setUploadProgress(percent)
  }

  const handleDialogClose = () => {
    setShow(false)
    reset()
    setValue('documentTypeCode', '')
    clearErrors()
    setUploadProgress(0)
  }

  const onSubmit = (param: any) => {
    uploadDocumentApi(param, documentCode)
    handleDialogClose()
    setShow(false)
  }

  const filteredDocListArray = documentTypeList?.filter(
    (item: DocumentTypes) =>
      item.name !== 'Interview Notes' && item.name !== 'Motivation Letter' && item.code !== DocumentType.BursaryLetter
  )

  const filteredDocList = documentTypeList?.filter((item: DocumentTypes) => item.code !== DocumentType.BursaryLetter)

  const FilterDocuments = (filteredDocList: DocumentTypes[]) => {
    const calculationDocs = studentData?.document?.filter(
      (doc: { documentTypeCode: string }) => doc.documentTypeCode === 'STUDY-FLEXI-CALCULATION'
    )
    const agreementDocs = studentData?.document?.filter(
      (doc: { documentTypeCode: string }) => doc.documentTypeCode === 'STUDY-FLEXI-AGREEMENT'
    )

    // Check statuses for calculation documents
    const hasApprovedCalculation = calculationDocs?.some((doc: { status: string }) => doc.status === 'SALES_APPROVED')
    const hasPendingCalculation = calculationDocs?.some((doc: { status: string }) => doc.status === 'PENDING')

    // const hasRejectedCalculation = calculationDocs.some((doc: { status: string }) => doc.status === 'SALES_REJECT')

    // Check statuses for agreement documents
    const hasApprovedAgreement = agreementDocs?.some((doc: { status: string }) => doc.status === 'SALES_APPROVED')
    const hasPendingAgreement = agreementDocs?.some((doc: { status: string }) => doc.status === 'PENDING')

    // const hasRejectedAgreement = agreementDocs.some((doc: { status: string }) => doc.status === 'SALES_REJECT')

    const documents = filteredDocList.filter((doc: DocumentTypes) => {
      const isCalculation = doc.code === 'STUDY-FLEXI-CALCULATION'
      const isAgreement = doc.code === 'STUDY-FLEXI-AGREEMENT'

      // Include all other documents
      if (!isCalculation && !isAgreement) {
        return true
      }

      // Logic for STUDY-FLEXI documents
      if (isCalculation) {
        // Only remove STUDY-FLEXI-CALCULATION from the dropdown if it is approved or pending
        return !(hasApprovedCalculation || hasPendingCalculation)
      }
      if (isAgreement) {
        // Only remove STUDY-FLEXI-AGREEMENT from the dropdown if it is approved or pending
        return !(hasApprovedAgreement || hasPendingAgreement)
      }

      return true // Include by default
    })

    return documents
  }

  const uploadOnAWS = async (file: File) => {
    const ext = file?.name && file?.name?.split('.')?.pop()?.toLowerCase()
    const setUploadPercent = (progressEvent: { loaded: number; total: number }) => {
      const uploadPercent = Math.ceil((progressEvent.loaded / progressEvent.total) * 100)
      updateProgress(uploadPercent)
    }

    const documentCode = await CommonService?.DocumentCode()
    setDocumentCode(documentCode)
    const name = `${documentCode}.${ext}`
    const awsResponse = await CommonService?.documentUpload({
      filename: name,
      filetype: `.${ext}`,
      file: file,
      studentCode: studentData?.application?.lead?.studentCode || projectCode,
      setUploadPercent: setUploadPercent
    })
    if (awsResponse) {
      return
    } else {
      errorToast(messages?.awsFileNotUploadMessage)
    }
  }

  const onRemoveFile = () => {
    unregister('file')
    setUploadProgress(0)
  }

  const getError = (code: string) => {
    console.log('code', code)
    if (
      code === 'file-invalid-type' &&
      (watch('documentTypeCode') === documentStatus?.EdForAllContract ||
        watch('documentTypeCode') === documentStatus?.Study_Flexi_Agreement ||
        watch('documentTypeCode') === documentStatus?.Study_Flexi_Calculation)
    ) {
      return <Typography variant='body2' color='error'>{`${projectStudentDocumentMessage[code]}`}</Typography>
    } else if (
      watch('documentTypeCode') === documentStatus?.EdForAllContract ||
      watch('documentTypeCode') === documentStatus?.Study_Flexi_Agreement ||
      watch('documentTypeCode') === documentStatus?.Study_Flexi_Calculation
    ) {
      return 'File is larger than 20 MB'
    } else {
      return projectStudentDocumentMessage[code]
    }
  }

  return (
    <Box>
      <Button {...documentBtnProps} onClick={() => setShow(true)}>
        {documentAdding ? 'Adding File...' : documentBtnTitle}
      </Button>

      <Dialog
        open={show}
        fullWidth
        onClose={(event, reason) => {
          reason != 'backdropClick' && handleDialogClose()
        }}
      >
        <DialogTitle textAlign='center'>Add Document</DialogTitle>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={6} md={6}>
                <FormControl fullWidth error={!!errors?.documentTypeCode}>
                  <Autocomplete
                    fullWidth
                    {...register('documentTypeCode')}
                    style={{ width: '100%' }}
                    options={isMBAProg ? FilterDocuments(filteredDocListArray) : FilterDocuments(filteredDocList)}
                    onChange={(_, value: DocumentTypes | null) => {
                      if (value) {
                        setValue('documentTypeCode', value.code)
                        clearErrors('documentTypeCode')
                      } else {
                        setValue('documentTypeCode', '')
                      }
                    }}
                    getOptionLabel={(option: DocumentTypes) => option?.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={<RequiredLabel label='Document Type' />}
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />

                  {!!errors?.documentTypeCode && (
                    <FormHelperText error>{errors?.documentTypeCode?.message as string | undefined}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {watch('documentTypeCode') && (
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
                          {`Only PNG, JPEG and PDF files with max size of  ${
                            watch('documentTypeCode') === documentStatus?.EdForAllContract ||
                            watch('documentTypeCode') === documentStatus?.Study_Flexi_Agreement ||
                            watch('documentTypeCode') === documentStatus?.Study_Flexi_Calculation
                              ? '20MB'
                              : '3MB'
                          }`}
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
                                <CloseCircleOutline
                                  color='error'
                                  onClick={() => {
                                    onRemoveFile()
                                  }}
                                />
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
                                  {getError(code)}
                                </FormHelperText>
                              ))
                            )
                          : null}
                        {!!uploadProgress && watch('file') && <LinearProgressWithLabel value={uploadProgress} />}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={() => handleDialogClose()}>
              CANCEL
            </Button>
            <Button type='submit' variant='contained' disabled={uploadProgress !== 100}>
              UPLOAD
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default DocumentDialog
