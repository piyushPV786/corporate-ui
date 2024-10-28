// ** MUI Imports
import { Button, Chip } from '@mui/material'
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import { Close, FilterVariant } from 'mdi-material-ui'
import { useMemo, useState } from 'react'
import SearchBox from 'src/components/SearchBox'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { enrollGroupStatusTypes } from 'src/context/common'
import { IIntakeType } from 'src/context/types'
import { getName } from 'src/utils'
import DialogEnroll from 'src/views/pages/dialog/DialogEnroll'

interface TableHeaderProps {
  value: string
  selectedRows?: GridRowId[]
  handleFilter: (val: string) => void
  openFilterSideBar: () => void
  filterData: any
  selectedRow: any
  clearFilter: () => void
  enrollIntake: any
  intakeLists: IIntakeType[]
}

const TableHeaderStudentManagement = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, openFilterSideBar, filterData, clearFilter, enrollIntake, selectedRow, intakeLists } =
    props

  const [filterArray, setFilterArray] = useState<string[]>([])

  const intakeNames = intakeLists.map(items => items.program)

  useMemo(() => {
    if (filterData) {
      const filterArray: any = []
      for (const key in filterData) {
        if (!!filterData[key]) {
          filterArray.push(
            filterData[key].includes('INT')
              ? getName(intakeLists, filterData[key])
              : filterData[key].includes('Prog')
                ? getName(intakeNames, filterData[key])
                : enrollGroupStatusTypes[filterData[key]]
                  ? enrollGroupStatusTypes[filterData[key]]
                  : filterData[key]
          )
        }
      }

      setFilterArray(filterArray)
    }
  }, [filterData])

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
      <Box sx={{ mb: 2 }} display={'flex'} justifyContent={'space-between'}>
        <Box mr={2}>{filterArray?.map(item => <Chip key={item} label={item} />)}</Box>
        {!!filterArray?.length && (
          <Box mr={2}>
            <Button onClick={clearFilter} variant='outlined' size='small' startIcon={<Close fontSize='small' />}>
              Clear Filter
            </Button>
          </Box>
        )}
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Button
                onClick={openFilterSideBar}
                sx={{ mr: 2 }}
                variant='outlined'
                size='small'
                startIcon={<FilterVariant />}
              >
                Filters
              </Button>
            </Box>
            <FullPermission featureCode={FeatureCodes.EMS.studentManagement}>
              <Box sx={{ border: '1px solid #9E9E9E', mr: 2 }}></Box>
              <Box>
                <DialogEnroll enrollIntake={enrollIntake} selectedRow={selectedRow} />
              </Box>
            </FullPermission>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TableHeaderStudentManagement
