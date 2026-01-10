import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { TextField, MenuItem, TextFieldProps } from '@mui/material'

interface Option {
  id: string | number
  label: string
}

interface FormInputSelectProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>
  control: Control<T>
  label: string
  options: Option[]
}

export function FormInputSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  ...otherProps
}: FormInputSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...otherProps}
          select
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
          value={field.value || ''}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
