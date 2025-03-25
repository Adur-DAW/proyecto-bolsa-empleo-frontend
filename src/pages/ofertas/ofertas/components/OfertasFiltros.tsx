import {
	Box,
	Button,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import useRol from '@/shared/hooks/rol.hook'

export default function OfertasFiltros({ filtro, onCambiarFiltro }) {
	const { mismoRol } = useRol()

	const queryClient = useQueryClient()

	const onAplicarFiltros = () => {
		return queryClient.refetchQueries({
			queryKey: ['ofertas', filtro],
		})
	}

	return (
		<Box
			sx={{
				padding: 4,
				boxShadow: 1,
				backgroundColor: 'white',
				borderRadius: 2,
				textAlign: 'left',
				minWidth: 300,
			}}
		>
			<Typography variant="h6" gutterBottom textAlign={'center'}>
				Filtrar ofertas
			</Typography>

			<Box sx={{ marginTop: 4 }}>
				<Typography variant="subtitle1" sx={{ marginTop: 2 }}>
					Obtener
				</Typography>
				<RadioGroup value={filtro} onChange={onCambiarFiltro}>
					<FormControlLabel
						value="todas"
						control={<Radio />}
						label="Todas las ofertas"
					/>
					{mismoRol('demandante') && (
						<FormControlLabel
							value="demandante"
							control={<Radio />}
							label="Ofertas para mí"
						/>
					)}
					{mismoRol('sinRol') && (
						<FormControlLabel
							disabled
							title="Debes iniciar sesión para ver las ofertas para ti"
							value="demandante"
							control={<Radio />}
							label="Ofertas para mí"
						/>
					)}
					{mismoRol('empresa') && (
						<FormControlLabel
							value="empresa"
							control={<Radio />}
							label="Ofertas creadas por mí"
						/>
					)}
				</RadioGroup>
			</Box>
			<Box sx={{ marginTop: 4 }}>
				<Typography variant="subtitle1" sx={{ marginTop: 2 }}>
					Ordenar por
				</Typography>
				<RadioGroup defaultValue="fechaPublicacion">
					<FormControlLabel
						value="fechaPublicacion"
						control={<Radio />}
						label="Fecha publicación"
					/>
					<FormControlLabel
						value="numeroPuestos"
						control={<Radio />}
						label="Numero puestos"
					/>
				</RadioGroup>
			</Box>

			<Box sx={{ marginTop: 4 }}>
				<Typography variant="subtitle1" sx={{ marginTop: 2 }}>
					Palabra clave
				</Typography>
				<TextField
					fullWidth
					placeholder="Introduce nombre o empresa"
					size="small"
					sx={{ marginTop: 1 }}
				/>
			</Box>

			<Button
				variant="contained"
				color="primary"
				fullWidth
				sx={{ marginTop: 2 }}
				onClick={onAplicarFiltros}
			>
				Buscar
			</Button>
		</Box>
	)
}
