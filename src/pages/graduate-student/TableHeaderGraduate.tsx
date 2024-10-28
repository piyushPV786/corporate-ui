// ** MUI Imports
import { Chip, Grid } from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { IRecordsType } from 'src/types/apps/dataTypes'
import DialogGraduateStudent from 'src/views/pages/dialog/DialogGraduateStudent'

type Props = {
  academicYear: number
  programName: string
  selectedRows: GridRowId[]
  data: IRecordsType[]
}

const TableHeaderStudentList = ({ data, programName, academicYear, selectedRows }: Props) => {
  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }} p={5}>
      <Grid item sm={4}>
        {data.length === 1 ? '1 Result found' : `${data.length} Results found`}{' '}
        {!!academicYear && <Chip label={academicYear} />} {!!programName && <Chip label={programName} />}
      </Grid>
      <FullPermission featureCode={FeatureCodes.EMS.graduateStudent}>
        <DialogGraduateStudent
          data={data}
          selectedRows={selectedRows}
          programName={programName}
          academicYear={academicYear}
        />
      </FullPermission>
    </Grid>
  )
}

export default TableHeaderStudentList
