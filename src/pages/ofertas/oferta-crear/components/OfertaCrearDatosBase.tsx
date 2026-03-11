import {
	Box,
	Button,
	MenuItem,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { IconPlus } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import { ofertaDefault } from '@/shared/models'
import {
	MaestrosRepository,
} from '@/shared/repositories/MaestrosRepository'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ofertaSchema = z.object({
	nombre: z.string().nonempty('El título es obligatorio'),
	fechaPublicacion: z.string(),
	numeroPuestos: z.coerce.number().min(1, 'Debe haber al menos un puesto'),
	idTipoContrato: z.number('El tipo de contrato es obligatorio'),
	horario: z.string().nullable().optional(),
	diasDescanso: z.coerce.string().nullable().optional(),
	obs: z.string().nullable().optional(),
	abierta: z.boolean(),
	fechaCierre: z.string().nullable().optional(),
	readme: z.string().nullable().optional(),
})

type OfertaFormData = z.infer<typeof ofertaSchema>

export default function OfertaCrearDatosBase() {
	return (
		<Suspense fallback={<div>Cargando oferta...</div>}>
			<OfertaEditarDatosBaseInterno />
		</Suspense>
	)
}

const OfertaEditarDatosBaseInterno = () => {
	const ofertasRepository = OfertasRepositoryHttp

	const { data: tiposContrato = [] } = useQuery({
		queryKey: ['tipos-contrato'],
		queryFn: () => MaestrosRepository.obtenerTiposContrato(),
	})

	const { control, handleSubmit, formState: { errors }, } = useForm<OfertaFormData>({
		defaultValues: {
			...ofertaDefault,
			fechaPublicacion: dayjs().format('YYYY-MM-DD'),
			idTipoContrato: undefined,
			fechaCierre: ''
		},
		resolver: zodResolver(ofertaSchema) as any,
		mode: 'onSubmit'
	})

	const navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: ofertasRepository.registrar,
		onSuccess: ({ oferta }) => navigate(`/ofertas/${oferta.id}/editar`),
	})

	const onSubmit = (data) => {
		mutation.mutate({
			...data,
			idTipoContrato: data.idTipoContrato,
			fechaCierre: data.fechaCierre ? dayjs(data.fechaCierre) : null
		})
	}

	return (
		<Box sx={{ padding: 4 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="h5" gutterBottom>
					Datos oferta
				</Typography>
			</Box>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4, textAlign: 'left' }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={3}>
						<Box>
							<Controller
								name="nombre"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Título de la oferta"
										error={!!errors.nombre}
										helperText={errors.nombre?.message} />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="fechaPublicacion"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Fecha publicación"
										type="date"
										value={
											field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
										}
										slotProps={{ inputLabel: { shrink: true } }}
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="fechaCierre"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Fecha cierre"
										type="date"
										value={
											field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
										}
										slotProps={{ inputLabel: { shrink: true } }}
										error={!!errors.fechaCierre}
										helperText={errors.fechaCierre?.message}
									/>
								)}
							/>
						</Box>
						<Box>
							<Controller
								name="numeroPuestos"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										type="number"
										fullWidth
										label="Número de puestos"
										error={!!errors.numeroPuestos}
										helperText={errors.numeroPuestos?.message}
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="idTipoContrato"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										select
										label="Tipo de contrato"
										value={field.value || ''}
										error={!!errors.idTipoContrato}
										helperText={errors.idTipoContrato?.message}
									>
										{tiposContrato.map((option) => (
											<MenuItem key={option.id} value={option.id}>
												{option.nombre}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="horario"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Horario" type="text"
										error={!!errors.horario}
										helperText={errors.horario?.message} />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="diasDescanso"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Días de descanso semanal"
										type="text"
										error={!!errors.diasDescanso}
										helperText={errors.diasDescanso?.message}
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="obs"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Observaciones"
										type="text"
										error={!!errors.obs}
										helperText={errors.obs?.message}
									/>
								)}
							/>
						</Box>

						<Box>
							<Typography variant="body2" color="text.secondary" gutterBottom>
								Descripción completa
							</Typography>
							<Controller
								name="readme"
								control={control}
								render={({ field }) => (
									<ReactQuill
										theme="snow"
										value={field.value || ''}
										onChange={field.onChange}
										style={{ height: '300px', marginBottom: '50px' }}
									/>
								)}
							/>
						</Box>

						<Box>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={mutation.isPending}
								startIcon={<IconPlus />}
							>
								{mutation.isPending ? 'Creando...' : 'Crear'}
							</Button>
						</Box>
					</Stack>
				</form>
			</Paper>
		</Box >
	)
}
