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
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { TituloDemandante } from '@/shared/models'
import { TitulosDemandanteRepositoryHttp } from '@/shared/repositories/titulos-demandante/titulos-demandante.repository.http'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

export default function ListaTitulosDemandante() {
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp
	const titulosRepository = TitulosRepositoryHttp

	const { data: titulosDemandante = [] } = useQuery({
		queryKey: ['titulos-demandante'],
		queryFn: () => titulosDemandanteRepository.obtenerJWT(),
	})

	const { data: titulos = [] } = useQuery({
		queryKey: ['titulos'],
		queryFn: () => titulosRepository.obtener(),
	})

	const [open, setOpen] = useState(false)

	const { control, handleSubmit, reset } = useForm<TituloDemandante>({
		defaultValues: {
			idDemandante: 0,
			idTitulo: 0,
			centro: '',
			año: '',
			titulo: null!,
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

	const onSubmit = (data: TituloDemandante) => {
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
					Títulos
				</Typography>

				<Button
					variant="contained"
					color="secondary"
					onClick={() => setOpen(true)}
					sx={{ mb: 2 }}
				>
					Añadir nuevo título
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
							{tituloDemandante.titulo?.nombre}
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
						Añadir nuevo título
					</Typography>

					<Stack spacing={2}>
						<Controller
							name="idTitulo"
							control={control}
							render={({ field }) => (
								<TextField {...field} select label="Título" fullWidth>
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
								<TextField {...field} label="Centro" fullWidth />
							)}
						/>
						<Controller
							name="año"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Año" fullWidth />
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
							disabled={mutation.isPending}
						>
							{mutation.isPending ? 'Añadiendo...' : 'Añadir Título'}
						</Button>
					</Stack>
				</Box>
			</Modal>
		</Box>
	)
}
