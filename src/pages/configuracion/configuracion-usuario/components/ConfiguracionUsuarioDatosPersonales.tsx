import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { DemandantesRepositoryHttp } from '@/shared/repositories/demandantes/demandantes.repository.http'
import { situacionesDemandante } from '@/shared/models'

export default function ConfiguracionUsuarioDatosPersonales() {
	return (
		<Suspense fallback={<div>Cargando datos personales...</div>}>
			<ConfiguracionUsuarioDatosPersonalesInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioDatosPersonalesInterno = () => {
	const demandantesRepository = DemandantesRepositoryHttp

	const { data: demandante } = useSuspenseQuery({
		queryKey: ['demandante'],
		queryFn: () => demandantesRepository.obtenerJWT(),
	})

	const { control, handleSubmit } = useForm({
		defaultValues: {
			...demandante,
		},
	})

	const mutation = useMutation({
		mutationFn: demandantesRepository.actualizar,
		onSuccess: () => console.log('Datos actualizados correctamente'),
	})

	const onSubmit = (data) => {
		mutation.mutate(data, {
			onSuccess: () => {
				alert('Datos actualizados correctamente')
			},
			onError: () => {
				alert('Hubo un error al actualizar los datos')
			},
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
					Datos personales
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
									<TextField {...field} fullWidth label="Nombre completo" />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="apellido1"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Primer apellido"
										type="text"
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="apellido2"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Segundo apellido" />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Correo electrónico"
										type="email"
									/>
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="telefonoMovil"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Teléfono" type="tel" />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="situacion"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										select
										label="Situación"
										fullWidth
										variant="outlined"
									>
										{situacionesDemandante.map((x) => (
											<MenuItem key={x.id} value={x.id}>
												{x.valor}
											</MenuItem>
										))}
									</TextField>
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
