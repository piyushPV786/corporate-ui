// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
// import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import Autocomplete from 'src/layouts/components/Autocomplete'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

//import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import Styles from './AppBarContent.module.css'
import HelpDesk from 'src/@core/layouts/components/shared-components/HelpDesk'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const {
    hidden,
    settings,

    // saveSettings,
    toggleNavVisibility
  } = props

  return (
    <Box className={Styles.MainBox}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <MenuIcon />
          </IconButton>
        ) : null}
        <Autocomplete />
      </Box>
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Box
          className='actions-right'
          {...Styles.sibBox}
          sx={{ display: 'flex', alignItems: 'center', boxShadow: 2, padding: 1 }}
        >
          <HelpDesk settings={settings} />
          {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
          {/* <NotificationDropdown settings={settings} /> */}
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBarContent
