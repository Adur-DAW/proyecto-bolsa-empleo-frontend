import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { getAbsolutePath } from '@/shared/routes'

const RegistroPage = () => {
	const authRepository = AuthRepositoryHttp

	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: authRepository.registrar,
		onSuccess: () => navigate('/login'),
		onError: (error) => {
			alert('Error en login: ' + error.message)
		},
	})

	const onSubmit = (data) => {
		mutation.mutate({
			email: data.email,
			password: data.password,
			password_confirmation: data.verificarPassword,
		})
	}

	return (
		<Container maxWidth="xs">
			<Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
				<Typography variant="h5" gutterBottom>
					Registro
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
					<TextField
						label="Verificar contraseña"
						type="password"
						fullWidth
						margin="normal"
						{...register('verificarPassword', {
							required: 'La confirmación de contraseña es obligatoria',
						})}
						error={!!errors.verificarPassword}
						helperText={errors.verificarPassword?.message?.toString()}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{ mt: 2 }}
						disabled={mutation.isPending}
					>
						{mutation.isPending ? 'Cargando...' : 'Registrar'}
					</Button>
				</form>
			</Box>

			<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
				¿Ya tienes cuenta? &nbsp;
				<Link
					to={getAbsolutePath('login')}
					style={{ color: 'black', fontWeight: 'bold' }}
				>
					Inicia sesión
				</Link>
			</Box>
		</Container>
	)
}

export default RegistroPage
