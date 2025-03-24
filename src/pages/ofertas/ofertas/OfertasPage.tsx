import { Box, Button, Container } from '@mui/material'
import { Link } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'

import OfertasFiltros from './components/OfertasFiltros'
import OfertasLista from './components/OfertasLista'

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
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
						{mismoRol('empresa') && (
							<Button
								variant="contained"
								color="secondary"
								to={'/ofertas/nueva'}
								component={Link}
							>
								Añadir nueva
							</Button>
						)}
					</Box>

					<OfertasLista />
				</Box>
			</Box>
		</Container>
	)
}
