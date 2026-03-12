import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Box, Button, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'

import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import SelectorTitulos from '@/shared/components/SelectorTitulos'
import { Titulo } from '@/shared/models'
import { FormInputText } from '@/shared/components/form/FormInputText'
import { FormInputSelect } from '@/shared/components/form/FormInputSelect'

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
		idFamiliaProfesional: z.number().optional(),
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
		formState: { errors },
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
			idFamiliaProfesional: undefined,
			titulos: [],
		},
		mode: 'onBlur',
	})

	const navigate = useNavigate()
	const authRepository = AuthRepositoryHttp
	const familiaSeleccionada = watch('idFamiliaProfesional')

	useEffect(() => {
		MaestrosRepository.obtenerFamilias().then(setFamilias)
	}, [])

	useEffect(() => {
		setValue('titulos', [])
	}, [familiaSeleccionada, setValue])

	const mutation = useMutation({
		mutationFn: (data: FormData) => authRepository.registrar(data as any),
		onSuccess: () => {
			toast.success('Cuenta creada correctamente. Ya puedes iniciar sesión.')
			navigate('/login')
		},
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
				toast.error('Error inesperado en el servidor')
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

		if (data.idFamiliaProfesional) {
			formData.append('id_familia_profesional', data.idFamiliaProfesional.toString());
		}

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
			<FormInputText
				name="email"
				control={control}
				label="Email"
				autoComplete="email"
				margin="normal"
			/>
			<FormInputText
				name="password"
				control={control}
				label="Contraseña"
				type="password"
				autoComplete="new-password"
				margin="normal"
			/>
			<FormInputText
				name="verificarPassword"
				control={control}
				label="Verificar contraseña"
				type="password"
				autoComplete="new-password"
				margin="normal"
			/>
			<FormInputText
				name="nombre"
				control={control}
				label="Nombre"
				margin="normal"
			/>
			<FormInputText
				name="apellido1"
				control={control}
				label="Primer apellido"
				margin="normal"
			/>
			<FormInputText
				name="apellido2"
				control={control}
				label="Segundo apellido"
				margin="normal"
			/>
			<FormInputText
				name="dni"
				control={control}
				label="DNI"
				margin="normal"
			/>
			<FormInputText
				name="telefonoMovil"
				control={control}
				label="Teléfono móvil"
				margin="normal"
			/>

			<Box sx={{ mt: 2 }}>
				<FormInputSelect
					name="idFamiliaProfesional"
					control={control}
					label="Familia Profesional (Filtro)"
					options={familias.map(f => ({ id: f.id, label: f.nombre }))}
					margin="normal"
				/>
			</Box>

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
