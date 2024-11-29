import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material'
import { IProject } from './TabDetails'
import { CommonService, AcademicService, DashboardService } from 'src/service'
import { useEffect, useState } from 'react'
import { commonListTypes, IAccountManagerList, IProjectManagerList } from 'src/types/apps/dataTypes'
import { IProgramList } from 'src/types/apps/invoiceTypes'
import { status } from 'src/context/common'
import { getFullName } from 'src/utils'

const HeaderPreview = (props: IProject) => {
  const { accountManager, code, courseType, isActive, name, program, projectManager, corporateEd, noOfStudent } = {
    ...props
  }
  const [courseTypeList, setCourseTypeList] = useState<commonListTypes[]>([])
  const [programList, setProgramList] = useState<IProgramList[]>([])
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

  const getCourseTypeList = async () => {
    const response = await CommonService.getCourseTypeList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setCourseTypeList(response?.data?.data)
    }
  }


  useEffect(()=>{
    getAccountManagerList()
    getProjectManagerList()
  },[])

  const getProgramList = async () => {
    const response = await AcademicService.getAllProgramList()
    if (response?.status === status?.successCode && response?.data?.data?.length) {
      setProgramList(response?.data?.data)
    }
  }
  useEffect(() => {
    getCourseTypeList()
    getProgramList()
  }, [])

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'primary.dark' }}>
      <CardContent>
        <Grid container mb={10} mt={3} spacing={6}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Project Name
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {name}
                <Chip
                  sx={{ fontWeight: 100, marginLeft: 5 }}
                  size='small'
                  label='Active'
                  color={isActive ? 'success' : 'error'}
                  variant='outlined'
                />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Project Code
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {code}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Corporate Name
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {corporateEd?.name ? `${corporateEd?.name} (${corporateEd?.companyType})` : '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Project Manager
              </Typography>
              <Typography variant='h6' sx={{ fontWeight: 600, color: 'common.white' }}>
                {getFullName(projectManagerList,projectManager)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={6} mb={5}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Account Manager
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {getFullName(accountManagerList,accountManager)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Qualification/Module Name
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {programList.find(item => item.code === program)?.name || '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                Module Type
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {courseTypeList.find(course => course.code === courseType)?.name || '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ color: 'common.white' }} mb={2}>
                No of Students
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'common.white' }}>
                {noOfStudent || '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderPreview
