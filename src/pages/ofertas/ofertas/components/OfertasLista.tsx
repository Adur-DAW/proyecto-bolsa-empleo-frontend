import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Link } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

export default function OfertasLista() {
	return (
		<Stack spacing={3}>
			<Suspense fallback={<div>Cargando...</div>}>
				<OfertasListaSuspense />
			</Suspense>
		</Stack>
	)
}

const OfertasListaSuspense = () => {
	const { mismoRol } = useRol()

	const ofertasRepository = OfertasRepositoryHttp

	const { data: ofertas = [] } = useSuspenseQuery({
		queryKey: ['ofertas'],
		queryFn: () => ofertasRepository.obtener(),
	})

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

							{mismoRol('demandante') && (
								<Button
									variant="outlined"
									color="primary"
									sx={{ marginTop: 2 }}
								>
									Inscribirse
								</Button>
							)}
							{mismoRol('empresa') && (
								<Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
									<Button
										variant="outlined"
										color="primary"
										component={Link}
										to={`/ofertas/${oferta.id}/editar`}
									>
										Editar
									</Button>
								</Box>
							)}
						</Box>
					</Box>
				</CardContent>
			</Card>
		)
	})
}
