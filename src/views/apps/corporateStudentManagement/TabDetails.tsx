import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import StudentList from './list'
import { IEnrollCorporateResponseData } from 'src/context/common'

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
interface ITabDetails {
  response: IEnrollCorporateResponseData
}

const TabDetails = ({ response }: ITabDetails) => {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box>
        <Grid xs={12} display='flex' justifyContent='center'>
          <Tabs value={value} onChange={handleChange} variant='scrollable'>
            <Tab label='Success' sx={{ textTransform: 'capitalize' }} {...a11yProps(0)} />
            <Tab label='Failed' sx={{ textTransform: 'capitalize' }} {...a11yProps(1)} />
          </Tabs>
        </Grid>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <StudentList responseData={response?.enrolled} count={response?.count?.enrolled} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <StudentList responseData={response?.notEnrolled} count={response?.count?.notEnrolled} />
        </TabPanel>
      </Box>
    </>
  )
}
export default TabDetails
