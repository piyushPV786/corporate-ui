// ** React Imports
import { useEffect, useCallback, useState, ChangeEvent } from 'react'

// ** Next Imports

import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiAutocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Backdrop from '@mui/material/Backdrop'
import Magnify from 'mdi-material-ui/Magnify'
import FallbackSpinner from 'src/@core/components/spinner'

// ** Types Imports
import { AppBarSearchType } from 'src/@fake-db/types'
import { DashboardService } from 'src/service'
import useDebounce from 'src/utils/debounce'
import { generateStudentCode } from 'src/utils'
import { IconButton } from '@mui/material'
import { Close } from 'mdi-material-ui'

interface NoResultProps {
  value: string
}

const categoryTitle: { [k: string]: string } = {
  application: 'Application',
  enrolment: 'Enrolment',
  assignIntake: 'Assign Intake',
  admission: 'Admission',
  admittedStudent: 'Admitted Student',
  studentRecord: 'Student Record'
}

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    borderTop: `1px solid ${theme.palette.divider}`,
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled,
        padding: theme.spacing(3.75, 6, 0.75)
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

const NoResult = ({ value }: NoResultProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No results for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>
    </Box>
  )
}

const AutocompleteComponent = () => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [options, setOptions] = useState<AppBarSearchType[]>([])
  const debouncedSearch = useDebounce(searchValue, 1000)

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()

  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  const searchObject = (element: any, category: any) => {
    if (element?.lead) {
      return {
        name: `${element?.lead?.firstName} ${element?.lead?.lastName}`,
        email: `${element?.lead?.email}`,
        phoneNumber: `+${element?.lead?.mobileCountryCode} ${element?.lead?.mobileNumber}`,
        id: generateStudentCode(element, category)?.code,
        category: `${category}`,
        url: generateStudentCode(element, category)?.url,
        studentCode: `${element?.lead?.studentCode}`
      }
    } else {
      return {
        name: `${element?.firstName} ${element?.lastName}`,
        email: `${element?.email}`,
        phoneNumber: `+${element?.mobileCountryCode} ${element?.mobileNumber}`,
        id: generateStudentCode(element, category)?.code,
        category: `${category}`,
        url: generateStudentCode(element, category)?.url,
        studentCode: `${element?.studentCode}`
      }
    }
  }

  const getGlobalSearchData = async (debouncedSearch: string) => {
    setLoading(true)
    if (debouncedSearch?.length) {
      const searchResponse = await DashboardService.globalSearch(debouncedSearch)

      const allData: any = Object?.values(searchResponse)
      const allKeys = Object?.keys(searchResponse)

      const allModifiedData: any = []

      allData?.forEach((item: any, index: number) => {
        item.forEach((element: any) => {
          allModifiedData.push(searchObject(element, allKeys[index]))
        })
      })
      setOptions(allModifiedData)
    }
    setLoading(false)
  }

  // Get all data using API
  useEffect(() => {
    if (debouncedSearch?.length) getGlobalSearchData(debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  // Handle click event on a list item in search result
  const handleOptionClick = (obj: AppBarSearchType) => {
    if (obj?.url) {
      router.push(obj.url)
    }
  }

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )
  const handleCancelClick = () => {
    setSearchValue('')
    setOptions([])
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])
  if (!isMounted) {
    return null
  } else {
    return (
      <>
        <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <FallbackSpinner />
        </Backdrop>
        <Autocomplete
          size='small'
          autoHighlight
          options={options}
          isOptionEqualToValue={() => true}
          inputValue={searchValue}
          onInputChange={(event, value: string) => setSearchValue(value)}
          onChange={(event, obj) => handleOptionClick(obj as AppBarSearchType)}
          noOptionsText={<NoResult value={searchValue} />}
          getOptionLabel={(option: AppBarSearchType | unknown) => {
            return (option as AppBarSearchType)[
              Object.keys(option as AppBarSearchType).find(
                k => (option as AppBarSearchType)[k]?.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
              ) ?? 'name'
            ]
          }}
          groupBy={(option: AppBarSearchType | unknown) => categoryTitle[(option as AppBarSearchType).category]}
          sx={{
            '& + .MuiAutocomplete-popper': {
              ...(searchValue.length && {
                overflow: 'auto',
                maxHeight: 'calc(100vh - 69px)',
                height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                width: '500px',
                background: 'white'
              })
            }
          }}
          renderInput={(params: AutocompleteRenderInputParams) => {
            return (
              <TextField
                variant='outlined'
                className='global-search'
                sx={{ width: '450px', background: 'white', borderRadius: '24px', border: '1px solid #c7c7cc' }}
                placeholder='Search...'
                {...params}
                value={searchValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  sx: { p: `${theme.spacing(2.5, 3)} !important` },
                  startAdornment: (
                    <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                      <Magnify />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleCancelClick}
                        sx={{ visibility: searchValue?.length > 2 ? 'visible' : 'hidden' }}
                      >
                        <Close fontSize='small' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ shrink: true }}
                size='small'
              />
            )
          }}
          renderOption={(props, option: AppBarSearchType | unknown) => {
            return (
              <ListItem
                {...props}
                key={(option as AppBarSearchType).name}
                className={`suggestion ${props.className}, global-search-list`}
                onClick={() => handleOptionClick(option as AppBarSearchType)}
              >
                <ListItemButton
                  sx={{
                    borderLeft: '2px solid #a2a2a2',
                    display: 'inline-block',
                    paddingLeft: '10px'
                  }}
                >
                  <Typography className='global-search-header' sx={{ color: 'primary.dark' }}>
                    {(option as AppBarSearchType).name}
                  </Typography>
                  <Typography variant='body2' className='global-search-subtext' sx={{ color: 'text.secondary' }}>
                    {`${(option as AppBarSearchType).id} | ${(option as AppBarSearchType).name} | ${
                      (option as AppBarSearchType).email
                    } | ${(option as AppBarSearchType).phoneNumber}`}{' '}
                  </Typography>
                </ListItemButton>
              </ListItem>
            )
          }}
        />
      </>
    )
  }
}

export default AutocompleteComponent
