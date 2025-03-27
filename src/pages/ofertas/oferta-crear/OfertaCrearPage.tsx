import { Box, Typography } from '@mui/material'
import OfertaCrearDatosBase from './components/OfertaCrearDatosBase'

export default function OfertaCrearPage() {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant="h4" gutterBottom>
					Crear nueva oferta
				</Typography>
			</Box>
			<OfertaCrearDatosBase />
		</>
	)
}
