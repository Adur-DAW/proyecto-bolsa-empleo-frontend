import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Checkbox, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useParams } from 'react-router'
import { z } from 'zod'
import { MaestrosRepository, TipoContrato } from '@/shared/repositories/MaestrosRepository'

import { toast } from 'sonner'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

const ofertaSchema = z.object({
	nombre: z.string().nonempty('El título es obligatorio'),
	fechaPublicacion: z.string(),
	numeroPuestos: z.coerce.number().min(1, 'Debe haber al menos un puesto'),
	idTipoContrato: z.number('El tipo de contrato es obligatorio'),
	horario: z.string().nullable().optional(),
	diasDescanso: z.coerce.number().nullable().optional(),
	obs: z.string().nullable().optional(),
	abierta: z.boolean(),
	fechaCierre: z.string().nullable().optional(),
	readme: z.string().nullable().optional(),
})

type OfertaFormData = z.infer<typeof ofertaSchema>

export default function OfertaEditarDatosBase() {
	return (
		<Suspense fallback={<div>Cargando oferta...</div>}>
			<OfertaEditarDatosBaseInterno />
		</Suspense>
	)
}

const OfertaEditarDatosBaseInterno = () => {
	const { id } = useParams()
	if (!id) {
		throw new Error('No se ha proporcionado un ID')
	}

	const ofertasRepository = OfertasRepositoryHttp
	const [tiposContrato, setTiposContrato] = useState<TipoContrato[]>([])

	useEffect(() => {
		MaestrosRepository.obtenerTiposContrato().then(setTiposContrato)
	}, [])

	const { data: oferta } = useSuspenseQuery({
		queryKey: ['oferta', +id],
		queryFn: () => ofertasRepository.obtenerPorId(+id),
	})

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<OfertaFormData>({
		resolver: zodResolver(ofertaSchema) as any,
		defaultValues: {
			...oferta,
			numeroPuestos: +oferta.numeroPuestos,
			diasDescanso: oferta.diasDescanso ? +oferta.diasDescanso : 0,
			fechaPublicacion: (oferta.fechaPublicacion && dayjs(oferta.fechaPublicacion).isValid())
				? dayjs(oferta.fechaPublicacion).format('YYYY-MM-DD')
				: dayjs().format('YYYY-MM-DD'),
			idTipoContrato: oferta.idTipoContrato,
			horario: oferta.horario || '',
			obs: oferta.obs || '',
			fechaCierre: (oferta.fechaCierre && dayjs(oferta.fechaCierre).isValid())
				? dayjs(oferta.fechaCierre).format('YYYY-MM-DD')
				: '',
			readme: oferta.readme || ''
		},
	})


	const mutation = useMutation({
		mutationFn: ofertasRepository.actualizar,
		onSuccess: () => toast.success('Oferta actualizada con éxito'),
		onError: (error) => {
			try {
				const { errors } = JSON.parse(error.message)
				if (errors) {
					Object.keys(errors).forEach((key) => {
						setError(key as any, { type: 'server', message: errors[key][0] })
					})
				} else {
					toast.error('Error al actualizar la oferta')
				}
			} catch {
				toast.error('Error inesperado al actualizar')
			}
		},
	})

	const onSubmit = (data) => {
		const payload = {
			...oferta,
			...data,
			diasDescanso: data.diasDescanso?.toString() || '',
			fechaPublicacion: dayjs(data.fechaPublicacion),
			fechaCierre: data.fechaCierre ? dayjs(data.fechaCierre) : null
		}
		mutation.mutate(payload)
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

				<Stack spacing={2} direction="row" marginBottom={2}>
					<Controller
						name="abierta"
						control={control}
						render={({ field }) => (
							<Stack direction="row" alignItems="center">
								<Typography>Activa</Typography>
								<Checkbox
									{...field}
									checked={field.value}
									onChange={(e) => field.onChange(e.target.checked)}
								/>
							</Stack>
						)}
					/>

					<Button variant="outlined" color="error" startIcon={<IconTrash />}>
						Eliminar
					</Button>
				</Stack>
			</Box>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4, textAlign: 'left' }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={3}>
						<Box>
							<Controller
								name="nombre"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Título de la oferta"
										error={!!errors.nombre}
										helperText={errors.nombre?.message}
									/>
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
										slotProps={{ inputLabel: { shrink: true } }}
										label="Fecha publicación"
										type="date"
										value={
											field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
										}
										error={!!errors.fechaPublicacion}
										helperText={errors.fechaPublicacion?.message}
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
										slotProps={{ inputLabel: { shrink: true } }}
										label="Fecha cierre"
										type="date"
										value={
											field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
										}
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
										error={!!errors.idTipoContrato}
										helperText={errors.idTipoContrato?.message}
										value={field.value || ''}
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
									<TextField
										{...field}
										fullWidth
										label="Horario"
										type="text"
										error={!!errors.horario}
										helperText={errors.horario?.message}
									/>
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
										type="number"
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
								startIcon={<IconDeviceFloppy />}
							>
								{mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
							</Button>
						</Box>
					</Stack>
				</form>
			</Paper>
		</Box>
	)
}
