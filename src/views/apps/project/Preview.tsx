import { Box, Grid } from '@mui/material'
import HeaderPreview from './HeaderPreview'
import TabDetails, { IProject } from './TabDetails'
import { useEffect, useState } from 'react'
import { DashboardService } from 'src/service'

interface propsType {
  code: string
}
export interface IStudentList {
  isActive: boolean
  id: number
  firstName: string
  lastName: string
  email: string
  contactNumberCountryCode: string
  contactNumber: string
  highestQulaification: string
  nationalId: string
  BDEName: string
  gender: string
  dateOfBirth: Date
  matricYear: number
  nationality: string
  alternativeContactCountryCode: string
  alternativeContact: string
  addressLine1: string
  addressLine2: string
  country: string
  state: string
  zipCode: number
  regNo: string
  status: string
}
export interface IStudent {
  count: number
  data: IStudentList[]
}

const Preview = ({ code }: propsType) => {
  const [projectData, setProjectData] = useState<IProject | null>(null)

  const getProjectList = async (param: string | number) => {
    const response = await DashboardService?.getProject(param)
    if (response?.status === 200 && response?.data?.data) {
      setProjectData(response?.data?.data)
    }
  }
  useEffect(() => {
    getProjectList(code)
  }, [code])

  return (
    <Box>
      <Grid mb={5}>
        <HeaderPreview {...projectData!} />
      </Grid>
      <TabDetails fetchProject={getProjectList} projectData={projectData!} code={code} />
    </Box>
  )
}
export default Preview
