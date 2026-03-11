import { Box, Button, Container, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { IconPlus } from '@tabler/icons-react'

import { ObtenerOfertas } from '@/shared/enums/obtener-ofertas.enum'
import useRol from '@/shared/hooks/rol.hook'

import OfertasFiltros from './components/OfertasFiltros'
import OfertasLista from './components/OfertasLista'
import { useForm } from 'react-hook-form'

interface OfertasFilterForm {
	filtro: ObtenerOfertas
	search: string
	ordenarPor: string
	estado: string
	idFamilia: string
	inscrito?: string
}

export default function OfertasPage() {
	const { rol, mismoRol } = useRol()
	const [searchParams, setSearchParams] = useSearchParams()

	const [filtroFrontend, setFiltroFrontend] = useState('')

	const { control, handleSubmit, watch } = useForm<OfertasFilterForm>({
		defaultValues: {
			filtro: (searchParams.get('filtro') as ObtenerOfertas) ||
				(rol == 'sinRol' || rol == 'centro' ? 'todas' : rol == 'demandante' ? 'demandante' : 'empresa'),
			search: searchParams.get('search') || '',
			ordenarPor: searchParams.get('ordenarPor') || 'fecha_publicacion.desc',
			estado: searchParams.get('estado') || 'activas',
			idFamilia: searchParams.get('idFamilia') || '',
			inscrito: searchParams.get('inscrito') || 'todas'
		}
	})

	const [filtros, setFiltros] = useState<OfertasFilterForm>(watch())

	const onSubmit = (data: OfertasFilterForm) => {
		const params: any = {}
		if (data.filtro) params.filtro = data.filtro
		if (data.search) params.search = data.search
		if (data.ordenarPor) params.ordenarPor = data.ordenarPor
		if (data.estado) params.estado = data.estado
		if (data.idFamilia) params.idFamilia = data.idFamilia
		if (data.inscrito && data.inscrito !== 'todas') params.inscrito = data.inscrito

		setSearchParams(params)
		setFiltros(data)
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
				<OfertasFiltros
					control={control}
					onBuscar={handleSubmit(onSubmit)}
				/>

				<Box sx={{ flex: 1 }}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
						<TextField
							size="small"
							placeholder="Filtrar..."
							value={filtroFrontend}
							onChange={(e) => setFiltroFrontend(e.target.value)}
							sx={{ width: 300 }}
						/>

						{mismoRol('empresa') && (
							<Button
								variant="contained"
								color="secondary"
								to={'/ofertas/nueva'}
								component={Link}
								startIcon={<IconPlus />}
								sx={{ ml: 2 }}
							>
								Añadir nueva
							</Button>
						)}
					</Box>

					<OfertasLista
						filtro={filtros.filtro}
						search={filtros.search}
						ordenarPor={filtros.ordenarPor}
						estado={filtros.estado}
						idFamilia={filtros.idFamilia}
						inscrito={filtros.inscrito}
						filtroFrontend={filtroFrontend}
					/>
				</Box>
			</Box>
		</Container>
	)
}
