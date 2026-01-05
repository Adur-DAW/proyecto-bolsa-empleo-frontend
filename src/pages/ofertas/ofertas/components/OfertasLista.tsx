import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	TextField,
	Typography,
	CircularProgress
} from '@mui/material'
import { IconEdit, IconEye, IconSearch } from '@tabler/icons-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { Link } from 'react-router'
import LimiteAccesoRestringido from '@/shared/components/error/LimiteAccesoRestringido'

import InscribirseComponent from '@/pages/ofertas/shared/components/InscribirseComponent'

import useRol from '@/shared/hooks/rol.hook'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'
import { useDebounce } from '@/shared/hooks/useDebounce'

export default function OfertasLista({ filtro, empresaId, estado }: { filtro?: string; empresaId?: number; estado?: string }) {
	return (
		<Stack spacing={3}>
			<LimiteAccesoRestringido>
				<Suspense fallback={<div>Cargando...</div>}>
					<OfertasListaSuspense filtro={filtro} empresaId={empresaId} estado={estado} />
				</Suspense>
			</LimiteAccesoRestringido>
		</Stack>
	)
}

const OfertasListaSuspense = ({ filtro, empresaId, estado }: { filtro?: string; empresaId?: number; estado?: string }) => {
	const { usuario, mismoRol } = useRol()
	const [search, setSearch] = useState('')
	const [debouncedSearch] = useDebounce(search, 500)

	const ofertasRepository = OfertasRepositoryHttp

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['ofertas', filtro, debouncedSearch, empresaId, estado],
		queryFn: async ({ pageParam = 1 }) => {
			if (filtro === 'demandante') {
				const res = await ofertasRepository.obtenerPorDemandante()
				return { data: res, nextPage: null }
			} else if (filtro === 'empresa') {
				const res = await ofertasRepository.obtenerPorEmpresa()
				return { data: res, nextPage: null }
			} else {
				return ofertasRepository.obtener({
					page: pageParam as number,
					limit: 20,
					search: debouncedSearch,
					empresa_id: empresaId,
					estado: estado
				})
			}
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextPage,
	})

	const ofertas = data?.pages.flatMap((page) => page.data) || []

	return (
		<Box>
			{/* Buscador solo para lista general (si no es detalle de empresa) */}
			{!empresaId && !filtro && (
				<Box sx={{ mb: 3 }}>
					<TextField
						fullWidth
						label="Buscar ofertas..."
						placeholder="Puesto, descripción o empresa"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						InputProps={{
							startAdornment: <IconSearch size={20} style={{ marginRight: 8, opacity: 0.5 }} />,
						}}
					/>
				</Box>
			)}

			{isLoading && <CircularProgress />}

			{ofertas.length === 0 && !isLoading && (
				<Typography align="center" color="text.secondary">No se encontraron ofertas.</Typography>
			)}

			<Stack spacing={2}>
				{ofertas.map((oferta) => (
					<Card key={oferta.id} sx={{ padding: 2, boxShadow: 2 }}>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'flex-start',
								}}
							>
								<Box sx={{ textAlign: 'left' }}>
									<Typography variant="h6" sx={{ marginBottom: 2 }}>
										{oferta.nombre}
									</Typography>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Empresa:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.empresa.nombre}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Tipo de contrato:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{(typeof oferta.tipoContrato === 'object' ? oferta.tipoContrato?.nombre : oferta.tipoContrato) || 'N/D'}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Horario:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.horario}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Activa:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.abierta ? 'Si' : 'No'}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Fin de la oferta:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.fechaCierre.format('DD/MM/YYYY')}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Cantidad puestos:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.numeroPuestos}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Observaciones:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.obs}
										</Typography>
									</Box>
									<Box sx={{ marginBottom: 1 }}>
										<Typography
											variant="subtitle2"
											color="text.secondary"
											component="span"
										>
											Inscritos:{' '}
										</Typography>
										<Typography variant="body2" component="span">
											{oferta.demandantesInscritos} de {oferta.numeroPuestos}{' '}
											puestos
										</Typography>
									</Box>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-end',
									}}
								>
									<Typography variant="caption" color="text.secondary">
										Publicado el: {oferta.fechaPublicacion.format('DD/MM/YYYY')}
									</Typography>

									<Link to={`/ofertas/${oferta.id}`}>
										<Button
											variant="contained"
											color="primary"
											sx={{ marginTop: 2 }}
											startIcon={<IconEye />}
										>
											Ver detalles
										</Button>
									</Link>

									<InscribirseComponent oferta={oferta} filtro={filtro} />

									{mismoRol('empresa') && oferta.idEmpresa == usuario?.id && (
										<Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
											<Button
												variant="outlined"
												color="secondary"
												component={Link}
												to={`/ofertas/${oferta.id}/editar`}
												startIcon={<IconEdit />}
											>
												Editar
											</Button>
										</Box>
									)}
								</Box>
							</Box>
						</CardContent>
					</Card>
				))}
			</Stack>

			{hasNextPage && (
				<Box sx={{ mt: 4, textAlign: 'center' }}>
					<Button
						variant="outlined"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Cargando más...' : 'Cargar más ofertas'}
					</Button>
				</Box>
			)}
		</Box>
	)
}
