import { Box, Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import ProjectDetailsDialog from 'src/views/pages/dialog/ProjectDetailsDialog'
import { IProject } from '../TabDetails'
import { DDMMYYYDateFormat, getFullName } from 'src/utils'
import { IAccountManagerList, IProjectManagerList } from 'src/types/apps/dataTypes'
import { DashboardService } from 'src/service'
import { status } from 'src/context/common'

interface propsType {
  projectData: IProject
  fetchProject: (id: string | number) => void
}
interface projectDetail {
  label: string
  value: any
}
const ProjectDetailsIndividual = ({ label, value }: projectDetail) => {
  return (
    <Grid item xs={12} sm={3} mb={8}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='caption' mb={2}>
          {label}
        </Typography>
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {value?.toString()?.length ? value.toString() : '-'}
        </Typography>
      </Box>
    </Grid>
  )
}

const ProjectDetails = ({ fetchProject, projectData }: propsType) => {
  const [open, setOpen] = useState(false)
  const [accountManagerList, setAccountManagerList] = useState<IAccountManagerList[]>([])
  const [projectManagerList, setProjectManagerList] = useState<IProjectManagerList[]>([])

  const getProjectManagerList = async () => {
    const response = await DashboardService.getCorporateProjectManagerList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProjectManagerList(response?.data?.data)
    }
  }
  const getAccountManagerList = async () => {
    const response = await DashboardService.getCorporateAccountManagerList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setAccountManagerList(response?.data?.data)
    }
  }

  const onClose = () => {
    setOpen(!open)
  }

  const dateFormateLocal = (date: any) => {
    if (date) {
      return DDMMYYYDateFormat(date)
    }

    return DDMMYYYDateFormat(new Date())
  }
  useEffect(() => {
    getProjectManagerList()
    getAccountManagerList()
  }, [])

  return (
    <Box>
      <ProjectDetailsDialog
        open={open}
        onClose={onClose}
        projectData={projectData}
        fetchProject={fetchProject}
        accountManagerList={accountManagerList}
        projectManagerList={projectManagerList}
      />
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant='h6'>Project Details</Typography>
        <Button variant='contained' onClick={() => setOpen(!open)} size='small'>
          Add or Edit
        </Button>
      </Box>
      <Grid container mb={10} mt={3} spacing={6}>
        <ProjectDetailsIndividual label='Project Name' value={projectData?.name} />
        <ProjectDetailsIndividual label='Project Code' value={projectData?.code} />
        <ProjectDetailsIndividual label='Corporate Name' value={projectData?.corporateEd?.name} />
        <ProjectDetailsIndividual
          label='Project Manager'
          value={getFullName(projectManagerList, projectData?.projectManager)}
        />
        <ProjectDetailsIndividual
          label='Account Manager'
          value={getFullName(accountManagerList, projectData?.accountManager)}
        />
        <ProjectDetailsIndividual
          label='Qualification Business Unit'
          value={projectData?.projectDetails?.programBusinessUnit}
        />
        <ProjectDetailsIndividual
          label='Type of Notification Received'
          value={projectData?.projectDetails?.typeOfNotificationReceived}
        />
        <ProjectDetailsIndividual
          label='Variation form original approved Proposal/ Submission'
          value={projectData?.projectDetails ? (projectData?.projectDetails?.submission ? 'Yes' : 'No') : '-'}
        />
        <ProjectDetailsIndividual label='Variance Details' value={projectData?.projectDetails?.varianceDetails} />
        <ProjectDetailsIndividual
          label='Release of Notification Approved By'
          value={projectData?.projectDetails?.releaseOfNotificationApprovedBy}
        />
        <ProjectDetailsIndividual
          label='Proposal Submission Date'
          value={
            projectData?.projectDetails?.proposalSubmissionDate
              ? dateFormateLocal(projectData?.projectDetails?.proposalSubmissionDate)
              : '-'
          }
        />
      </Grid>
    </Box>
  )
}

export default ProjectDetails
