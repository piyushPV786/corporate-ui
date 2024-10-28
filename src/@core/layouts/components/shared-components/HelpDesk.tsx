import { Box, CircularProgress, IconButton, Menu, MenuItem, styled } from '@mui/material'
import { HelpCircleOutline } from 'mdi-material-ui'
import Link from 'next/link'
import { Fragment, SyntheticEvent, useState } from 'react'
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}
const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))
const HelpDesk = (props: Props) => {
  const { settings } = props
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [loading] = useState<boolean>(false)
  const { direction } = settings
  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' aria-controls='customized-menu' onClick={handleDropdownOpen}>
        <HelpCircleOutline />
      </IconButton>
      <Menu
        className='help-dropdown'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Link href={'https://helpdesk.regenesys.net/'} passHref>
              <StyledLink target='_blank' rel='noopener noreferrer'>
                Help Desk
              </StyledLink>
            </Link>
          </Box>
        </MenuItem>
        <MenuItem disableRipple>{loading && <CircularProgress color='inherit' />}</MenuItem>
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Link
              href={
                'https://regenesysnow-my.sharepoint.com/:w:/g/personal/brandond_regenesys_net/EfZ08VGBKKRJtZrzfoEJ72MBhQLEX6kTGlZGKhMkcCLRhA?e=bCxsYG&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1703151414795&web=1'
              }
              passHref
            >
              <StyledLink target='_blank' rel='noopener noreferrer'>
                User Manual
              </StyledLink>
            </Link>
          </Box>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}
export default HelpDesk
