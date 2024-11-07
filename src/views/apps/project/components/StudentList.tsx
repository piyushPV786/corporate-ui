import { DataGrid, GridSelectionModel } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import Tooltip from '@mui/material/Tooltip'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import FileUploadComponent from './FileUpload'
import { FileDownloadOutline, PencilOutline, SchoolOutline } from 'mdi-material-ui'
import { DashboardService } from 'src/service'
import {
  status,
  Download,
  FileName,
  intakeStatue,
  studentApplicationAllStatus,
  applicationStatusColor
} from 'src/context/common'
import { errorToast, successToast } from 'src/components/Toast'
import { IStudent } from '../Preview'
import * as XLSX from 'xlsx'
import Link from 'next/link'
import { projectStudentType } from 'src/types/apps/invoiceTypes'
import { DataParams } from 'src/service/Dashboard'
import { formatDate, removeDuplicates, serialNumber } from 'src/utils'
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { TypographyEllipsis } from 'src/styles/style'
import { ModuleFeaturePermission } from 'src/components/common'
import { FeatureCodes, moduleKeys, PermissionsCodes } from 'src/components/common/featureData'
import BulkIntake from './BulkIntake'

interface IStudentProps {
  projectCode: string
  projectName: string
}

interface CellType {
  row: projectStudentType
}

interface IKeysObject {
  [key: string]: any
}
interface IMissingDataTypes {
  column: (string | number)[]
  row: (string | number)[]
}

function transformKeys(keysArray: string[] | IKeysObject[]): any[] {
  if (Array.isArray(keysArray) && typeof keysArray[0] === 'string') {
    return (keysArray as string[]).map(key => key.toLowerCase().replace(/[\s,_-]/g, ''))
  } else if (Array.isArray(keysArray) && typeof keysArray[0] === 'object') {
    return (keysArray as IKeysObject[]).map(obj => {
      const newObj: IKeysObject = {}
      for (const key in obj) {
        newObj[key.toLowerCase().replace(/[\s,_-]/g, '')] = obj[key]
      }

      return newObj
    })
  } else {
    throw new Error('Invalid input: must be an array of strings or an array of objects')
  }
}

const columnName: IDynamicObject = {
  firstname: 'First Name',
  lastname: 'Last Name',
  emailid: 'Email Id',
  mobilecountrycode: 'Mobile Country Code',
  mobilenumber: 'Mobile Number',
  gender: 'Gender',
  dob: 'Date of Birth',
  homelanguage: 'Homelanguage',
  race: 'Race',
  nationalitystatus: 'Nationality Status',
  nationality: 'Nationality',
  identificationdocumenttype: 'Identification Document Type',
  identificationnumber: 'Identification Number',
  address: 'Address',
  country: 'Country',
  state: 'State',
  city: 'City',
  pincode: 'Pin Code',
  highestqualification: 'Highest Qualification'
}

const checkColumnExist = (keys: string[], data: any[]): IMissingDataTypes => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data.filter(({ medicalissueifany, middlename, homephone, whatsappnumber, alternativenumber, ...rest }) => ({
    ...rest
  }))
  const missingColumn: Array<string> = []
  const missingRow: Array<number> = []

  data.map((item, index) =>
    keys.map(key => (!item[key] ? (missingColumn.push(columnName[key]), missingRow.push(index + 2)) : null))
  )

  return { column: removeDuplicates(missingColumn), row: removeDuplicates(missingRow) }
}

const validateExcelColumns = (data: any) => {
  const result = checkColumnExist(Object.keys(columnName), transformKeys(data))

  return result
}

