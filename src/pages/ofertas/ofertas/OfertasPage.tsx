import { Box, Button, Container } from '@mui/material'

import OfertasFiltros from './components/OfertasFiltros'
import OfertasLista from './components/OfertasLista'
import useRol from '@/shared/hooks/rol.hook'
import { Link } from 'react-router'

export default function OfertasPage() {
	const { mismoRol } = useRol()

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
					{mismoRol('empresa') && <Button
						variant="contained"
						color="primary"
						to={'/ofertas/nueva'}
						component={Link}
						sx={{ marginLeft: 'auto', display: 'block', marginBottom: 2 }}
					>
						Añadir oferta
					</Button>}

					<OfertasLista />
				</Box>
			</Box>
		</Container>
	)
}
