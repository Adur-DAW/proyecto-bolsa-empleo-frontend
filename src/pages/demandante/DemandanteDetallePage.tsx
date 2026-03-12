import { Box, Card, CardContent, Grid, Typography, Stack, Divider, Paper } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { DemandantesRepositoryHttp } from '@/shared/repositories/demandantes/demandantes.repository.http'
import { situacionesDemandante } from '@/shared/models'
import { IconSchool, IconUser } from '@tabler/icons-react'

export default function DemandanteDetallePage() {
	const { id } = useParams()
	const demandanteRepository = DemandantesRepositoryHttp

	const { data: demandante } = useSuspenseQuery({
		queryKey: ['demandante', id],
		queryFn: () => demandanteRepository.obtenerPorId(Number(id)),
	})

	const situacion = situacionesDemandante.find(s => s.id === demandante.situacion)?.valor || 'No especificada'

	return (
		<Box sx={{ padding: 4 }}>
			<Typography variant="h4" gutterBottom>
				Perfil de Demandante
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card elevation={3}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Box
								component="img"
								src={demandante.imagenUrl || '/default-avatar.png'}
								sx={{ width: 150, height: 150, borderRadius: '50%', mb: 2, objectFit: 'cover', border: '2px solid #eee' }}
							/>
							<Typography variant="h5">{`${demandante.nombre} ${demandante.apellido1} ${demandante.apellido2}`}</Typography>
							<Typography color="textSecondary">{situacion}</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={8}>
					<Paper elevation={3} sx={{ p: 3, mb: 3 }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={2}>
							<IconUser size={24} />
							<Typography variant="h6">Información Personal</Typography>
						</Stack>
						<Divider sx={{ mb: 2 }} />
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">DNI</Typography>
								<Typography variant="body1">{demandante.dni}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">Email</Typography>
								<Typography variant="body1">{demandante.email}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">Teléfono</Typography>
								<Typography variant="body1">{demandante.telefonoMovil}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">Familia Profesional</Typography>
								<Typography variant="body1">{demandante.familiaProfesional?.nombre || 'No especificada'}</Typography>
							</Grid>
						</Grid>
					</Paper>

					<Paper elevation={3} sx={{ p: 3 }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={2}>
							<IconSchool size={24} />
							<Typography variant="h6">Titulaciones</Typography>
						</Stack>
						<Divider sx={{ mb: 2 }} />
						{demandante.titulos && demandante.titulos.length > 0 ? (
							<Stack spacing={2}>
								{demandante.titulos.map((t, index) => (
									<Box key={index} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
										<Typography variant="subtitle1" fontWeight="bold">
											{t.titulo?.nombre}
										</Typography>
										<Typography variant="body2" color="textSecondary">
											{t.centro} {t.año ? `(${t.año})` : ''} {t.cursando ? '- Cursando' : ''}
										</Typography>
									</Box>
								))}
							</Stack>
						) : (
							<Typography color="textSecondary">No hay titulaciones registradas.</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	)
}
