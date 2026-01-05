import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField, MenuItem, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'

import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import SelectorTitulos from '@/shared/components/SelectorTitulos'
import { Titulo } from '@/shared/models'

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
		familiaProfesionalId: z.number().optional(),
		cv: z.any().optional(),
		titulos: z.array(z.any()).min(1, 'Debe seleccionar al menos un título académico'),
	})
	.refine((data) => data.password === data.verificarPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['verificarPassword'],
	})

type DemandanteFormData = z.infer<typeof demandanteSchema>

export default function RegistrarDemandante() {
	const [familias, setFamilias] = useState<FamiliaProfesional[]>([])

	const {
		control,
		handleSubmit,
		setError,
		register,
		watch,
		setValue,
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
			familiaProfesionalId: undefined,
			titulos: [],
		},
		mode: 'onBlur',
	})

	const navigate = useNavigate()
	const authRepository = AuthRepositoryHttp
	const familiaSeleccionada = watch('familiaProfesionalId')

	useEffect(() => {
		MaestrosRepository.obtenerFamilias().then(setFamilias)
	}, [])

	const mutation = useMutation({
		mutationFn: (data: FormData) => authRepository.registrar(data as any),
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
		const formData = new FormData();
		formData.append('rol', data.rol);
		formData.append('email', data.email);
		formData.append('password', data.password);
		formData.append('password_confirmation', data.verificarPassword);
		formData.append('nombre', data.nombre);
		formData.append('apellido1', data.apellido1);
		formData.append('apellido2', data.apellido2 || '');
		formData.append('dni', data.dni);
		formData.append('telefono_movil', data.telefonoMovil);
		formData.append('situacion', data.situacion.toString());

		if (data.familiaProfesionalId) {
			formData.append('familia_profesional_id', data.familiaProfesionalId.toString());
		}

		// Enviar títulos
		if (data.titulos && data.titulos.length > 0) {
			data.titulos.forEach((titulo: Titulo, index) => {
				formData.append(`titulos[${index}]`, titulo.id.toString());
			});
		}

		if (data.cv && data.cv.length > 0) {
			formData.append('cv', data.cv[0]);
		}

		mutation.mutate(formData)
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

			<Controller
				name="familiaProfesionalId"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Familia Profesional (Filtro)"
						fullWidth
						margin="normal"
						error={!!errors.familiaProfesionalId}
						helperText="Selecciona una familia para filtrar los títulos (Opcional)"
						value={field.value || ''}
						onChange={(e) => {
							field.onChange(e)
							setValue('titulos', [])
						}}
					>
						{familias.map((option) => (
							<MenuItem key={option.id} value={option.id}>
								{option.nombre}
							</MenuItem>
						))}
					</TextField>
				)}
			/>

			<Box sx={{ mt: 2, mb: 1 }}>
				<Controller
					name="titulos"
					control={control}
					render={({ field }) => (
						<SelectorTitulos
							valor={field.value}
							alCambiar={field.onChange}
							error={!!errors.titulos}
							textoAyuda={errors.titulos?.message?.toString()}
							familiaFiltro={familiaSeleccionada}
						/>
					)}
				/>
			</Box>

			<Box sx={{ mt: 2, mb: 1 }}>
				<Typography variant="body1" gutterBottom>
					Adjuntar Currículum (PDF)
				</Typography>
				<input
					type="file"
					accept=".pdf"
					{...register('cv')}
				/>
			</Box>

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{ mt: 2 }}
				disabled={mutation.isPending}
			>
				{mutation.isPending ? 'Registrando...' : 'Registrar'}
			</Button>
		</Box>
	)
}
