import { Box, Button, Checkbox, Paper, Stack, TextField, Typography } from '@mui/material'
import { IconDeviceFloppy, IconEyeCancel, IconTrash } from '@tabler/icons-react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

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

	const { control, handleSubmit } = useForm({
		defaultValues: {
			...oferta,
			numeroPuestos: +oferta.numeroPuestos,
			fechaPublicacion: oferta.fechaPublicacion.toISOString(),
		},
	})

	const mutation = useMutation({
		mutationFn: ofertasRepository.actualizar,
		onSuccess: () => console.log('Datos actualizados correctamente'),
	})

	const onSubmit = (data) => {
		mutation.mutate(data)
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
									<TextField {...field} fullWidth label="Nombre" />
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
										label="Tipo de contrato"
										type="text"
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="horario"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Horario" type="text" />
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