interface CustomFileType extends File {
  error?: boolean
  valid?: boolean
  typeCode: string
}
const StudentList = ({ projectCode, projectName }: IStudentProps) => {
  const [openFileUpload, setOpenFileUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [projectStudentListData, setProjectStudentListData] = useState<IStudent>()
  const [studentList, setStudentList] = useState<Array<any>>()
  const [uploadedFile, setUploadedFile] = useState<CustomFileType | null>()
  const [missingData, setMissingData] = useState<IMissingDataTypes | null>()
  const [selectedRow, setSelectedRow] = useState<GridSelectionModel>([])
  const fullPermission = ModuleFeaturePermission(
    FeatureCodes.EMS.projectManagement,
    PermissionsCodes.full,
    moduleKeys.sales
  )
  const getStudentList = async (projectCode: string | number, param: DataParams) => {
    setIsLoading(true)
    const response = await DashboardService?.getProjectStudentList(projectCode, param)
    if (response?.status === status.successCode && response?.data?.data) {
      setProjectStudentListData(response?.data?.data)
    }
    setIsLoading(false)
  }
  const downloadStudent = async (projectCode: string) => {
    setIsLoading(true)

    const param = {
      pageNumber: 1,
      pageSize: projectStudentListData?.count
    }

    try {
      const response = await DashboardService?.getProjectStudentList(projectCode, param)

      if (response?.status === status.successCode && response?.data?.data) {
        const students = response.data.data.data

        const extractedStudentData = students.map((student: any) => {
          const lead = student.lead || {}

          return {
            'First Name': lead.firstName || '',
            'Middle Name': lead.middleName || '',
            'Last Name': lead.lastName || '',
            Email: lead.email || '',
            'Mobile Country Code': lead.mobileCountryCode || '',
            'Mobile Number': lead.mobileNumber || '',
            Regno: lead.studentCode || '',
            'Application Code': student.applicationCode || '',
            Gender: lead.gender || '',
            'Date Of Birth': lead.dateOfBirth ? formatDate(lead.dateOfBirth) : '',
            'Home Language': lead.language || '',
            Race: lead.race || '',
            Nationality: lead.nationality || '',
            'Identification Document Type': lead.identificationDocumentType || '',
            'Identification Number': lead.identificationNumber || '',
            country: lead.country || '',
            city: lead.city || '',
            'Highest Qualification': lead.highestQualification || '',
            'Enrolment Date': student?.enrolment?.enrolmentDate ? formatDate(student.enrolment.enrolmentDate) : '',
            Status: student.status || ''
          }
        })

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(extractedStudentData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
        XLSX.writeFile(workbook, `${projectName}_students_data.xlsx`)

        handleSuccess(Download.List)
      }
    } catch (error) {
      console.error('Error downloading student data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplates = async (file: string) => {
    const response = await DashboardService.downloadStudentTemplate(file)
    downloadStudentDetails(response?.data, Download.Template)
  }

  const bulkUploadStudent = async (projectCode: string, file: File) => {
    setIsLoading(true)

    //this demo api only for fileName once api ready this will remove
    const response = await DashboardService.uploadBulkStudent(projectCode, file)
    if (response?.data?.statusCode === status.successCodeOne && response?.data?.data) {
      const existingStudents: string[] = []

      response.data.data.flat().forEach((student: any) => {
        if (student.applicationExist) {
          existingStudents.push(student.applicationExist)
        }
      })

      if (existingStudents.length > 0) {
        const mobileNumbers: string[] = []
        const emails: string[] = []

        existingStudents.forEach(student => {
          const mobileMatch = student.match(/mobileNumber (\d+)/)
          const emailMatch = student.match(/email (\S+@\S+\.\S+)/)

          if (mobileMatch) {
            mobileNumbers.push(mobileMatch[1])
          } else if (emailMatch) {
            emails.push(emailMatch[1])
          }
        })

        const combinedStudents = [...mobileNumbers, ...emails]
        const maxDisplayCount = 10

        const studentsToShow =
          combinedStudents.length > maxDisplayCount
            ? [...combinedStudents.slice(0, maxDisplayCount), '...']
            : combinedStudents

        errorToast(`${existingStudents.length} students already exist: ${studentsToShow.join(', ')}`)
      } else {
        successToast('File Uploaded Successfully')
      }

      setUploadedFile(null)
    }
    setIsLoading(true)
  }

  const downloadStudentDetails = async (fileName: string, msg: string) => {
    const blobFile = new Blob([fileName], { type: 'application/xlsx' })
    const url = window.URL.createObjectURL(blobFile)
    const a = document.createElement('a')
    a.href = url
    a.download = msg === Download.Template ? FileName.Template : FileName.List
    a.click()
    window.URL.revokeObjectURL(url)
    setTimeout(handleSuccess, 3000, msg)
  }

  const handleSuccess = (msg: string) => {
    successToast(msg)
  }

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 60,
      headerName: '#',
      renderCell: (row: IDynamicObject) => serialNumber(row.api.getRowIndex(row.row.id), pageNumber, pageSize)
    },
    {
      flex: 0.1,
      minWidth: 125,
      field: 'regNo',
      headerName: 'Reg No',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Typography style={{ fontWeight: 'bold' }} variant='body1'>
            {row?.lead?.studentCode ?? '-'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 150,
      headerName: 'Name',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography style={{ fontWeight: 'bold' }} variant='body1'>
              {row?.lead?.firstName ? `${row?.lead?.firstName} ${row?.lead?.lastName}` : ''}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 180,
      field: 'contact',
      headerName: 'Email & Contact Details',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <Tooltip title={row?.lead?.email ?? ''}>
              <TypographyEllipsis variant='body1'>{row?.lead?.email ?? ''}</TypographyEllipsis>
            </Tooltip>
            <Tooltip title={row?.lead?.mobileNumber ?? ''}>
              <TypographyEllipsis variant='body2'>
                {row?.lead?.mobileCountryCode ? `+${row?.lead?.mobileCountryCode}` : ''} {row?.lead?.mobileNumber ?? ''}
              </TypographyEllipsis>
            </Tooltip>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 160,
      field: 'idNo',
      headerName: 'National ID',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Typography style={{ fontWeight: 'bold' }} variant='body1'>
            {row?.lead?.identificationNumber ?? '-'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'groups',
      headerName: 'Group Details',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title='Group Name'>
              <Typography
                variant='body2'
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
              >
                {row?.enrolment?.corporateGroup?.name || '-'}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    },
    {
      flex: 1,
      minWidth: 230,
      field: 'projectName',
      headerName: 'Project Name / Code',
      renderCell: ({ row }: any) => {
        const { project } = row

        return (
          <Grid container>
            <Grid item xs={12}>
              <Typography noWrap variant='body1'>
                {project?.name ? project.name : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography noWrap variant='caption'>
                {project?.code ? project.code : '-'}
              </Typography>
            </Grid>
          </Grid>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Box>
              <CustomChip
                skin='light'
                size='small'
                label={!!studentApplicationAllStatus[row.status] ? studentApplicationAllStatus[row.status] : row.status}
                color={applicationStatusColor[row.status]}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '5px',
                  textTransform: 'capitalize'
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {row?.status === 'Draft' ? (
              <Tooltip title='Edit'>
                <Box>
                  <Link href={`/project/preview/${projectCode}/add-student?studentId=${row.applicationCode}`} passHref>
                    <IconButton
                      size='small'
                      component='a'
                      color='primary'
                      sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
                    >
                      <PencilOutline />
                    </IconButton>
                  </Link>
                </Box>
              </Tooltip>
            ) : (
              <Tooltip title='View'>
                <Box textAlign='center'>
                  <Link href={`/project/${projectCode}/student/${row.applicationCode}`} passHref>
                    <IconButton
                      size='small'
                      component='a'
                      color='primary'
                      sx={{ textDecoration: 'none', mr: 0.5, border: '1px solid green' }}
                    >
                      <SchoolOutline />
                    </IconButton>
                  </Link>
                </Box>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]
  const validateExcelForBulkUpload = (excelFile: File & any) => {
    if (excelFile) {
      const reader = new FileReader()

      reader.onload = function (event) {
        const data = event.target?.result

        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

          if (json.length === 0) {
            setMissingData(null)
          } else if (json.length > 0) {
            const isValid = validateExcelColumns(json)
            setMissingData(isValid)
          }
        }
      }
      reader.readAsBinaryString(excelFile)

      return excelFile
    }
  }

  const setSelectedFiles = async (file: File & { error?: boolean; typeCode: string }) => {
    const result = await validateExcelForBulkUpload(file)
    if (result) {
      setUploadedFile(result)
    }
  }
  const uploadBulkDocument = () => {
    bulkUploadStudent(projectCode, uploadedFile!)
    setOpenFileUpload(false)
    setTimeout(() => {
      getStudentList(projectCode, { pageNumber: 1, pageSize: 10 })
    }, 2000)
  }
  const handleCloseBulkUpload = () => {
    setOpenFileUpload(!openFileUpload)
    setUploadedFile(null)
    setMissingData(null)
  }
  const tableData = () => {
    setIsLoading(true)
    const filteredList = projectStudentListData?.data?.map(({ firstName, lastName, email, contactNumber, ...rest }) => {
      return {
        name: `${firstName ?? ''} ${lastName ?? ''}`,
        contact: { email: email ?? '', contactNumber: contactNumber ?? '' },
        ...rest
      }
    })
    setStudentList(filteredList)
    setIsLoading(false)
  }
  const getStudent = () => {
    getStudentList(projectCode, { pageNumber, pageSize })
  }
  useEffect(() => {
    !!projectCode && getStudentList(projectCode, { pageNumber, pageSize })
    setUploadedFile(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectCode, pageNumber, pageSize])
  useEffect(() => {
    tableData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectStudentListData])

  return (
    <Box>
      <Dialog
        open={openFileUpload}
        onClose={(event, reason) => {
          reason != 'backdropClick' && setOpenFileUpload(false)
        }}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle textAlign={'center'}>Student Bulk upload</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12} mb={5}>
              <FileUploadComponent removedFiles={() => setUploadedFile(null)} setSelectedFiles={setSelectedFiles} />
            </Grid>
          </Grid>

          {uploadedFile?.error && (
            <Alert variant='outlined' severity='error'>
              Upload a Valid .xls or .xlsx file
            </Alert>
          )}
          {!!missingData?.column?.length && (
            <Alert variant='outlined' severity='error'>
              Missing values in the columns '{missingData?.column.join(', ')}' in Rows-{' '}
              {missingData?.row?.length > 4
                ? `${missingData?.row?.slice(0, 3)?.join(', ')}...`
                : missingData?.row?.join(', ')}
              . Please fill all the mandatory fields and re-upload the file.
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={handleCloseBulkUpload}>
            CANCEL
          </Button>
          <Button
            type='submit'
            variant='contained'
            onClick={uploadBulkDocument}
            disabled={!uploadedFile || uploadedFile?.error || !!missingData?.column?.length}
          >
            APPLY TEMPLATE
          </Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ mt: 4.5, mb: 0, p: 7 }}>
        <Grid container display={'flex'} justifyContent={'space-between'}>
          <Grid item>
            <Box>
              <h3 className='mt-0 d-flex' style={{ margin: 0 }}>
                Student List
              </h3>
            </Box>
          </Grid>

          <Grid item sx={{ display: 'flex' }}>
            <BulkIntake
              selectedRow={selectedRow}
              studentList={studentList}
              projectCode={projectCode}
              getStudent={getStudent}
              setSelectedRow={setSelectedRow}
            />
            <Button sx={{ mr: 2 }} size='small' variant='outlined' onClick={() => downloadStudent(projectCode)}>
              Download List
            </Button>
            <Button
              sx={{ mr: 2 }}
              size='small'
              variant='outlined'
              onClick={() => downloadTemplates(FileName.Template)}
              startIcon={<FileDownloadOutline />}
            >
              Download Template
            </Button>
            <Button
              sx={{ mr: 2 }}
              variant='contained'
              size='small'
              onClick={() => {
                setOpenFileUpload(!openFileUpload)
              }}
            >
              Bulk Upload
            </Button>

            <Box>
              <Link href={`/project/preview/${projectCode}/add-student`} passHref>
                <Button sx={{ mr: 2 }} variant='contained' size='small'>
                  Add Student
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Grid container rowSpacing={10} sx={{ mb: 4, mt: 5 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <DataGrid
            autoHeight
            pagination
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableSelectionOnClick
            columns={columns}
            loading={isLoading}
            checkboxSelection={fullPermission}
            selectionModel={selectedRow}
            onSelectionModelChange={newRowSelectionModel => setSelectedRow(newRowSelectionModel)}
            paginationMode='server'
            rows={studentList ?? []}
            rowsPerPageOptions={[10, 25, 50]}
            rowCount={projectStudentListData?.count}
            pageSize={pageSize}
            page={pageNumber - 1}
            onPageChange={newPage => setPageNumber(newPage + 1)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            isRowSelectable={params => {
              return params.row.status === intakeStatue.intakeAssignedPending ? true : false
            }}
            getRowId={row => row.id}
          />
        </Grid>
      </Card>
    </Box>
  )
}

export default StudentList
