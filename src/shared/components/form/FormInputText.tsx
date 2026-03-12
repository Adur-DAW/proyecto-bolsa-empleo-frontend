import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { TextField, TextFieldProps } from '@mui/material'

interface FormInputTextProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>
  control: Control<T>
  label: string
}

export function FormInputText<T extends FieldValues>({
  name,
  control,
  label,
  ...otherProps
}: FormInputTextProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...otherProps}
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          variant="outlined"
        />
      )}
    />
  )
}
