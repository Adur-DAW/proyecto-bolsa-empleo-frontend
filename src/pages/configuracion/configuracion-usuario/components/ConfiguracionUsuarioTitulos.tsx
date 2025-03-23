import { zodResolver } from '@hookform/resolvers/zod'
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	MenuItem,
	Modal,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import {
	QueryClient,
	useMutation,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { TitulosDemandanteRepositoryHttp } from '@/shared/repositories/titulos-demandante/titulos-demandante.repository.http'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

const schema = z.object({
	idTitulo: z.number().min(1, 'Por favor selecciona un título'),
	centro: z.string().nonempty('Por favor ingresa el centro'),
	año: z.string().regex(/^[0-9]{4}$/, 'Por favor ingresa un año válido'),
	cursando: z.boolean(),
})

export default function ConfiguracionUsuarioTitulos() {
	return (
		<Suspense fallback={<div>Cargando titulos...</div>}>
			<ConfiguracionUsuarioTitulosInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioTitulosInterno = () => {
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp
	const titulosRepository = TitulosRepositoryHttp

	const queryClient = new QueryClient()

	const { data: titulosDemandante = [] } = useSuspenseQuery({
		queryKey: ['titulos-demandante'],
		queryFn: () => titulosDemandanteRepository.obtenerJWT(),
	})

	const { data: titulosSinFiltrar = [] } = useSuspenseQuery({
		queryKey: ['titulos'],
		queryFn: () => titulosRepository.obtener(),
	})

	const titulosActuales = titulosDemandante.map((x) => x.idTitulo)
	const titulos = titulosSinFiltrar.filter(
		({ id }) => !titulosActuales.includes(id)
	)

	const [open, setOpen] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid, errors },
	} = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			idTitulo: titulos.length > 0 ? titulos[0].id : 0,
			centro: '',
			año: '',
			cursando: false,
		},
	})

	const mutation = useMutation({
		mutationFn: titulosDemandanteRepository.registrar,
		onSuccess: () => {
			setOpen(false)
			reset()
		},
		onError: () => {
			alert('Hubo un error al añadir el título')
		},
	})

	const onSubmit = (data) => {
		mutation.mutate(data)
		queryClient.invalidateQueries({ queryKey: ['titulos-demandante'] })
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
					Títulos
				</Typography>

				<Button
					disabled={titulos.length === 0}
					variant="contained"
					color="secondary"
					onClick={() => setOpen(true)}
					sx={{ mb: 2 }}
				>
					Añadir nuevo
				</Button>
			</Box>

			<Box>
				{titulosDemandante.map((tituloDemandante) => (
					<Box
						key={`${tituloDemandante.idDemandante}-${tituloDemandante.idTitulo}`}
						sx={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: 2,
							marginBottom: 2,
						}}
					>
						<Typography variant="h6">
							{tituloDemandante.titulo.nombre}
						</Typography>
						<Typography>Centro: {tituloDemandante.centro}</Typography>
						<Typography>Año: {tituloDemandante.año}</Typography>
					</Box>
				))}
			</Box>

			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: '8px',
					}}
				>
					<Typography variant="h6" gutterBottom>
						Añadir nuevo
					</Typography>

					<Stack spacing={2}>
						<Controller
							name="idTitulo"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Título"
									fullWidth
									variant="outlined"
									error={errors.idTitulo?.message}
									helperText={errors.idTitulo?.message}
								>
									{titulos.map((titulo) => (
										<MenuItem key={titulo.id} value={titulo.id}>
											{titulo.nombre}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="centro"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Centro"
									fullWidth
									error={!!errors.centro}
									helperText={errors.centro?.message}
								/>
							)}
						/>
						<Controller
							name="año"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Año"
									fullWidth
									error={!!errors.año}
									helperText={errors.año?.message}
								/>
							)}
						/>
						<Controller
							name="cursando"
							control={control}
							render={({ field }) => (
								<FormControl>
									<Typography variant="subtitle1">¿Cursando?</Typography>
									<RadioGroup
										row
										{...field}
										onChange={(e) => field.onChange(e.target.value === 'true')}
									>
										<FormControlLabel
											value={true}
											control={<Radio />}
											label="Sí"
										/>
										<FormControlLabel
											value={false}
											control={<Radio />}
											label="No"
										/>
									</RadioGroup>
								</FormControl>
							)}
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={!isValid || mutation.isPending}
						>
							{mutation.isPending ? 'Añadiendo...' : 'Añadir'}
						</Button>
					</Stack>
				</Box>
			</Modal>
		</Box>
	)
}
