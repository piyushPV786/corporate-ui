import { useState } from 'react'
import { CommonService, DocumentService } from 'src/service/'
import { status } from 'src/context/common'
import { successToast } from 'src/components/Toast'

const UploadDocuments = (studentData: any) => {
  const studentCode = studentData?.application?.lead?.studentCode
  const applicationCode = studentData?.application?.applicationCode
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadDocumentStatus, setUploadDocumentStatus] = useState<number>(0)
  const [documentCode, setDocumentCode] = useState<string>('')

  const updateProgress = (percent: number) => {
    setUploadProgress(percent)
  }

  const uploadDocument = async (file: any, documentTypeCode: string) => {
    const setUploadPercent = (progressEvent: any) => {
      const uploadPercent = Math?.ceil((progressEvent.loaded / progressEvent.total) * 100)
      updateProgress(uploadPercent)
    }

    if (file && studentCode) {
      const fileName = file?.name
      const ext = fileName?.split('.').pop()
      const documentCode = await CommonService?.DocumentCode()
      setDocumentCode(documentCode)
      const name = `${documentCode}.${ext}`
      const signedUrl = await CommonService?.getFileSignUrl(name, `.${ext}`, studentCode)
      const response = await CommonService?.uploadDocumentToAws(signedUrl, file, setUploadPercent)
      response && setUploadDocumentStatus(response?.status)
      if (response?.status === status?.successCode) {
        const documentUpdatePayload = {
          name: name,
          fileExtension: `.${ext}`,
          status: 'PENDING',
          documentTypeCode: documentTypeCode,
          applicationCode: applicationCode,
          code: documentCode
        }
        const updateDocumentResponse = await DocumentService?.documentUpdate(documentUpdatePayload)
        if (updateDocumentResponse?.status === 200) {
          successToast(`Your document is uploaded successfully.`)
        }
      }
    }
  }

  return { uploadDocument, uploadProgress, setUploadProgress, uploadDocumentStatus, documentCode }
}

export default UploadDocuments
