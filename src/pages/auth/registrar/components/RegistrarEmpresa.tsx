import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import { FormInputText } from '@/shared/components/form/FormInputText'
import { FormInputSelect } from '@/shared/components/form/FormInputSelect'

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
		familiaProfesionalId: z.number(),
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
		formState: { isValid },
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
				label="Nombre Empresa o Establecimiento"
				margin="normal"
			/>
			<FormInputText
				name="cif"
				control={control}
				label="CIF"
				margin="normal"
			/>
			<FormInputText
				name="localidad"
				control={control}
				label="Localidad"
				margin="normal"
			/>
			<FormInputText
				name="telefono"
				control={control}
				label="Teléfono"
				margin="normal"
			/>
			<Box sx={{ mt: 2 }}>
				<FormInputSelect
					name="familiaProfesionalId"
					control={control}
					label="Familia Profesional"
					options={familias.map(f => ({ id: f.id, label: f.nombre }))}
					margin="normal"
				/>
			</Box>
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
