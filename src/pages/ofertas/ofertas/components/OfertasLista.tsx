import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { Link } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'
import { IconEdit, IconEye } from '@tabler/icons-react'

export default function OfertasLista({ filtro }) {
	return (
		<Stack spacing={3}>
			<Suspense fallback={<div>Cargando...</div>}>
				<OfertasListaSuspense filtro={filtro} />
			</Suspense>
		</Stack>
	)
}

const OfertasListaSuspense = ({ filtro }) => {
	const { mismoRol } = useRol()

	const ofertasRepository = OfertasRepositoryHttp
	const ofertasDemandanteRepository = OfertasDemandanteRepositoryHttp

	const { data: ofertas = [] } = useSuspenseQuery({
		queryKey: ['ofertas', filtro],
		queryFn: () => {
			if (filtro === 'demandante') {
				return ofertasRepository.obtenerPorDemandante()
			} else if (filtro === 'empresa') {
				return ofertasRepository.obtenerPorEmpresa()
			} else {
				return ofertasRepository.obtener()
			}
		},
	})

	const queryClient = useQueryClient()

	const mutate = useMutation({
		mutationFn: ofertasDemandanteRepository.registrarJWT,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['ofertas', filtro] })
		},
	})

	if (ofertas.length === 0) {
		return <Typography>No hay ofertas</Typography>
	}

	return ofertas.map((oferta) => {
		return (
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
									{oferta.tipoContrato}
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
									{oferta.abierta ? 'Yes' : 'No'}
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

							{mismoRol('sinRol') && (
								<Tooltip title="Debes iniciar sesión para inscribirte">
									<Button
										variant="outlined"
										color="primary"
										sx={{ marginTop: 2 }}
										component={Link}
										to="/login"
									>
										Inscribirme
									</Button>
								</Tooltip>
							)}
							{mismoRol('demandante') && (
								<Button
									variant="outlined"
									color="primary"
									sx={{ marginTop: 2 }}
									disabled={oferta.inscrito}
									onClick={() => {
										mutate.mutate(oferta.id)
									}}
								>
									{oferta.inscrito ? 'Inscrito' : 'Inscribirme'}
								</Button>
							)}
							{mismoRol('empresa') && (
								<Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
									<Button
										variant="outlined"
										color="primary"
										component={Link}
										to={`/ofertas/${oferta.id}/editar`}
										startIcon={<IconEdit />}
									>
										Editar
									</Button>
								</Box>
							)}
							<Link to={`/ofertas/${oferta.id}`}>
								<Button
									variant="outlined"
									color="primary"
									sx={{ marginTop: 2 }}
									startIcon={<IconEye />}
								>
									Ver detalles
								</Button>
							</Link>
						</Box>
					</Box>
				</CardContent>
			</Card>
		)
	})
}
