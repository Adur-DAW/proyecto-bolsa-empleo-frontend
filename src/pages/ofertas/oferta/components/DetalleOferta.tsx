import { Box, Card, CardContent, Typography } from '@mui/material'

import InscribirseComponent from '@/pages/ofertas/shared/components/InscribirseComponent'

export default function DetalleOferta({ oferta }) {
	return (
		<Card sx={{ padding: 2, boxShadow: 2 }}>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
								{oferta.demandantesInscritos} de {oferta.numeroPuestos} puestos
							</Typography>
						</Box>
					</Box>

					<Box>
						<InscribirseComponent oferta={oferta} filtro={null} />
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}
