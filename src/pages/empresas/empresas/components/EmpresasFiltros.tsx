import { Autocomplete, Box, Paper, TextField, Typography, FormControl, Select, MenuItem } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { MaestrosRepository } from '@/shared/repositories/MaestrosRepository'

interface EmpresasFiltrosProps {
  search: string
  onSearchChange: (value: string) => void
  familiaProfesionalId: number | null
  onFamiliaChange: (value: number | null) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export default function EmpresasFiltros({
  search,
  onSearchChange,
  familiaProfesionalId,
  onFamiliaChange,
  sortBy,
  onSortChange
}: EmpresasFiltrosProps) {
  const [localSearch, setLocalSearch] = useState(search)
  const [debouncedSearch] = useDebounce(localSearch, 500)

  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const { data: familias = [] } = useQuery({
    queryKey: ['familias-profesionales'],
    queryFn: MaestrosRepository.obtenerFamilias,
  })

  return (
    <Box sx={{ width: { xs: '100%', md: 300 } }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Palabra clave
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Familia Profesional
          </Typography>
          <Autocomplete
            options={familias}
            getOptionLabel={(option) => option.nombre}
            value={familias.find((f) => f.id === familiaProfesionalId) || null}
            onChange={(_, newValue) => onFamiliaChange(newValue ? newValue.id : null)}
            renderInput={(params) => <TextField {...params} size="small" placeholder="Todas" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Ordenar por
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <MenuItem value="nombre.asc">Nombre (A-Z)</MenuItem>
              <MenuItem value="ofertas_count.desc">Más ofertas</MenuItem>
              <MenuItem value="vacantes.desc">Más vacantes</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Box>
  )
}
