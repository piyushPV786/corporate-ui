import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Grid, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { FullPermission } from 'src/components/common'
import { FeatureCodes } from 'src/components/common/featureData'
import { IAddressStateTypes } from 'src/types/apps/admittedStudent'
import { DateFormat, getName, getStateList } from 'src/utils'
import EditSponsorDialog from 'src/views/pages/dialog/AddEditSponsor'

const SponsorData = ({
  sponsor,
  country,
  getEnrolmentDetailById,
  applicationCode,
  gender,
  identificationType
}: any) => {
  const [sponsorStateList, setSponsorStateList] = useState<IAddressStateTypes[]>([])
  const [sponserChildInfoExpand, setSponserChildInfoExpand] = useState<boolean>(true)

  const getSponsorStateName = (sponsorStateList: any, code: string) => {
    return sponsorStateList?.find((item: { isoCode: string }) => item.isoCode == code)?.name
  }

  const getSponsorStateList = async (country: string) => {
    const list = await getStateList(country)
    setSponsorStateList(list)
  }

  useEffect(() => {
    getSponsorStateList(sponsor?.country)
  }, [sponsor?.country])

  return (
    <Grid item xs={12}>
      <Card>
        <Accordion expanded={sponserChildInfoExpand}>
          <AccordionSummary
            expandIcon={
              <h1
                onClick={() => {
                  if (sponserChildInfoExpand === true) {
                    setSponserChildInfoExpand(false)
                  } else if (sponserChildInfoExpand === false) {
                    setSponserChildInfoExpand(true)
                  }
                }}
              >
                <GridExpandMoreIcon />
              </h1>
            }
          >
            <Grid container justifyContent='space-between' rowSpacing={10}>
              <Grid
                item
                xs={11}
                onClick={() => {
                  if (sponserChildInfoExpand === true) {
                    setSponserChildInfoExpand(false)
                  } else if (sponserChildInfoExpand === false) {
                    setSponserChildInfoExpand(true)
                  }
                }}
              >
                <Grid container>
                  <Grid item xs={4}>
                    <label>Sponsor Type </label>
                    <Typography variant='h6'> {sponsor?.sponsorModeCode ? sponsor?.sponsorModeCode : '-'}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <label>Relationship Type</label>
                    <Typography variant='h6'>{sponsor?.relationshipCode ? sponsor?.relationshipCode : '-'}</Typography>
                  </Grid>
                  {sponsor?.relationshipCode === 'EMPLOYER' ? (
                    <Grid item xs={4}>
                      <label>Sponsor/company Name</label>
                      <Typography variant='h6'>{sponsor?.name ? sponsor?.name : '-'}</Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={4}>
                      <label>Name</label>
                      <Typography variant='h6'>
                        {sponsor?.firstName ? `${sponsor?.firstName} ${sponsor?.lastName}` : '-'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item>
                <FullPermission featureCode={FeatureCodes.OMS.AdmittedStudentList}>
                  <EditSponsorDialog
                    applicationCode={applicationCode}
                    studentdata={sponsor}
                    country={country}
                    getStudentData={getEnrolmentDetailById}
                    isEdit={true}
                    gender={gender}
                    documentType={identificationType}
                  />
                </FullPermission>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container sx={{ paddingRight: '80px' }} rowGap={5}>
              <Grid container xs={12} rowGap={5}>
                {/* <Grid container item xs={4}> */}
                {sponsor?.relationshipCode !== 'EMPLOYER' && (
                  <>
                    {' '}
                    <Grid item xs={4}>
                      <label>Gender</label>
                      <Typography variant='h6'>
                        {sponsor?.gender ? (sponsor?.gender === 'M' ? 'Male' : 'Female') : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>Date of Birth</label>
                      <Typography variant='h6'>
                        {sponsor?.dateOfBirth ? DateFormat(sponsor?.dateOfBirth) : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <label>Identification Type/ Number</label>
                      <Typography variant='h6'>
                        {sponsor?.identificationDocumentType
                          ? `${sponsor?.identificationDocumentType}/ ${sponsor?.identificationNumber}`
                          : '-'}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={4}>
                  <label>Mobile Number</label>
                  <Typography variant='h6'>{sponsor?.mobileNumber ? sponsor?.mobileNumber : '-'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <label>Email</label>
                  <Typography
                    variant='h6'
                    sx={{
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {sponsor?.email ? sponsor?.email : '-'}
                  </Typography>
                </Grid>

                {/* </Grid> */}
              </Grid>
            </Grid>
            <Card sx={{ mt: 5, width: 'inherit' }}>
              <Grid container p={5}>
                <Grid container xs={10} rowGap={5}>
                  <Grid item xs={4}>
                    <label>Address</label>
                    <Typography variant='h6'> {sponsor?.address ? sponsor?.address : '-'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>City</label>
                    <Typography variant='h6'> {sponsor?.city ? sponsor?.city : '-'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Box ml={7}>
                      <label>State/Provinces</label>
                      <Typography variant='h6'>
                        {' '}
                        {`${sponsor?.state ? getSponsorStateName(sponsorStateList, sponsor?.state) : '-'}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Country</label>
                    <Typography variant='h6'> {sponsor?.country ? getName(country, sponsor?.country) : '-'}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <label>Pin Code / Zip Code</label>
                    <Typography variant='h6'> {sponsor?.zipCode ? sponsor?.zipCode : '-'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </AccordionDetails>
        </Accordion>
      </Card>
    </Grid>
  )
}

export default SponsorData
