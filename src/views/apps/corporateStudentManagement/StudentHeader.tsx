import { Grid, Typography } from '@mui/material'
import { ProgramNameField } from 'src/styles/style'
import CustomChip from 'src/@core/components/mui/chip'
import { IEnrollCount } from 'src/context/common'

interface StudentHeaderProps {
  count: IEnrollCount
}

const StudentHeader = ({ count }: StudentHeaderProps) => {
  return (
    <ProgramNameField container p={5} rowGap={5}>
      <Grid item xs={3} display='grid'>
        <label>No of Students</label>
        <Typography color={theme => theme.palette.common.white}>{count?.total}</Typography>
      </Grid>
      <Grid item xs={3} display='grid'>
        <label>No. of Enrollment- success</label>
        <Typography color={theme => theme.palette.common.white}>{count?.enrolled}</Typography>
      </Grid>
      <Grid item xs={3} display='grid'>
        <label>No. of Enrollment- Failed</label>
        <Typography color={theme => theme.palette.common.white}>{count?.notEnrolled}</Typography>
      </Grid>
      <Grid item xs={3} display='grid'>
        <label>Bulk Enrollment Status</label>
        <Typography>
          <CustomChip
            skin='light'
            size='small'
            label={count?.notEnrolled ? 'Partially Enrolled' : 'Enrolled'}
            color={count?.notEnrolled ? 'warning' : 'primary'}
            sx={{
              textTransform: 'capitalize',
              '& .MuiChip-label': { lineHeight: '18px' },
              borderRadius: '4px',
              boxShadow: '2px 4px 4px 0px #9f9f9f75',
              backgroundColor: 'antiquewhite'
            }}
          />
        </Typography>
      </Grid>
    </ProgramNameField>
  )
}
export default StudentHeader
