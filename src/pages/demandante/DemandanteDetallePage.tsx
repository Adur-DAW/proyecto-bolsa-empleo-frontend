import { Box, Card, CardContent, Grid, Typography, Stack, Divider, Paper, Button as MuiButton } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { DemandantesRepositoryHttp } from '@/shared/repositories/demandantes/demandantes.repository.http'
import { situacionesDemandante } from '@/shared/models'
import { IconDownload, IconSchool, IconUser } from '@tabler/icons-react'
import { useAppStore } from '@/shared/store/store'
import { descargarArchivoSeguro } from '@/shared/utils/descargar-archivo-seguro'
import { AvatarSeguro } from '@/shared/components/media/AvatarSeguro'

export default function DemandanteDetallePage() {
	const { id } = useParams()
	const demandanteRepository = DemandantesRepositoryHttp
	const user = useAppStore(x => x.usuario)

	const { data: demandante } = useSuspenseQuery({
		queryKey: ['demandante', id],
		queryFn: () => demandanteRepository.obtenerPorId(Number(id)),
	})

	const situacion = situacionesDemandante.find(s => s.id === demandante.situacion)?.valor || 'No especificada'

	const canViewCv = user?.rol === 'centro' || user?.rol === 'empresa'

	const handleDescargarCv = () => {
		if (demandante.cvUrl) {
			descargarArchivoSeguro(demandante.cvUrl, `CV_${demandante.nombre}_${demandante.apellido1}.pdf`)
		}
	}

	return (
		<Box sx={{ padding: 4 }}>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card elevation={3}>
						<CardContent sx={{ textAlign: 'center' }}>
							<AvatarSeguro
								src={demandante.imagenUrl}
								sx={{
									width: 150,
									height: 150,
									mb: 2,
									mx: 'auto',
									fontSize: '3rem',
									bgcolor: 'primary.main',
									border: '4px solid #fff',
									boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
								}}
							>
								{demandante.nombre?.charAt(0)}
							</AvatarSeguro>
							<Typography variant="h5">{`${demandante.nombre} ${demandante.apellido1} ${demandante.apellido2}`}</Typography>
							<Typography color="textSecondary" gutterBottom>{situacion}</Typography>

							{canViewCv && demandante.cvPath && (
								<Box sx={{ mt: 2 }}>
									<MuiButton
										variant="contained"
										color="primary"
										startIcon={<IconDownload />}
										onClick={handleDescargarCv}
										fullWidth
									>
										Descargar CV
									</MuiButton>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 8 }}>
					<Paper elevation={3} sx={{ p: 3, mb: 3 }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={2}>
							<IconUser size={24} />
							<Typography variant="h6">Información Personal</Typography>
						</Stack>
						<Divider sx={{ mb: 2 }} />
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Typography variant="subtitle2" color="textSecondary">Email</Typography>
								<Typography variant="body1">{demandante.email}</Typography>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Typography variant="subtitle2" color="textSecondary">Teléfono</Typography>
								<Typography variant="body1">{demandante.telefonoMovil}</Typography>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Typography variant="subtitle2" color="textSecondary">Familia Profesional</Typography>
								<Typography variant="body1">{(demandante.familiaProfesional as any)?.nombre || 'No especificada'}</Typography>
							</Grid>
						</Grid>
					</Paper>

					<Paper elevation={3} sx={{ p: 3 }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={2}>
							<IconSchool size={24} />
							<Typography variant="h6">Títulos</Typography>
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
