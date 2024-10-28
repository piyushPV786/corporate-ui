import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs, { tabsClasses } from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Notes from 'src/pages/project/notes'
import { CardAccountDetailsOutline } from 'mdi-material-ui'
import ProgramAndCourseDetail from './components/ProgramAndCourseDetail'
import ProjectDetails from './components/ProjectDetails'
import VenueDetails from 'src/pages/project/venue'
import CostContract from 'src/views/apps/project/contract'
import StudentList from './components/StudentList'
import Documents from 'src/views/apps/project/components/Documents'
import ContactDetailsList from 'src/pages/project/client-contact'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

interface IProgramDetail {
  proposalSubmissionDate: DateType
  releaseOfNotificationApprovedBy: string
  varianceDetails: string
  submission: boolean
  typeOfNotificationReceived: string
  programBusinessUnit: string
  program: string
  courseType: string
  startDate: Date | string
  duration: string
  noOfStudent: number
  facilitator: string
  assessmentRequired: boolean
  customizationRequired: boolean
  accreditationRequired: boolean
  notes: string
  isActive: boolean
  id: number
}

interface IProjectDetails {
  isActive: boolean
  id: number
  createdBy: null
  createdAt: string
  updatedBy: null
  updatedAt: string
  deletedBy: null
  deletedAt: null
  programBusinessUnit: string
  typeOfNotificationReceived: string
  submission: boolean
  varianceDetails: string
  releaseOfNotificationApprovedBy: string
  proposalSubmissionDate: string
}
interface ICorporate {
  isActive: boolean
  id: number
  createdBy: null
  createdAt: string
  updatedBy: null
  updatedAt: string
  deletedBy: null
  deletedAt: null
  name: string
  code: string
  companyType: null
  email: string
  phoneNumber: string
}
export interface IProject {
  isActive: boolean
  id: number
  name: string
  code: string
  projectManager: string
  accountManager: string
  program: string
  courseType: string
  projectDetails: IProjectDetails | null
  corporateEd: ICorporate | null
  programDetails: IProgramDetail
  noOfStudent: number
}
interface ITabDetail {
  projectData: IProject
  code: string
  fetchProject: (id: string | number) => void
}

const TabDetails = ({ projectData, fetchProject }: ITabDetail) => {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box>
      <AppBar position='static' sx={{ backgroundColor: 'customColors.tableHeaderBg' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons
          aria-label='visible arrows tabs example'
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.MuiButtonBase-root': { color: 'common.black' },
              '&.Mui-disabled': { opacity: 0.3, color: 'common.black' }
            }
          }}
        >
          <Tab
            icon={<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/project-details-black.svg`} alt='' />}
            iconPosition='start'
            label='Project Details'
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/cost-and-contract-details-black.svg`}
                alt=''
              />
            }
            iconPosition='start'
            label='COST AND CONTRACT DETAILS'
            {...a11yProps(1)}
          />
          <Tab icon={<CardAccountDetailsOutline />} iconPosition='start' label='CONTACT DETAILS' {...a11yProps(2)} />
          <Tab
            icon={
              <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/program-course-details-black.svg`} alt='' />
            }
            iconPosition='start'
            label='QUALIFICATION/MODULE DETAILS'
            {...a11yProps(3)}
          />
          <Tab
            icon={<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/students-black.svg`} alt='' />}
            iconPosition='start'
            label='STUDENTS '
            {...a11yProps(4)}
          />
          <Tab
            icon={<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/documents-black.svg`} alt='' />}
            iconPosition='start'
            label='DOCUMENTS'
            {...a11yProps(5)}
          />
          <Tab
            icon={<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/venue-details-black.svg`} alt='' />}
            iconPosition='start'
            label='VENUE DETAILS'
            {...a11yProps(6)}
          />
          <Tab
            icon={<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/notes-black.svg`} alt='' />}
            iconPosition='start'
            label='NOTES'
            {...a11yProps(7)}
          />
        </Tabs>
      </AppBar>
      <AppBar position='static' sx={{ backgroundColor: 'customColors.tableHeaderBg' }}>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <ProjectDetails fetchProject={fetchProject} projectData={projectData} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <CostContract code={projectData?.code} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <ContactDetailsList code={projectData?.code} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <ProgramAndCourseDetail fetchProject={fetchProject} projectData={projectData} />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <StudentList projectCode={projectData?.code as any} projectName={projectData?.name as any} />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <Documents projectCode={projectData?.code} projectId={projectData?.id} />
        </TabPanel>
        <TabPanel value={value} index={6} dir={theme.direction}>
          <VenueDetails code={projectData?.code} />
        </TabPanel>
        <TabPanel value={value} index={7} dir={theme.direction}>
          <Notes projectData={projectData} />
        </TabPanel>
      </AppBar>
    </Box>
  )
}
export default TabDetails
