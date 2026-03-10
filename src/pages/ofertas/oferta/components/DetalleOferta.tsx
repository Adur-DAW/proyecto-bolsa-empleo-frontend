import { Avatar, Box, Card, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router'
import DOMPurify from 'dompurify'

import InscribirseComponent from '@/pages/ofertas/shared/components/InscribirseComponent'

export default function DetalleOferta({ oferta }) {
	return (
		<Card sx={{ padding: 2, boxShadow: 2 }}>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box sx={{ textAlign: 'left' }}>
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
							<Avatar
								src={oferta.empresa?.imagen_url || undefined}
								sx={{ width: 64, height: 64 }}
								variant="rounded"
							>
								{oferta.empresa?.nombre?.charAt(0)}
							</Avatar>
							<Typography variant="h6">
								{oferta.nombre}
							</Typography>
						</Box>
						<Box sx={{ marginBottom: 1 }}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								component="span"
							>
								Empresa:{' '}
							</Typography>
							<Link to={`/empresas/${oferta.idEmpresa}`} style={{ textDecoration: 'none', color: 'inherit' }}>
								<Typography variant="body2" component="span" sx={{ '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
									{oferta.empresa.nombre}
								</Typography>
							</Link>
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
								{oferta.tipoContrato?.nombre || oferta.tipoContrato || 'N/D'}
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
								{oferta.fechaCierre?.isValid() ? oferta.fechaCierre.format('DD/MM/YYYY') : 'Sin fecha de cierre'}
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

						{oferta.readme && (
							<Box sx={{ mt: 3, mb: 1 }}>
								<Typography variant="h6" gutterBottom>
									Detalles de la Oferta
								</Typography>
								<Box
									className="readme-content"
									sx={{
										padding: 2,
										backgroundColor: 'background.paper',
										borderRadius: 1,
										boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
									}}
									dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(oferta.readme) }}
								/>
							</Box>
						)}
					</Box>

					<Box>
						<InscribirseComponent oferta={oferta} />
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}
