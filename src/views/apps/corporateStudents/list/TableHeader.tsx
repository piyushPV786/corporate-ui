import SearchBox from 'src/components/SearchBox'
import Filter from 'src/components/Filter'
import { ICorporateStudent, IDynamicObject, IFilterOptionsTypes } from 'src/types/apps/corporatTypes'
import { Grid } from '@mui/material'

interface TableHeaderProps {
  handleFilter: (val: string) => void
  studentData: Array<ICorporateStudent>
  handleSort: (val: IDynamicObject) => void
  filterOptions: IFilterOptionsTypes
  value: string
  setSearchValue: (val: string) => void
}

const TableHeader = ({
  value,
  setSearchValue,
  handleFilter,
  handleSort,
  studentData,
  filterOptions
}: TableHeaderProps) => {
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
        <Filter
          setSearchValue={setSearchValue}
          studentData={studentData}
          handleSort={handleSort}
          filterOptions={filterOptions}
        />
      </Grid>
    </Grid>
  )
}

export default TableHeader
