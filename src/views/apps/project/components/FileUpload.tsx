// ** Next Import
import React, { useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import styled from '@emotion/styled'
import { Close, FileExcel } from 'mdi-material-ui'

export const isInvalidFileType = (type: string) => {
  switch (type) {
    case 'image/png':
      return true
    case 'image/jpeg':
      return true
    case 'image/jpg':
      return true
    case 'application/pdf':
      return true
    case 'application/vnd.ms-excel':
      return false
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return false
  }
}

interface IFileUploadProps {
  setSelectedFiles: (file: File & { error?: boolean; typeCode: string }) => void
  removedFiles: (index?: number) => void
}

const FileUploadComponent = ({ setSelectedFiles, removedFiles }: IFileUploadProps) => {
  const [uploadDocs, setUploadDocs] = useState<(File & { error: boolean; typeCode: string }) | null>(null)
  const fileUploadRef = useRef<any>(null)

  const onDocUploadClick = () => {
    const fileElement = fileUploadRef.current?.childNodes[1] as any
    fileElement.click() as any
  }

  const deleteDocs = () => {
    removedFiles()
    setUploadDocs(null)
  }

  const uploadDocuments = (files: any) => {
    files.error = isInvalidFileType(files.type)
    const uploadedFiles = files
    setSelectedFiles(uploadedFiles)
    setUploadDocs(uploadedFiles as any)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      uploadDocuments(files[0]);
    }
  };

  return (
    <>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10
        }}
      >
        <Card sx={{ backgroundColor: theme => theme.palette.customColors.bodyBg, padding: 0 }}>
          <CardContent sx={{ p: 0 }}>
            <Grid sx={{ display: 'flex' }}>
              <div className='d-flex text-center justify-content-center w-100 flex-column '>
                <UploadDocsContainer onClick={onDocUploadClick} className='w-100'   
                   onDragOver={handleDragOver}
                  onDrop={handleDrop}>
                  <div ref={fileUploadRef} className='text-center'>
                    <div>
                      <FileExcel style={{ color: '#008554', fontSize: '60px' }} />
                    </div>
                    <input
                      onChange={e => {
                        if (e?.target) {
                          uploadDocuments(e.target?.files![0])
                        }
                      }}
                      className='d-none'
                      accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                      type='file'
                    />
                    <GreenFormHeading>
                      <Typography variant='h6' style={{ color: 'black', fontWeight: 600 }}>
                        Drag and drop, or <span style={{ color: '#008554' }}>browse</span> your regenesys Bulk upload
                        <em> .XLSX</em> template file
                      </Typography>
                      <Typography variant='caption'>Max size of 3MB</Typography>
                    </GreenFormHeading>
                    {uploadDocs && (
                      <Card onClick={e => e.stopPropagation()}>
                        <CardContent>
                          <Grid container>
                            <Grid item xs={10} sm={10} mb={3}>
                              <Typography textAlign='left' variant='h6'>
                                {uploadDocs?.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} mb={2}>
                              <Typography variant='h6'>
                                <Close
                                  onClick={e => {
                                    e.stopPropagation()
                                    deleteDocs()
                                  }}
                                  style={{ borderRadius: '50%', border: '2px solid red' }}
                                  color='error'
                                />
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </UploadDocsContainer>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default FileUploadComponent

export const MainContainer = styled.div`
  background: #fff;
  width: 100%;
  margin: 1rem 0;
  height: 100%;
`
const UploadDocsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 400px;
  min-height: 150px;
  width: 100%;
  overflow: hidden;
  @media (max-width: 900px) {
    padding: 1rem 4.7rem;
  }
`
export const GreenFormHeading = styled.p`
  font-size: 17px;
  font-weight: 300;
  color: #a8bdce;
  margin: 0;
  @media (max-width: 510px) {
    font-size: 11px;
    img {
      width: 25px;
      height: 25px;
    }
  }
`
