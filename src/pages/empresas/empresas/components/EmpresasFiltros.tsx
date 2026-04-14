import { Autocomplete, Box, Paper, TextField, Typography, FormControl, Select, MenuItem, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import { IconSearch } from '@tabler/icons-react'
import { Control, Controller } from 'react-hook-form'
import useRol from '@/shared/hooks/rol.hook'

interface EmpresasFiltrosProps {
  control: Control<any>
  onBuscar: () => void
  onLimpiar: () => void
}

export default function EmpresasFiltros({
  control,
  onBuscar,
  onLimpiar
}: EmpresasFiltrosProps) {

  const { rol } = useRol()
  const { data: familias = [] } = useQuery({
    queryKey: ['familias-profesionales'],
    queryFn: MaestrosRepository.obtenerFamilias,
  })

  return (
    <Box sx={{ width: { xs: '100%', md: 300 } }}>
      <Paper sx={{ p: 3, textAlign: 'left' }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>

        {rol === 'centro' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ver empresas
            </Typography>
            <Controller
              name="filtro"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="todas"
                    control={<Radio />}
                    label="Todas"
                  />
                  <FormControlLabel
                    value="validadas"
                    control={<Radio />}
                    label="Validadas"
                  />
                  <FormControlLabel
                    value="pendientes"
                    control={<Radio />}
                    label="Pendientes de validar"
                  />
                </RadioGroup>
              )}
            />
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Palabra clave
          </Typography>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Buscar por nombre..."
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Familia Profesional
          </Typography>
          <Controller
            name="idFamiliaProfesional"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={familias}
                getOptionLabel={(option) => option.nombre}
                value={familias.find((f) => f.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                renderInput={(params) => <TextField {...params} size="small" placeholder="Todas" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="No se encontraron familias"
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Ordenar por
          </Typography>
          <Controller
            name="ordenarPor"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <Select {...field}>
                  <MenuItem value="nombre.asc">Nombre (A-Z)</MenuItem>
                  <MenuItem value="ofertas_count.desc">Más ofertas</MenuItem>
                  <MenuItem value="vacantes.desc">Más vacantes</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<IconSearch size={18} />}
            onClick={onBuscar}
          >
            Buscar
          </Button>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={onLimpiar}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
