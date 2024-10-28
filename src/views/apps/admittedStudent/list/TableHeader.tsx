// ** MUI Imports
import { Grid } from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'
import Filter from 'src/components/Filter'
import SearchBox from 'src/components/SearchBox'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { ICorporateStudentType, IDynamicObject } from 'src/types/apps/corporatTypes'
import { IFilterFieldsTypes } from 'src/types/apps/invoiceTypes'
import UnEnrollDialog from 'src/views/pages/dialog/UnEnrollDialog'
import { IAllIntake } from 'src/types/apps/invoiceTypes'

interface TableHeaderProps {
  value: string
  selectedRows?: GridRowId[]
  handleFilter: (val: string) => void
  studentData: ICorporateStudentType[]
  handleSort: (val: IDynamicObject) => void
  filterFields: IFilterFieldsTypes[]
  unenrollStudent: () => void
  filterDefaultValues: IDynamicObject
  setSearchValue: (val: string) => void
  allIntake: IAllIntake[]
  getStudentList: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    setSearchValue,
    handleFilter,
    studentData,
    handleSort,
    filterFields,
    unenrollStudent,
    selectedRows,
    filterDefaultValues,
    value,
    allIntake,
    getStudentList
  } = props

  return (
    <Grid
      container
      p={5}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Grid item>
        <SearchBox value={value} handleFilter={handleFilter} />
      </Grid>
      <Grid item>
        <Grid container columnSpacing={3}>
          <Grid item>
            <Filter
              studentData={studentData}
              handleSort={handleSort}
              fields={filterFields}
              filterDefaultValues={filterDefaultValues}
              setSearchValue={setSearchValue}
              allIntake={allIntake}
              getStudentList={getStudentList}
            />
          </Grid>
          <FullPermission featureCode={FeatureCodes.EMS.admittedStudent}>
            <Grid item borderRight={theme => `2px solid ${theme.palette.grey[500]}`} />
            <Grid item>
              <UnEnrollDialog unenrollStudent={unenrollStudent} selectedRows={selectedRows} />
            </Grid>
          </FullPermission>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TableHeader
