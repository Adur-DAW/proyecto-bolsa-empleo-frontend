import {
	Alert,
	Box,
	Button,
	Container,
	TextField,
	Typography,
} from '@mui/material'
import { IconCheck } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import { getAbsolutePath } from '@/shared/routes'

import useLogin from '../shared/hooks/useLogin'
import { useState } from 'react'

const LoginPage = () => {
	const { login } = useLogin()

	const navigate = useNavigate()

	const [ error, setError ] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError: setFormError,
	} = useForm()

	const mutation = useMutation({
		mutationFn: login,
		onSuccess: () => navigate('/'),
		onError: (errorString) => {
			try {
				const { error } = JSON.parse(errorString.message)
				setError(error)
			} catch {
				setError('Usuario o contraseña incorrectos')
				setFormError('email', { type: 'server' })
				setFormError('password', { type: 'server' })
			}
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

				{ error && <Alert icon={<IconCheck fontSize="inherit" />} severity="error">
					{ error }
				</Alert>}

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
