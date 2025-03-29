import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'

export default function ConfiguracionEmpresaDatos() {
	return (
		<Suspense fallback={<div>Cargando datos...</div>}>
			<ConfiguracionEmpresaDatosInterno />
		</Suspense>
	)
}

const ConfiguracionEmpresaDatosInterno = () => {
	const empresasRepository = EmpresasRepositoryHttp

	const { data: empresa } = useSuspenseQuery({
		queryKey: ['empresa'],
		queryFn: () => empresasRepository.obtenerJWT(),
	})

	const { control, handleSubmit } = useForm({
		defaultValues: {
			...empresa,
		},
	})

	const mutation = useMutation({
		mutationFn: empresasRepository.actualizar,
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
					Datos empresa
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
								name="cif"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="CIF" type="text" />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="localidad"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="localidad" type="text" />
								)}
							/>
						</Box>

						<Box>
							<Controller
								name="telefono"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Telefono" type="tel" />
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
