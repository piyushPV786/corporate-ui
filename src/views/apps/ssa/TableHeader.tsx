// ** MUI Imports
import { Grid } from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'

// ** Custom Components and Services
import Filter from 'src/components/Filter'
import SearchBox from 'src/components/SearchBox'
import AssignSSADialog from 'src/views/pages/dialog/AssignSSADialog'

// ** Interfaces
import { IDynamicObject } from 'src/types/apps/corporatTypes'
import { IFilterFieldsTypes } from 'src/types/apps/invoiceTypes'
import { ISSACommonListTypes, ISSAStudentDataResponseTypes } from 'src/views/apps/ssa/sssConstants'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'

interface TableHeaderProps {
  value: string
  selectedRows?: GridRowId[]
  handleFilter: (val: string) => void
  studentData: ISSAStudentDataResponseTypes[]
  handleSort: (val: IDynamicObject) => void
  filterFields: IFilterFieldsTypes[]
  assignSSA: (ssaName: string) => void
  filterDefaultValues: IDynamicObject
  commonList: ISSACommonListTypes
  setSearchValue: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    handleFilter,
    studentData,
    handleSort,
    filterFields,
    assignSSA,
    selectedRows,
    filterDefaultValues,
    commonList,
    setSearchValue,
    value
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
              filterSubStatus={true}
            />
          </Grid>
          <FullPermission featureCode={FeatureCodes.EMS.assignStudentSupport}>
            <Grid item borderRight={theme => `2px solid ${theme.palette.grey[500]}`} />
            <Grid item>
              <AssignSSADialog assignSSA={assignSSA} selectedRows={selectedRows} commonList={commonList} />
            </Grid>
          </FullPermission>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TableHeader
