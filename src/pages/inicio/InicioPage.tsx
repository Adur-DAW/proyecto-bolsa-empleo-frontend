import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Typography,
} from '@mui/material'
import { IconArrowRight } from '@tabler/icons-react'
import { Link } from 'react-router'

const opiniones = [
	{
		nombre: 'Laura Martínez',
		posicion: 'Desarrolladora Web',
		empresa: 'Google',
		texto:
			'Gracias a este portal encontré mi trabajo ideal en menos de dos semanas. El proceso fue muy sencillo y la interfaz muy intuitiva.',
	},
	{
		nombre: 'Carlos Rodríguez',
		posicion: 'Marketing Manager',
		empresa: 'Meta',
		texto:
			'Después de meses buscando trabajo, esta página me conectó con empresas que realmente se alineaban con mis habilidades y expectativas.',
	},
	{
		nombre: 'Ana Gómez',
		posicion: 'Diseñadora Gráfica',
		empresa: 'Amazon',
		texto:
			'La variedad de ofertas es impresionante. Encontré una oportunidad que nunca hubiera imaginado. ¡Recomiendo esta plataforma al 100%!',
	},
	{
		nombre: 'Luis Pérez',
		posicion: 'Ingeniero de Datos',
		empresa: 'Microsoft',
		texto:
			'El proceso de aplicación es muy fácil y rápido. Además, el soporte al cliente es excepcional. ¡Estoy muy satisfecho con mi experiencia!',
	},
]

const ofertas = [
	{
		titulo: 'Desarrollador Frontend',
		empresa: 'Google',
		descripcion:
			'Buscamos un desarrollador frontend con experiencia en React y TypeScript.',
	},
	{
		titulo: 'Analista de Datos',
		empresa: 'Meta',
		descripcion:
			'Se necesita analista de datos con conocimientos en SQL y Python para unirse a nuestro equipo.',
	},
	{
		titulo: 'Diseñador UX/UI',
		empresa: 'Amazon',
		descripcion:
			'Estamos buscando un diseñador UX/UI con experiencia en herramientas como Figma y Adobe XD.',
	},
]

export default function InicioPage() {
	return (
		<Container sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
			<Box sx={{ marginTop: 4, marginBottom: 6 }}>
				<Typography variant="h4" gutterBottom>
					Bienvenido a la Bolsa de Empleo
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Encuentra las mejores ofertas de empleo, conecta con empresas y
					descubre nuevas oportunidades para tu carrera profesional.
				</Typography>

				<Link to={'/ofertas'} style={{ textDecoration: 'none' }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						sx={{ marginTop: 2, fontSize: 16 }}
						endIcon={<IconArrowRight />}
					>
						Ver Ofertas
					</Button>
				</Link>
			</Box>

			<Box sx={{ marginBottom: 6 }}>
				<Typography variant="h5" gutterBottom>
					Ofertas destacadas
				</Typography>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: '1fr 1fr',
							md: '1fr 1fr 1fr',
						},
						gap: 4,
					}}
				>
					{ofertas.map((oferta, index) => (
						<Card key={index} sx={{ boxShadow: 2 }}>
							<CardContent sx={{ textAlign: 'justify' }}>
								<Typography variant="h6" gutterBottom>
									{oferta.titulo}
								</Typography>
								<Typography
									variant="subtitle1"
									color="text.secondary"
									gutterBottom
								>
									{oferta.empresa}
								</Typography>
								<Typography color="text.secondary">
									{oferta.descripcion}
								</Typography>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>

			<Box>
				<Typography variant="h5" gutterBottom>
					Opiniones de nuestros usuarios
				</Typography>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: '1fr 1fr',
							md: '1fr 1fr',
						},
						gap: 4,
					}}
				>
					{opiniones.map((opinion, index) => (
						<Card key={index} sx={{ boxShadow: 2 }}>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'flex-start',
										alignItems: 'center',
										marginBottom: 2,
									}}
								>
									<Avatar sx={{ marginRight: 2 }}>
										{opinion.nombre.charAt(0) +
											opinion.nombre.charAt(opinion.nombre.length)}
									</Avatar>
									<Typography variant="subtitle1">{opinion.nombre}</Typography>
								</Box>
								<Typography color="text.secondary" textAlign={'left'}>
									{opinion.posicion} - {opinion.empresa}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									textAlign={'left'}
								>
									{opinion.texto}
								</Typography>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>
		</Container>
	)
}
