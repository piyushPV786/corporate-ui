import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { IProject } from '../TabDetails'
import ProgramAndCourseDialog from 'src/views/pages/dialog/ProgramAndCourseDialog'
import { AcademicService, CommonService } from 'src/service'
import { commonListTypes } from 'src/types/apps/dataTypes'
import { status } from 'src/context/common'
import { IProgramList } from 'src/types/apps/invoiceTypes'
import { getName } from 'src/utils'

export const formateDate = (date: string) => {
  const newDate = new Date(date)

  // Check if the resulting Date object is invalid
  if (isNaN(newDate.getTime())) {
    return '-'
  }

  let mm = (newDate.getMonth() + 1).toString() // Get month and convert to string
  let dd = newDate.getDate().toString() // Get day and convert to string
  const yyyy = newDate.getFullYear()

  // Add leading zero to day if necessary
  dd = dd.length === 1 ? `0${dd}` : dd

  // Add leading zero to month if necessary
  mm = mm.length === 1 ? `0${mm}` : mm

  return `${dd}/${mm}/${yyyy}`
}

const ProgramAndCourseDetail = ({
  fetchProject,
  projectData
}: {
  fetchProject: (code: string | number) => void
  projectData: IProject
}) => {
  const { programDetails, code } = { ...projectData }
  const [open, setOpen] = useState(false)

  const [courseTypeList, setCourseTypeList] = useState<commonListTypes[]>([])
  const [programList, setProgramList] = useState<IProgramList[]>([])
  const [facilitatorList, setFacilitatorList] = useState<any>([])

  const onClose = () => {
    setOpen(!open)
  }

  const getCourseTypeList = async () => {
    const response = await CommonService.getCourseTypeList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCourseTypeList(response?.data?.data)
    }
  }

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }

  const getFacilitator = async () => {
    const response = await AcademicService.getFacilitator()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setFacilitatorList(response?.data?.data)
    }
  }

  useEffect(() => {
    getCourseTypeList()
    getProgramList()
    getFacilitator()
  }, [])

  return (
    <Card sx={{ position: 'relative' }}>
      <ProgramAndCourseDialog
        fetchProject={fetchProject}
        courseTypeList={courseTypeList}
        programList={programList}
        facilitatorList={facilitatorList}
        code={code}
        open={open}
        onClose={onClose}
        projectData={projectData}
      />
      <CardContent>
        <Grid container mb={10} mt={2} spacing={6}>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }} item xs={12} sm={12}>
            <Typography variant='h6' mb={2}>
              <strong>Qualification or Module Details</strong>
            </Typography>
            <Button
              sx={{ mr: 2 }}
              variant='contained'
              size='small'
              onClick={() => {
                setOpen(!open)
              }}
            >
              Add or Edit
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Module Type
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {courseTypeList.find(course => course.code === projectData?.courseType)?.name || '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Qualification
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {programList.find(program => program.code === projectData?.program)?.name || '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Accreditation Required
              </Typography>
              <Typography variant='h6'>{projectData?.programDetails?.accreditationRequired ? 'Yes' : 'No'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Assessment Required
              </Typography>
              <Typography variant='h6'>{projectData?.programDetails?.assessmentRequired ? 'Yes' : 'No'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Customization Required
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.programDetails?.customizationRequired ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Start Date
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.programDetails?.startDate ? formateDate(programDetails?.startDate?.toString()) : '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Duration
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.programDetails?.duration}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                No of Students
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.noOfStudent || '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Facilitator
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.programDetails?.facilitator
                  ?.split(',')
                  .map((facilitator: any) => getName(facilitatorList, facilitator))
                  .join(', ')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' mb={2}>
                Notes
              </Typography>
              <Typography variant='body2' color='black' sx={{ fontWeight: 600 }}>
                {projectData?.programDetails?.notes}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProgramAndCourseDetail
