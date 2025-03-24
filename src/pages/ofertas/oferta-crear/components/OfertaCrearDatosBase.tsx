import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'
import { ofertaDefault } from '@/shared/models'

export default function OfertaCrearDatosBase() {
	return (
		<Suspense fallback={<div>Cargando oferta...</div>}>
			<OfertaEditarDatosBaseInterno />
		</Suspense>
	)
}

const OfertaEditarDatosBaseInterno = () => {
	const ofertasRepository = OfertasRepositoryHttp

	const { control, handleSubmit } = useForm({
		defaultValues: {
			...ofertaDefault
		},
	})

	const mutation = useMutation({
		mutationFn: ofertasRepository.registrar,
		onSuccess: () => console.log('Oferta registrada correctamente'),
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
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={mutation.isPending}
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
