// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import SearchBox from 'src/components/SearchBox'

interface TableHeaderProps {
  value: string
  selectedRows?: GridRowId[]
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <SearchBox value={value} handleFilter={handleFilter} />
      </Box>
    </Box>
  )
}

export default TableHeader
