import { Box, Button, Container } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'

import { ObtenerOfertas } from '@/shared/enums/obtener-ofertas.enum'
import useRol from '@/shared/hooks/rol.hook'

import OfertasFiltros from './components/OfertasFiltros'
import OfertasLista from './components/OfertasLista'

export default function OfertasPage() {
	const { rol, mismoRol } = useRol()

	const [filtro, setFiltro] = useState<ObtenerOfertas>(
		rol == 'sinRol' ? 'todas' : rol == 'demandante' ? 'demandante' : 'empresa'
	)

	const onCambiarFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFiltro(event.target.value as ObtenerOfertas)
	}

	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					gap: 4,
				}}
			>
				<OfertasFiltros filtro={filtro} onCambiarFiltro={onCambiarFiltro} />

				<Box sx={{ flex: 1 }}>
					{mismoRol('empresa') && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'flex-end',
								marginBottom: 2,
							}}
						>
							<Button
								variant="contained"
								color="secondary"
								to={'/ofertas/nueva'}
								component={Link}
							>
								Añadir nueva
							</Button>
						</Box>
					)}
					<OfertasLista filtro={filtro} />
				</Box>
			</Box>
		</Container>
	)
}
