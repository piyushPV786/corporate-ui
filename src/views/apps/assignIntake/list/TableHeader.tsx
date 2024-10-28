// ** MUI Imports
import { Button, Chip } from '@mui/material'
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import { Close, FilterVariant } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import SearchBox from 'src/components/SearchBox'
import { intakeStatusSelect } from 'src/context/common'
import { ICommonData, IProgramList } from 'src/types/apps/invoiceTypes'
import { filterNameByCode } from 'src/utils'

interface TableHeaderProps {
  value: string
  selectedRows?: GridRowId[]
  handleFilter: (val: string) => void
  openFilterSideBar: () => void
  filterData: any
  clearFilter: () => void
  commonData: ICommonData
  programList: IProgramList[]
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, openFilterSideBar, filterData, clearFilter, value } = props

  const [filterArray, setFilterArray] = useState<string[]>([])

  const programData = props?.programList ? props?.programList : []
  const intakeList = props?.commonData?.intakeList ? props?.commonData?.intakeList : []
  const studyModeLists = props?.commonData?.studyMode ? props?.commonData?.studyMode : []
  const studyTypeList = props?.commonData?.studyType ? props?.commonData?.studyType : []
  const status = intakeStatusSelect ? intakeStatusSelect : []

  const commonData = [...programData, ...intakeList, ...studyModeLists, ...studyTypeList, ...status]

  useEffect(() => {
    if (filterData) {
      const filterArray: any = []
      for (const key in filterData) {
        if (filterData[key]) {
          filterArray.push(filterData[key])
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
        <Box mr={2}>{filterArray?.map(item => <Chip key={item} label={filterNameByCode(commonData, item)} />)}</Box>
        {!!filterArray?.length && (
          <Box mr={2}>
            <Button onClick={clearFilter} variant='outlined' startIcon={<Close fontSize='small' />}>
              Clear Filter
            </Button>
          </Box>
        )}
        <Box>
          <Button onClick={openFilterSideBar} variant='outlined' startIcon={<FilterVariant fontSize='small' />}>
            Filters
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TableHeader
