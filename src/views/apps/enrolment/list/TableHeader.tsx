// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import SearchBox from 'src/components/SearchBox'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { IAgentsType } from 'src/context/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DialogReassign from 'src/views/pages/dialog/DialogReassign'

interface TableHeaderProps {
  value: string
  response: InvoiceType[]
  selectedRows: GridRowId[]
  agentList: Array<IAgentsType>
  handleFilter: (val: string) => void
  getEnrolmentList: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, selectedRows, response, agentList, getEnrolmentList } = props

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
      <FullPermission featureCode={FeatureCodes.EMS.applicationEnrollment}>
        <Box>
          <DialogReassign
            response={response}
            agentList={agentList}
            getCallBack={getEnrolmentList}
            selectedRows={selectedRows}
          />
        </Box>
      </FullPermission>
    </Box>
  )
}

export default TableHeader
