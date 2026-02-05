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
	Button,
	Autocomplete
} from '@mui/material'

import useRol from '@/shared/hooks/rol.hook'
import { MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import { IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Control, Controller } from 'react-hook-form'

interface OfertasFiltrosProps {
	control: Control<any>
	onBuscar: () => void
}

export default function OfertasFiltros({
	control,
	onBuscar
}: OfertasFiltrosProps) {
	const { rol } = useRol()

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

				{/* RADIO GROUP: Filter Mode (My Offers vs All) */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Ver ofertas
					</Typography>
					<Controller
						name="filtro"
						control={control}
						render={({ field }) => (
							<RadioGroup {...field}>
								{rol !== 'empresa' && (
									<FormControlLabel
										value="todas"
										control={<Radio />}
										label="Todas"
									/>
								)}
								{rol === 'demandante' && (
									<FormControlLabel
										value="demandante"
										control={<Radio />}
										label="Para mí"
									/>
								)}
								{rol === 'empresa' && (
									<FormControlLabel
										value="empresa"
										control={<Radio />}
										label="Mis ofertas"
									/>
								)}
							</RadioGroup>
						)}
					/>
				</Box>

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
								placeholder="Buscar..."
							/>
						)}
					/>
				</Box>

				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Familia Profesional
					</Typography>
					<Controller
						name="idFamilia"
						control={control}
						render={({ field }) => (
							<Autocomplete
								options={familias}
								getOptionLabel={(option) => option.nombre}
								value={familias.find((f) => f.id.toString() === field.value) || null}
								onChange={(_, newValue) => field.onChange(newValue ? newValue.id.toString() : '')}
								renderInput={(params) => <TextField {...params} size="small" placeholder="Todas" />}
								isOptionEqualToValue={(option, value) => option.id.toString() === value.id.toString()}
								noOptionsText="No se encontraron familias"
							/>
						)}
					/>
				</Box>

				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Estado
					</Typography>
					<Controller
						name="estado"
						control={control}
						render={({ field }) => (
							<FormControl fullWidth size="small">
								<Select {...field}>
									<MenuItem value="">Todas</MenuItem>
									<MenuItem value="activas">Abiertas</MenuItem>
									<MenuItem value="cerradas">Cerradas</MenuItem>
								</Select>
							</FormControl>
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
									<MenuItem value="fecha_publicacion.desc">Más recientes</MenuItem>
									<MenuItem value="fecha_publicacion.asc">Más antiguas</MenuItem>
									<MenuItem value="fecha_cierre.asc">Cierre próximo</MenuItem>
								</Select>
							</FormControl>
						)}
					/>
				</Box>

				<Box sx={{ mb: 3 }}>
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
			</Paper >
		</Box >
	)
}
