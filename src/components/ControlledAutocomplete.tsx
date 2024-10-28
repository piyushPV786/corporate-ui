import { Autocomplete, AutocompleteRenderInputParams, AutocompleteRenderOptionState, PopperProps } from '@mui/material'
import { JSXElementConstructor } from 'react'
import { Control, Controller, DefaultValues, FieldValues, InternalFieldName, RegisterOptions } from 'react-hook-form'

type AutoCompleteFieldProps<T> = {
  options: T[]
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode
  name: InternalFieldName
  control?: Control<FieldValues>
  rules?: RegisterOptions
  defaultValue?: DefaultValues<FieldValues>
  groupBy?: (option: T) => string
  fullWidth?: boolean
  disabled?: boolean
  PopperComponent?: JSXElementConstructor<PopperProps>
}
const ControlledAutocomplete = <T extends {}>({
  options = [],
  renderInput,
  control,
  defaultValue,
  name,
  rules,
  renderOption,
  groupBy,
  fullWidth,
  disabled,
  PopperComponent
}: AutoCompleteFieldProps<T>) => {
  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          fullWidth={fullWidth}
          disabled={disabled}
          options={options && options}
          key={field.value}
          renderInput={renderInput}
          isOptionEqualToValue={option => (option as any)?.code === field?.value}
          renderOption={renderOption}
          value={options?.find(item => (item as any)?.code === field?.value)}
          onChange={(e, data) => field.onChange(!!data ? (data as any)?.code : '')}
          getOptionLabel={option =>
            (option as any)?.name ?? `${(option as any)?.firstName} ${(option as any)?.lastName}`
          }
          groupBy={groupBy}
          PopperComponent={PopperComponent}
        />
      )}
    />
  )
}

export default ControlledAutocomplete
