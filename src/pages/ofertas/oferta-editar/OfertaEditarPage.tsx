import { Box, Typography } from '@mui/material'

import OfertaEditarDatosBase from './components/OfertaEditarDatosBase'
import OfertaEditarTitulos from './components/oferta-editar-titulos/OfertaEditarTitulos'

export default function OfertaEditarPage() {
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
					Actualizar oferta
				</Typography>
			</Box>
			<OfertaEditarDatosBase />
			<OfertaEditarTitulos />
		</>
	)
}
