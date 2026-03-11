import {
	Box,
	Button,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from '@mui/material'

import { FamiliaProfesional } from '@/shared/repositories/MaestrosRepository'

type EstadisticasFiltrosProps = {
	filtros: {
		fechaInicio: string
		fechaFin: string
		familia: string
		agrupacion: string
	}
	familias: FamiliaProfesional[]
	onCambioFiltro: (campo: string, valor: string) => void
	onExportar: () => void
	onActualizar: () => void
}

export default function EstadisticasFiltros({
	filtros,
	familias,
	onCambioFiltro,
	onExportar,
	onActualizar,
}: EstadisticasFiltrosProps) {
	return (
		<Paper elevation={3} sx={{ p: 2, mb: 4 }}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				flexWrap="wrap"
				gap={2}
			>
				<Typography variant="h4" fontWeight="bold" color="primary">
					Panel de Control
				</Typography>
				<Box display="flex" gap={2} flexWrap="wrap">
					<TextField
						select
						label="Agrupar Datos"
						value={filtros.agrupacion || 'diario'}
						onChange={(e) => onCambioFiltro('agrupacion', e.target.value)}
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
						onChange={(e) => onCambioFiltro('familia', e.target.value)}
						sx={{ minWidth: 200 }}
						SelectProps={{ displayEmpty: true }}
					>
						<MenuItem value="">
							<em>Todas</em>
						</MenuItem>
						{familias.map((f) => (
							<MenuItem key={f.id} value={f.nombre}>
								{f.nombre}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="Desde"
						type="date"
						value={filtros.fechaInicio}
						onChange={(e) => onCambioFiltro('fechaInicio', e.target.value)}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Hasta"
						type="date"
						value={filtros.fechaFin}
						onChange={(e) => onCambioFiltro('fechaFin', e.target.value)}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<Button variant="outlined" onClick={onExportar}>
						Exportar CSV
					</Button>
					<Button variant="contained" onClick={onActualizar} size="large">
						Actualizar
					</Button>
				</Box>
			</Box>
		</Paper>
	)
}
