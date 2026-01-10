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
	sortBy: string
	estado: string
	familiaId: string
}

export default function OfertasPage() {
	const { rol, mismoRol } = useRol()
	const [searchParams, setSearchParams] = useSearchParams()

	// 1. Client-side filter (Top Right)
	const [clientFilter, setClientFilter] = useState('')

	// 2. Initialize Form with useFormHook
	const { control, handleSubmit, watch } = useForm<OfertasFilterForm>({
		defaultValues: {
			filtro: (searchParams.get('filtro') as ObtenerOfertas) ||
				(rol == 'sinRol' ? 'todas' : rol == 'demandante' ? 'demandante' : 'empresa'),
			search: searchParams.get('search') || '',
			sortBy: searchParams.get('sortBy') || 'fecha_publicacion.desc',
			estado: searchParams.get('estado') || 'abierta',
			familiaId: searchParams.get('familiaId') || ''
		}
	})

	// 3. Applied state for Query
	const [appliedFilters, setAppliedFilters] = useState<OfertasFilterForm>(watch())

	const onSubmit = (data: OfertasFilterForm) => {
		const params: any = {}
		if (data.filtro) params.filtro = data.filtro
		if (data.search) params.search = data.search
		if (data.sortBy) params.sortBy = data.sortBy
		if (data.estado) params.estado = data.estado
		if (data.familiaId) params.familiaId = data.familiaId

		setSearchParams(params)
		setAppliedFilters(data)
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
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						{/* Client Side Filter */}
						<TextField
							size="small"
							placeholder="Filtrar resultados vistos..."
							value={clientFilter}
							onChange={(e) => setClientFilter(e.target.value)}
							sx={{ width: 300 }}
						/>

						{mismoRol('empresa') && (
							<Button
								variant="contained"
								color="secondary"
								to={'/ofertas/nueva'}
								component={Link}
								startIcon={<IconPlus />}
							>
								Añadir nueva
							</Button>
						)}
					</Box>

					<OfertasLista
						filtro={appliedFilters.filtro}
						search={appliedFilters.search}
						sortBy={appliedFilters.sortBy}
						estado={appliedFilters.estado}
						familiaId={appliedFilters.familiaId}
						clientFilter={clientFilter}
					/>
				</Box>
			</Box>
		</Container>
	)
}
