// ** MUI Imports
import Box from '@mui/material/Box'

import SearchBox from 'src/components/SearchBox'

interface TableHeaderProps {
  handleFilter: (val: string) => void
  value: string
}

const StudentPopUpheader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

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

export default StudentPopUpheader
