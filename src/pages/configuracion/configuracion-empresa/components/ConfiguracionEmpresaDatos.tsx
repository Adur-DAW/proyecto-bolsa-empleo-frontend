import {
	Avatar,
	Box,
	Button,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'

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
	const queryClient = useQueryClient()
	const [selectedFile, setArchivoSeleccionado] = useState<File | null>(null)
	const [urlPrevisualizacion, setUrlPrevisualizacion] = useState<string | null>(null)

	const { data: empresa } = useSuspenseQuery({
		queryKey: ['usuario-perfil'],
		queryFn: () => empresasRepository.obtenerJWT(),
	})

	if (empresa.imagenUrl && !urlPrevisualizacion && !selectedFile) {
		setUrlPrevisualizacion(empresa.imagenUrl)
	}

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
		let payload: any = data

		if (selectedFile) {
			const formData = new FormData()
			formData.append('cif', data.cif)
			formData.append('nombre', data.nombre)
			formData.append('localidad', data.localidad)
			formData.append('telefono', data.telefono)
			if (data.id_familia_profesional) {
				formData.append('id_familia_profesional', data.id_familia_profesional)
			}
			formData.append('imagen', selectedFile)
			payload = formData
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['usuario-perfil'] })
				alert('Datos actualizados correctamente')
			},
			onError: () => {
				alert('Hubo un error al actualizar los datos')
			},
		})
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setArchivoSeleccionado(file)
			setUrlPrevisualizacion(URL.createObjectURL(file))
		}
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
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 2,
							}}
						>
							<Avatar
								src={urlPrevisualizacion || undefined}
								sx={{ width: 100, height: 100, fontSize: 40 }}
								variant="rounded"
							>
								{empresa.nombre?.charAt(0)}
							</Avatar>
							<Button variant="outlined" component="label">
								Subir Logo
								<input
									type="file"
									hidden
									accept="image/*"
									onChange={handleFileChange}
								/>
							</Button>
						</Box>

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
									<TextField
										{...field}
										fullWidth
										label="localidad"
										type="text"
									/>
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
