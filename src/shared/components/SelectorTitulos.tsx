import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'
import { Titulo } from '../models'

interface Props {
  valor: Titulo[]
  alCambiar: (titulos: Titulo[]) => void
  error?: boolean
  textoAyuda?: string
  familiaFiltro?: string // Opcional: si queremos filtrar por familia externamente
}

export default function SelectorTitulos({ valor, alCambiar, error, textoAyuda, familiaFiltro }: Props) {
  const [open, setOpen] = useState(false)

  // Obtener todos los títulos
  const { data: titulos = [], isLoading } = useQuery({
    queryKey: ['titulos'],
    queryFn: TitulosRepositoryHttp.obtener,
    staleTime: 1000 * 60 * 60, // 1 hora
  })

  // Filtrar opciones
  const opciones = titulos.filter(t => {
    if (familiaFiltro) {
      return t.familia_profesional === familiaFiltro
    }
    return true
  })

  return (
    <Autocomplete
      multiple
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `[${option.familia_profesional}] ${option.nombre}`}
      options={opciones}
      loading={isLoading}
      value={valor}
      onChange={(_, newValue) => alCambiar(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Títulos Académicos"
          error={error}
          helperText={textoAyuda}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Box>
              <Box component="span" sx={{ fontWeight: 'bold', display: 'block', fontSize: '0.8em', color: 'text.secondary' }}>
                {option.familia_profesional}
              </Box>
              {option.nombre}
            </Box>
          </li>
        )
      }}
    />
  )
}
