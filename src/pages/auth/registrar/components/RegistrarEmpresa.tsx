import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField, MenuItem } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'

const empresaSchema = z
	.object({
		rol: z.literal('empresa'),
		email: z.string().email('El email no es válido'),
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres'),
		verificarPassword: z
			.string()
			.min(8, 'La confirmación de contraseña es obligatoria'),
		nombre: z.string().nonempty('El nombre es obligatorio'),
		cif: z.string().regex(/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/, 'El CIF no es válido'),
		localidad: z.string().nonempty('La localidad es obligatoria'),
		telefono: z.string().regex(/^\d{9}$/, 'El teléfono debe tener 9 dígitos'),
		familiaProfesionalId: z.number({ invalid_type_error: 'La familia profesional es obligatoria' }),
	})
	.refine((data) => data.password === data.verificarPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['verificarPassword'],
	})

type EmpresaFormData = z.infer<typeof empresaSchema>

export default function RegistrarEmpresa() {
	const [familias, setFamilias] = useState<FamiliaProfesional[]>([])

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<EmpresaFormData>({
		resolver: zodResolver(empresaSchema),
		defaultValues: {
			rol: 'empresa',
			email: '',
			password: '',
			verificarPassword: '',
			nombre: '',
			cif: '',
			localidad: '',
			telefono: '',
			familiaProfesionalId: undefined,
		},
		mode: 'onBlur',
	})

	const navigate = useNavigate()
	const authRepository = AuthRepositoryHttp

	useEffect(() => {
		MaestrosRepository.obtenerFamilias().then(setFamilias)
	}, [])

	const mutation = useMutation({
		mutationFn: authRepository.registrar,
		onSuccess: () => navigate('/login'),
		onError: (error) => {
			try {
				const { errors } = JSON.parse(error.message)

				if (errors?.email) {
					setError('email', { type: 'server', message: errors.email[0] })
				}
				if (errors?.cif) {
					setError('cif', { type: 'server', message: errors.cif[0] })
				}
			} catch (e) {
				console.log(e)
				alert('Error inesperado en el servidor')
			}
		},
	})

	const onSubmit = (data) => {
		mutation.mutate({
			email: data.email,
			password: data.password,
			password_confirmation: data.verificarPassword,
			familia_profesional_id: data.familiaProfesionalId,
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
						label="Nombre Empresa o Establecimiento"
						fullWidth
						margin="normal"
						error={!!errors.nombre}
						helperText={errors.nombre?.message}
					/>
				)}
			/>
			<Controller
				name="cif"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="CIF"
						fullWidth
						margin="normal"
						error={!!errors.cif}
						helperText={errors.cif?.message}
					/>
				)}
			/>
			<Controller
				name="localidad"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Localidad"
						fullWidth
						margin="normal"
						error={!!errors.localidad}
						helperText={errors.localidad?.message}
					/>
				)}
			/>
			<Controller
				name="telefono"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Teléfono"
						fullWidth
						margin="normal"
						error={!!errors.telefono}
						helperText={errors.telefono?.message}
					/>
				)}
			/>
			<Controller
				name="familiaProfesionalId"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Familia Profesional"
						fullWidth
						margin="normal"
						error={!!errors.familiaProfesionalId}
						helperText={errors.familiaProfesionalId?.message}
						value={field.value || ''}
					>
						{familias.map((option) => (
							<MenuItem key={option.id} value={option.id}>
								{option.nombre}
							</MenuItem>
						))}
					</TextField>
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
