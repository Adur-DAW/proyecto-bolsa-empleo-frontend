import { Box, Container } from '@mui/material'

import OfertasFiltros from './components/OfertasFiltros'
import OfertasLista from './components/OfertasLista'

export default function OfertasPage() {
	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					gap: 4,
				}}
			>
				<OfertasFiltros />
				<Box sx={{ flex: 1 }}>
					<OfertasLista />
				</Box>
			</Box>
		</Container>
	)
}
