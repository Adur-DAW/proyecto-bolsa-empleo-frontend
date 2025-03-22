import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import { getAbsolutePath } from '@/shared/routes'

import useLogin from '../shared/hooks/useLogin'

const LoginPage = () => {
	const { login } = useLogin()

	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: login,
		onSuccess: () => navigate('/'),
		onError: (error) => {
			alert('Error en login: ' + error.message)
		},
	})

	const onSubmit = (data) => {
		mutation.mutate(data)
	}

	return (
		<Container maxWidth="xs">
			<Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
				<Typography variant="h5" gutterBottom>
					Iniciar Sesión
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						label="Email"
						fullWidth
						margin="normal"
						{...register('email', { required: 'El email es obligatorio' })}
						error={!!errors.email}
						helperText={errors.email?.message?.toString()}
					/>
					<TextField
						label="Contraseña"
						type="password"
						fullWidth
						margin="normal"
						{...register('password', {
							required: 'La contraseña es obligatoria',
						})}
						error={!!errors.password}
						helperText={errors.password?.message?.toString()}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{ mt: 2 }}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
					</Button>
				</form>
			</Box>

			<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
				¿No tienes cuenta? &nbsp;
				<Link
					to={getAbsolutePath('registro')}
					style={{ color: 'black', fontWeight: 'bold' }}
				>
					Registrate
				</Link>
			</Box>
		</Container>
	)
}

export default LoginPage
