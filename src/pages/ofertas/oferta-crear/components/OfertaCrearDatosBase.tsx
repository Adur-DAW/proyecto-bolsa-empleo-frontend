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
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { ofertaDefault } from '@/shared/models'
import {
	MaestrosRepository,
	TipoContrato,
} from '@/shared/repositories/MaestrosRepository'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

export default function OfertaCrearDatosBase() {
	return (
		<Suspense fallback={<div>Cargando oferta...</div>}>
			<OfertaEditarDatosBaseInterno />
		</Suspense>
	)
}

const OfertaEditarDatosBaseInterno = () => {
	const ofertasRepository = OfertasRepositoryHttp
	const [tiposContrato, setTiposContrato] = useState<TipoContrato[]>([])

	useEffect(() => {
		MaestrosRepository.obtenerTiposContrato().then(setTiposContrato)
	}, [])

	const { control, handleSubmit } = useForm({
		defaultValues: {
			...ofertaDefault,
			idTipoContrato: undefined,
		},
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

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={3}>
						<Box>
							<Controller
								name="nombre"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Título de la oferta" />
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
								name="idTipoContrato"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										select
										label="Tipo de contrato"
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
									<TextField {...field} fullWidth label="Horario" type="text" />
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
									/>
								)}
							/>
						</Box>

						<Box>
							<Typography variant="body2" color="text.secondary" gutterBottom>
								Descripción completa (README)
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
		</Box>
	)
}
