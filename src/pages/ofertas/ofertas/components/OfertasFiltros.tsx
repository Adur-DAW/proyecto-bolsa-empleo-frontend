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

export default function OfertasFiltros() {
	const queryClient = useQueryClient()

	const onAplicarFiltros = () =>
		queryClient.refetchQueries({
			queryKey: ['ofertas'],
		})

	return (
		<Box
			sx={{
				padding: 2,
				border: '1px solid #e0e0e0',
				borderRadius: 2,
			}}
		>
			<Typography variant="h6" gutterBottom>
				Filtrar ofertas
			</Typography>
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
			<Typography variant="subtitle1" sx={{ marginTop: 2 }}>
				Palabra clave
			</Typography>
			<TextField
				fullWidth
				placeholder="Introduce nombre o empresa"
				size="small"
				sx={{ marginTop: 1 }}
			/>
			<Button
				variant="contained"
				color="primary"
				fullWidth
				sx={{ marginTop: 2 }}
				onClick={onAplicarFiltros}
			>
				Aplicar filtros
			</Button>
		</Box>
	)
}
