import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { FamiliaProfesional } from '@/shared/repositories/MaestrosRepository'

interface DashboardFiltersProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    familia: string
    agrupacion: string
  }
  familias: FamiliaProfesional[]
  onFilterChange: (campo: string, valor: string) => void
  onExport: () => void
  onRefresh: () => void
}

export default function DashboardFilters({ filtros, familias, onFilterChange, onExport, onRefresh }: DashboardFiltersProps) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Panel de Control
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Selector Agrupación */}
          <TextField
            select
            label="Agrupar Datos"
            value={filtros.agrupacion || 'diario'}
            onChange={(e) => onFilterChange('agrupacion', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="diario">Diario</MenuItem>
            <MenuItem value="mensual">Mensual</MenuItem>
            <MenuItem value="familia">Por Familia</MenuItem>
            <MenuItem value="localidad">Por Localidad</MenuItem>
          </TextField>

          <TextField
            select
            label="Filtrar por Familia"
            value={filtros.familia}
            onChange={(e) => onFilterChange('familia', e.target.value)}
            sx={{ minWidth: 200 }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=""><em>Todas</em></MenuItem>
            {familias.map(f => (
              <MenuItem key={f.id} value={f.nombre}>{f.nombre}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Desde"
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => onFilterChange('fechaInicio', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => onFilterChange('fechaFin', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" onClick={onExport}>
            Exportar CSV
          </Button>
          <Button variant="contained" onClick={onRefresh} size="large">
            Actualizar
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
