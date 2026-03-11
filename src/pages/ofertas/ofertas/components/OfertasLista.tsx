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
	IconUsers,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'

import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import LimiteAccesoRestringido from '@/shared/components/error/LimiteAccesoRestringido'
import EmptyState from '@/shared/components/feedback/EmptyState'
import Tarjeta from '@/shared/components/tarjetas/Tarjeta'
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
	filtroFrontend?: string
	inscrito?: string
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
	filtroFrontend,
	inscrito,
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
						inscrito={inscrito}
						filtroFrontend={filtroFrontend}
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
	search = '',
	ordenarPor,
	idFamilia,
	inscrito,
	filtroFrontend,
}: OfertasListaProps) => {
	const { usuario, mismoRol } = useRol()
	const [searchParams, setSearchParams] = useSearchParams()
	const pagina = Number(searchParams.get('pagina')) || 1

	const setPage = (nuevaPagina: number) => {
		searchParams.set('pagina', nuevaPagina.toString())
		setSearchParams(searchParams, { replace: true })
	}

	const [busquedaDebounce] = useDebounce(search, 500)

	useEffect(() => {
		setPage(1)
	}, [])

	const { data: paginatedData, isLoading } = useOfertasQuery({
		filtro,
		search: busquedaDebounce,
		idEmpresa: idEmpresa?.toString(),
		estado,
		ordenarPor: ordenarPor ?? 'fecha_publicacion.desc',
		idFamilia,
		pagina,
		inscrito,
	})

	const allOfertas = paginatedData?.data || []

	const ofertas = filtroFrontend
		? allOfertas.filter(
			(o) =>
				o.nombre.toLowerCase().includes(filtroFrontend.toLowerCase()) ||
				o.empresa?.nombre
					.toLowerCase()
					.includes(filtroFrontend.toLowerCase()) ||
				o.obs?.toLowerCase().includes(filtroFrontend.toLowerCase())
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
					<Tarjeta
						key={oferta.id}
						titulo={oferta.nombre}
						etiquetas={
							<Box sx={{ display: 'flex', gap: 1 }}>
								<Chip
									label={oferta.abierta ? 'Activa' : 'Finalizada'}
									color={oferta.abierta ? 'success' : 'default'}
									size="small"
									variant="outlined"
								/>
								{mismoRol('demandante') && oferta.inscrito && (
									<Chip
										label="Inscrito"
										color="primary"
										size="small"
									/>
								)}
							</Box>
						}
						avatar={
							<Avatar
								src={oferta.empresa?.imagenUrl || undefined}
								sx={{ width: 48, height: 48 }}
								variant="rounded"
							>
								{oferta.empresa?.nombre?.charAt(0)}
							</Avatar>
						}
						subtitulo={
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
						detalles={[
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconClock size={16} />
								<Typography variant="body2" color="text.secondary">
									{(oferta.tipoContrato as any)?.nombre ||
										oferta.tipoContrato ||
										'N/D'}{' '}
									• {oferta.horario}
								</Typography>
							</Box>,
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconCalendar size={16} />
								<Typography variant="body2" color="text.secondary">
									Hasta: {formatearFecha(oferta.fechaCierre)}
								</Typography>
							</Box>,
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<IconUsers size={16} />
								<Typography variant="body2" color="text.secondary">
									{oferta.demandantesInscritos} inscritos /{' '}
									{oferta.numeroPuestos} vacantes
								</Typography>
							</Box>,
						]}
						acciones={
							<>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ mb: 1, mr: 2 }}
								>
									Publicada: {formatearFecha(oferta.fechaPublicacion)}
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

			{paginatedData && paginatedData.ultimaPagina > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={paginatedData.ultimaPagina}
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
