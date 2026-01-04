import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Checkbox, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { IconDeviceFloppy, IconEyeCancel, IconTrash } from '@tabler/icons-react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { z } from 'zod'

import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

const ofertaSchema = z.object({
	nombre: z.string().nonempty('El título es obligatorio'),
	fechaPublicacion: z.string(),
	numeroPuestos: z.coerce.number().min(1, 'Debe haber al menos un puesto'),
	tipoContrato: z.string().nonempty('El tipo de contrato es obligatorio'),
	horario: z.string().optional(),
	diasDescanso: z.coerce.number().optional(),
	obs: z.string().optional(),
	abierta: z.boolean(),
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
			fechaPublicacion: oferta.fechaPublicacion.toISOString(),
		},
	})

	const mutation = useMutation({
		mutationFn: ofertasRepository.actualizar,
		onSuccess: () => console.log('Datos actualizados correctamente'),
		onError: (error) => {
			try {
				const { errors } = JSON.parse(error.message)
				if (errors) {
					Object.keys(errors).forEach((key) => {
						setError(key as any, { type: 'server', message: errors[key][0] })
					})
				} else {
					alert('Error al actualizar la oferta')
				}
			} catch {
				alert('Error inesperado al actualizar')
			}
		},
	})

	const onSubmit = (data) => {
		// Ensure correct types for backend
		const payload = {
			...oferta,
			...data,
			diasDescanso: data.diasDescanso?.toString() || '',
			fechaPublicacion: dayjs(data.fechaPublicacion)
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
					<Button variant="outlined" color="error" startIcon={<IconTrash />}>
						Eliminar
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						startIcon={<IconEyeCancel />}
					>
						Cerrar
					</Button>
				</Stack>
			</Box>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
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
								name="tipoContrato"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										select
										label="Tipo de contrato"
										error={!!errors.tipoContrato}
										helperText={errors.tipoContrato?.message}
									>
										<MenuItem value="Jornada completa">Jornada completa</MenuItem>
										<MenuItem value="Jornada parcial">Jornada parcial</MenuItem>
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
							<Controller
								name="abierta"
								control={control}
								render={({ field }) => (
									<Stack direction="row" alignItems="center" spacing={1}>
										<Typography>Activa</Typography>
										<Checkbox
											{...field}
											checked={field.value}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
									</Stack>
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
