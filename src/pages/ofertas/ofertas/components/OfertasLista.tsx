import {
	Box,
	Button,
	Stack,
	Typography,
	Chip,
	Avatar,
	Pagination
} from '@mui/material'
import { useState, useEffect } from 'react'
import { IconEdit, IconEye, IconBuilding, IconClock, IconCalendar } from '@tabler/icons-react'
import { Link } from 'react-router'
import LimiteAccesoRestringido from '@/shared/components/error/LimiteAccesoRestringido'
import EmptyState from '@/shared/components/feedback/EmptyState'

import InscribirseComponent from '@/pages/ofertas/shared/components/InscribirseComponent'
import useRol from '@/shared/hooks/rol.hook'
import { useDebounce } from '@/shared/hooks/useDebounce'
import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import EntityCard from '@/shared/components/cards/EntityCard'
import { useOfertasQuery } from '@/shared/hooks/useOfertasQuery'
import dayjs from 'dayjs'

interface OfertasListaProps {
	filtro?: string
	empresaId?: number
	estado?: string
	search?: string
	sortBy?: string
	familiaId?: string
	clientFilter?: string
}

export default function OfertasLista({ filtro, empresaId, estado, search, sortBy, familiaId, clientFilter }: OfertasListaProps) {
	return (
		<Stack spacing={3}>
			<LimiteAccesoRestringido>
				<PageDataContainer skeletonType="list">
					<OfertasListaSuspense
						filtro={filtro}
						empresaId={empresaId}
						estado={estado}
						search={search}
						sortBy={sortBy}
						familiaId={familiaId}
						clientFilter={clientFilter}
					/>
				</PageDataContainer>
			</LimiteAccesoRestringido>
		</Stack>
	)
}

const OfertasListaSuspense = ({ filtro, empresaId, estado, search, sortBy, familiaId, clientFilter }: OfertasListaProps) => {
	const { usuario, mismoRol } = useRol()
	const [page, setPage] = useState(1)

	// Fallback if not provided (e.g. in legacy usage)
	const effectiveSearch = search || ''
	const effectiveSortBy = sortBy || 'fecha_publicacion.desc'

	const [debouncedSearch] = useDebounce(effectiveSearch, 500)

	// Reset page when filters change
	useEffect(() => {
		setPage(1)
	}, [filtro, empresaId, estado, debouncedSearch, effectiveSortBy, familiaId])

	const {
		data: paginatedData,
		isLoading,
	} = useOfertasQuery({
		filtro,
		search: debouncedSearch,
		empresaId: empresaId?.toString(),
		estado,
		sortBy: effectiveSortBy,
		familiaId,
		page
	})

	const allOfertas = paginatedData?.data || []

	// Client-side filtering (if still needed, though backend search is preferred)
	const ofertas = clientFilter
		? allOfertas.filter(o =>
			o.nombre.toLowerCase().includes(clientFilter.toLowerCase()) ||
			o.empresa?.nombre.toLowerCase().includes(clientFilter.toLowerCase()) ||
			o.obs?.toLowerCase().includes(clientFilter.toLowerCase())
		)
		: allOfertas

	const formatDate = (date: dayjs.Dayjs) => {
		return date.isValid() ? date.format('DD/MM/YYYY') : 'N/D'
	}

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box>
			{/* Controls moved to OfertasFiltros */}

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
								style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
								onClick={(e) => e.stopPropagation()}
							>
								<IconBuilding size={16} />
								<Typography variant="body2" sx={{ '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
									{oferta.empresa?.nombre || 'Empresa desconocida'}
								</Typography>
							</Link>
						}
						details={[
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconClock size={16} color="var(--mui-palette-text-secondary)" />
								<Typography variant="body2" color="text.secondary">
									{(oferta.tipoContrato as any)?.nombre || oferta.tipoContrato || 'N/D'} • {oferta.horario}
								</Typography>
							</Box>,
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconCalendar size={16} color="var(--mui-palette-text-secondary)" />
								<Typography variant="body2" color="text.secondary">
									Hasta: {formatDate(oferta.fechaCierre)}
								</Typography>
							</Box>,
							<Typography variant="body2" color="text.secondary">
								{oferta.demandantesInscritos} inscritos / {oferta.numeroPuestos} vacantes
							</Typography>
						]}
						actions={
							<>
								<Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
									Publicado: {formatDate(oferta.fechaPublicacion)}
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

			{paginatedData && paginatedData.last_page > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={paginatedData.last_page}
						page={page}
						onChange={handlePageChange}
						color="primary"
						size="large"
					/>
				</Box>
			)}
		</Box>
	)
}
