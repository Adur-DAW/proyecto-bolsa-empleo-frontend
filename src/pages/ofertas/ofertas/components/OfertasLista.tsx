import {
	Avatar,
	Box,
	Button,
	Chip,
	Pagination,
	Stack,
	Typography,
} from '@mui/material'
import {
	IconBuilding,
	IconCalendar,
	IconClock,
	IconEdit,
	IconEye,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import InscribirseComponent from '@/pages/ofertas/shared/components/InscribirseComponent'

import EntityCard from '@/shared/components/cards/EntityCard'
import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import LimiteAccesoRestringido from '@/shared/components/error/LimiteAccesoRestringido'
import EmptyState from '@/shared/components/feedback/EmptyState'
import useRol from '@/shared/hooks/rol.hook'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useOfertasQuery } from '@/shared/hooks/useOfertasQuery'

type OfertasListaProps = {
	filtro?: string
	idEmpresa?: number
	estado?: string
	search?: string
	ordenarPor?: string
	idFamilia?: string
	clientFilter?: string
}

const formatearFecha = (date: dayjs.Dayjs) => {
	return date.isValid() ? date.format('DD/MM/YYYY') : 'N/D'
}

export default function OfertasLista({
	filtro,
	idEmpresa,
	estado,
	search,
	ordenarPor,
	idFamilia,
	clientFilter,
}: OfertasListaProps) {
	return (
		<Stack spacing={3}>
			<LimiteAccesoRestringido>
				<PageDataContainer skeletonType="list">
					<OfertasListaSuspense
						filtro={filtro}
						idEmpresa={idEmpresa}
						estado={estado}
						search={search}
						ordenarPor={ordenarPor}
						idFamilia={idFamilia}
						clientFilter={clientFilter}
					/>
				</PageDataContainer>
			</LimiteAccesoRestringido>
		</Stack>
	)
}

const OfertasListaSuspense = ({
	filtro,
	idEmpresa,
	estado,
	search,
	ordenarPor,
	idFamilia,
	clientFilter,
}: OfertasListaProps) => {
	const { usuario, mismoRol } = useRol()
	const [pagina, setPage] = useState(1)

	const effectiveSearch = search || ''
	const effectiveordenarPor = ordenarPor || 'fecha_publicacion.desc'

	const [busquedaDebounce] = useDebounce(effectiveSearch, 500)

	useEffect(() => {
		setPage(1)
	}, [
		filtro,
		idEmpresa,
		estado,
		busquedaDebounce,
		effectiveordenarPor,
		idFamilia,
	])

	const { data: paginatedData, isLoading } = useOfertasQuery({
		filtro,
		search: busquedaDebounce,
		idEmpresa: idEmpresa?.toString(),
		estado,
		ordenarPor: effectiveordenarPor,
		idFamilia,
		pagina,
	})

	const allOfertas = paginatedData?.data || []

	const ofertas = clientFilter
		? allOfertas.filter(
				(o) =>
					o.nombre.toLowerCase().includes(clientFilter.toLowerCase()) ||
					o.empresa?.nombre
						.toLowerCase()
						.includes(clientFilter.toLowerCase()) ||
					o.obs?.toLowerCase().includes(clientFilter.toLowerCase())
			)
		: allOfertas

	const handleCambioPagina = (_, value: number) => {
		setPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box>
			{ofertas.length === 0 && !isLoading && (
				<EmptyState
					title="No se encontraron ofertas"
					description="Intenta ajustar tus filtros de búsqueda"
				/>
			)}

			<Stack spacing={2}>
				{ofertas.map((oferta) => (
					<EntityCard
						key={oferta.id}
						title={oferta.nombre}
						badges={
							<Chip
								label={oferta.abierta ? 'Activa' : 'Cerrada'}
								color={oferta.abierta ? 'success' : 'default'}
								size="small"
								variant="outlined"
							/>
						}
						avatar={
							<Avatar
								src={oferta.empresa?.imagen_url || undefined}
								sx={{ width: 48, height: 48 }}
								variant="rounded"
							>
								{oferta.empresa?.nombre?.charAt(0)}
							</Avatar>
						}
						subtitle={
							<Link
								to={`/empresas/${oferta.idEmpresa}`}
								style={{
									textDecoration: 'none',
									color: 'inherit',
									display: 'flex',
									alignItems: 'center',
									gap: 4,
								}}
								onClick={(e) => e.stopPropagation()}
							>
								<IconBuilding size={16} />
								<Typography
									variant="body2"
									sx={{
										'&:hover': {
											textDecoration: 'underline',
											color: 'primary.main',
										},
									}}
								>
									{oferta.empresa?.nombre || 'Empresa desconocida'}
								</Typography>
							</Link>
						}
						details={[
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconClock
									size={16}
									color="var(--mui-palette-text-secondary)"
								/>
								<Typography variant="body2" color="text.secondary">
									{(oferta.tipoContrato as any)?.nombre ||
										oferta.tipoContrato ||
										'N/D'}{' '}
									• {oferta.horario}
								</Typography>
							</Box>,
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconCalendar
									size={16}
									color="var(--mui-palette-text-secondary)"
								/>
								<Typography variant="body2" color="text.secondary">
									Hasta: {formatearFecha(oferta.fechaCierre)}
								</Typography>
							</Box>,
							<Typography variant="body2" color="text.secondary">
								{oferta.demandantesInscritos} inscritos / {oferta.numeroPuestos}{' '}
								vacantes
							</Typography>,
						]}
						actions={
							<>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ mb: 1 }}
								>
									Publicado: {formatearFecha(oferta.fechaPublicacion)}
								</Typography>

								<Link to={`/ofertas/${oferta.id}`}>
									<Button
										variant="contained"
										color="primary"
										size="small"
										startIcon={<IconEye size={18} />}
									>
										Ver detalles
									</Button>
								</Link>

								<InscribirseComponent oferta={oferta} filtro={filtro} />

								{mismoRol('empresa') && oferta.idEmpresa == usuario?.id && (
									<Button
										variant="outlined"
										color="secondary"
										size="small"
										component={Link}
										to={`/ofertas/${oferta.id}/editar`}
										startIcon={<IconEdit size={18} />}
										sx={{ mt: 1 }}
									>
										Editar
									</Button>
								)}
							</>
						}
					/>
				))}
			</Stack>

			{paginatedData && paginatedData.ultima_pagina > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={paginatedData.ultima_pagina}
						page={pagina}
						onChange={handleCambioPagina}
						color="primary"
						size="large"
					/>
				</Box>
			)}
		</Box>
	)
}
