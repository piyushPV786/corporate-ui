/* eslint-disable react-hooks/exhaustive-deps */

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import GenerateQuote from 'src/views/apps/generateQuotes/GenerateQuote'
import { Button } from '@mui/material'
import styles from 'src/views/pages/dialog/GenerateQuote.module.css'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { useRouter } from 'next/router'

// ** Styled component for the link in the dataTable

const StudentList = () => {
  const router = useRouter()

  return (
    <Grid container spacing={6}>
      <Grid container item xs={12}>
        <Grid item xs={9}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: '5',
              marginBottom: '.5rem'
            }}
          >
            <Box>
              <Typography className='page-header'>Generate Quote</Typography>
              <Typography
                className='breadcrumb-section'
                sx={{
                  '& .breadcrumb': {
                    color: '#008554'
                  }
                }}
              >
                <span className='breadcrumb'>Dashboard</span> / Generate Quote
              </Typography>
            </Box>
            <Box>
              <FullPermission featureCode={FeatureCodes.EMS.generateQuote}>
                <Button
                  className={styles.reggieNumberButton}
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    router.push('/generate-reggie-number')
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/icons/generate-quote-icons/address-section.svg`}
                    alt=''
                    style={{ marginRight: '3px', padding: '1px' }}
                  />
                  Generate Reggie Number
                </Button>
              </FullPermission>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <GenerateQuote />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StudentList
