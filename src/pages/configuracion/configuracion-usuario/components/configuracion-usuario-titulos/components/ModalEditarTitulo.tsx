import { zodResolver } from '@hookform/resolvers/zod'
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Titulo, TituloDemandante } from '@/shared/models'
import { TitulosDemandanteRepositoryHttp } from '@/shared/repositories/titulos-demandante/titulos-demandante.repository.http'

const schema = z.object({
	idTitulo: z.number().min(1, 'Por favor selecciona un título'),
	centro: z.string().nonempty('Por favor ingresa el centro'),
	año: z.string().regex(/^[0-9]{4}$/, 'Por favor ingresa un año válido'),
	cursando: z.boolean(),
})

export default function ModalEditarTitulo({
	titulos,
	tituloDemandante,
	cerrarModal,
}: {
	titulos: Titulo[]
	tituloDemandante: TituloDemandante
	cerrarModal: () => void
}) {
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp

	const queryClient = useQueryClient()

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid, errors },
	} = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			idTitulo: tituloDemandante.idTitulo,
			centro: tituloDemandante.centro,
			año: tituloDemandante.año,
			cursando: tituloDemandante.cursando,
		},
	})

	const mutation = useMutation({
		mutationFn: titulosDemandanteRepository.actualizar,
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ['titulos-demandante'] })
			cerrarModal()
			reset()
		},
		onError: () => {
			alert('Hubo un error al actualizar el título')
		},
	})

	const onSubmit = (data) => {
		mutation.mutate(data)
	}

	const mutationEliminar = useMutation({
		mutationFn: titulosDemandanteRepository.eliminar,
		onSuccess: () =>
			queryClient.refetchQueries({ queryKey: ['titulos-demandante'] }),
	})

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="h6" gutterBottom>
				Actualizar
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
							disabled={true}
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
								<FormControlLabel value={true} control={<Radio />} label="Sí" />
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
					{mutation.isPending ? 'Actualizando...' : 'Actualizar'}
				</Button>

				<Button
					variant="outlined"
					color="secondary"
					onClick={() => mutationEliminar.mutate(tituloDemandante)}
				>
					Eliminar
				</Button>
			</Stack>
		</Box>
	)
}
