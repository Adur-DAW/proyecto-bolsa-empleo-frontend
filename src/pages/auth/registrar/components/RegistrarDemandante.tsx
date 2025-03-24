import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'

const demandanteSchema = z
	.object({
		rol: z.literal('demandante'),
		email: z.string().email('El email no es válido'),
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres'),
		verificarPassword: z
			.string()
			.min(8, 'La confirmación de contraseña es obligatoria'),
		nombre: z.string().nonempty('El nombre es obligatorio'),
		apellido1: z.string().nonempty('El primer apellido es obligatorio'),
		apellido2: z.string().optional(),
		dni: z.string().regex(/^\d{8}[A-Za-z]$/, 'El DNI no es válido'),
		telefonoMovil: z
			.string()
			.regex(/^\d{9}$/, 'El teléfono móvil debe tener 9 dígitos'),
		situacion: z.number(),
	})
	.refine((data) => data.password === data.verificarPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['verificarPassword'],
	})

type DemandanteFormData = z.infer<typeof demandanteSchema>

export default function RegistrarDemandante() {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm<DemandanteFormData>({
		resolver: zodResolver(demandanteSchema),
		defaultValues: {
			rol: 'demandante',
			email: '',
			password: '',
			verificarPassword: '',
			nombre: '',
			apellido1: '',
			apellido2: '',
			dni: '',
			telefonoMovil: '',
			situacion: 0,
		},
		mode: 'onBlur',
	})

	const navigate = useNavigate()
	const authRepository = AuthRepositoryHttp

	const mutation = useMutation({
		mutationFn: authRepository.registrar,
		onSuccess: () => navigate('/login'),
		onError: (error) => {
			try {
				const { errors } = JSON.parse(error.message)

        if (errors?.email) {
          setError('email', { type: 'server', message: errors?.email[0] })
        }
				if (errors?.dni) {
          setError('dni', { type: 'server', message: errors?.dni[0] })
        }
      } catch {
        alert('Error inesperado en el servidor')
      }
		},
	})

	const onSubmit = (data) => {
		mutation.mutate({
			email: data.email,
			password: data.password,
			password_confirmation: data.verificarPassword,
			telefono_movil: data.telefonoMovil,
			...data,
		})
	}

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						autoComplete="email"
						label="Email"
						fullWidth
						margin="normal"
						error={!!errors.email}
						helperText={errors.email?.message}
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						autoComplete="password"
						label="Contraseña"
						type="password"
						fullWidth
						margin="normal"
						error={!!errors.password}
						helperText={errors.password?.message}
					/>
				)}
			/>
			<Controller
				name="verificarPassword"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						autoComplete="password"
						label="Verificar contraseña"
						type="password"
						fullWidth
						margin="normal"
						error={!!errors.verificarPassword}
						helperText={errors.verificarPassword?.message}
					/>
				)}
			/>
			<Controller
				name="nombre"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Nombre"
						fullWidth
						margin="normal"
						error={!!errors.nombre}
						helperText={errors.nombre?.message}
					/>
				)}
			/>
			<Controller
				name="apellido1"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Primer apellido"
						fullWidth
						margin="normal"
						error={!!errors.apellido1}
						helperText={errors.apellido1?.message}
					/>
				)}
			/>
			<Controller
				name="apellido2"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Segundo apellido"
						fullWidth
						margin="normal"
						error={!!errors.apellido2}
						helperText={errors.apellido2?.message}
					/>
				)}
			/>
			<Controller
				name="dni"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="DNI"
						fullWidth
						margin="normal"
						error={!!errors.dni}
						helperText={errors.dni?.message}
					/>
				)}
			/>
			<Controller
				name="telefonoMovil"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Teléfono móvil"
						fullWidth
						margin="normal"
						error={!!errors.telefonoMovil}
						helperText={errors.telefonoMovil?.message}
					/>
				)}
			/>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{ mt: 2 }}
				disabled={!isValid || mutation.isPending}
			>
				{mutation.isPending ? 'Registrando...' : 'Registrar'}
			</Button>
		</Box>
	)
}
