import { TextField, FormHelperText, InputAdornment, IconButton } from '@mui/material'
import { Information } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { messages } from 'src/context/common'
import Close from 'mdi-material-ui/Close'
import debounce from 'lodash/debounce'

const SearchBox = ({ handleFilter, value }: { handleFilter: (arg0: string) => void; value: string }) => {
  const [helperText, setHelperText] = useState<boolean>(false)
  const { watch, setValue, control } = useForm()

  const query = watch('search')

  // Create a debounced function inside the effect
  useEffect(() => {
    const debouncedFilter = debounce((searchQuery: string) => {
      handleFilter(searchQuery)
    }, 500)

    if (query) {
      setHelperText(query.length <= 2)
      if (query.length > 2) {
        debouncedFilter(query)
      }
    } else if (query === '') {
      handleFilter('')
      setHelperText(false)
    }

    // Clean up the debounced function on unmount
    return () => {
      debouncedFilter.cancel()
    }
  }, [query])

  useEffect(() => {
    if (value === '') {
      setValue('search', '')
    }
  }, [value, setValue])

  return (
    <React.Fragment>
      <Controller
        name='search'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            size='small'
            placeholder='Search...'
            sx={{ mr: 2, maxWidth: '280px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setValue('search', '')}
                    sx={{ visibility: watch('search')?.length > 2 ? 'visible' : 'hidden' }}
                  >
                    <Close fontSize='small' />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
      />

      {helperText ? (
        <FormHelperText sx={{ display: 'flex', alignItems: 'center' }}>
          <Information fontSize='small' /> &nbsp;
          {messages.searchErrorMessage}
        </FormHelperText>
      ) : null}
    </React.Fragment>
  )
}

export default SearchBox
