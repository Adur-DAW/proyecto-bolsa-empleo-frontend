import {
	Box,
	FormControl,
	FormControlLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import { ObtenerOfertas } from '@/shared/enums/obtener-ofertas.enum'
import useRol from '@/shared/hooks/rol.hook'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'

interface OfertasFiltrosProps {
	filtro: ObtenerOfertas
	onCambiarFiltro: (event: React.ChangeEvent<HTMLInputElement>) => void
	search: string
	onSearchChange: (value: string) => void
	sortBy: string
	onSortChange: (value: string) => void
}

export default function OfertasFiltros({
	filtro,
	onCambiarFiltro,
	search,
	onSearchChange,
	sortBy,
	onSortChange
}: OfertasFiltrosProps) {
	const { mismoRol } = useRol()
	const [localSearch, setLocalSearch] = useState(search)
	const [debouncedSearch] = useDebounce(localSearch, 500)

	useEffect(() => {
		onSearchChange(debouncedSearch)
	}, [debouncedSearch, onSearchChange])

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
						Ordenar por
					</Typography>
					<FormControl fullWidth size="small">
						<Select
							value={sortBy}
							onChange={(e) => onSortChange(e.target.value)}
						>
							<MenuItem value="fecha_publicacion.desc">Más recientes</MenuItem>
							<MenuItem value="fecha_publicacion.asc">Más antiguas</MenuItem>
							<MenuItem value="fecha_cierre.asc">Cierre próximo</MenuItem>
							<MenuItem value="numero_puestos.desc">Más vacantes</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Ver Ofertas
					</Typography>
					<RadioGroup value={filtro} onChange={onCambiarFiltro}>
						<FormControlLabel
							value="todas"
							control={<Radio />}
							label="Todas"
						/>
						{mismoRol('demandante') && (
							<FormControlLabel
								value="demandante"
								control={<Radio />}
								label="Para mí"
							/>
						)}
						{mismoRol('empresa') && (
							<FormControlLabel
								value="empresa"
								control={<Radio />}
								label="Creadas por mí"
							/>
						)}
					</RadioGroup>
				</Box>
			</Paper>
		</Box>
	)
}
