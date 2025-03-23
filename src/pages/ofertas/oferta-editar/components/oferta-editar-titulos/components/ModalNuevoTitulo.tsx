import { zodResolver } from '@hookform/resolvers/zod'
import {
	Box,
	Button,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Titulo } from '@/shared/models'
import { TitulosOfertaRepositoryHttp } from '@/shared/repositories/titulos-oferta/titulos-oferta.repository.http'

const schema = z.object({
	idTitulo: z.number().min(1, 'Por favor selecciona un título'),
})

export default function ModalNuevoTitulo({
	idOferta,
	titulos,
	cerrarModal,
}: {
	idOferta: number,
	titulos: Titulo[]
	cerrarModal: () => void
}) {
	const titulosOfertaRepository = TitulosOfertaRepositoryHttp

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
			idTitulo: titulos.length > 0 ? titulos[0].id : 0,
		},
	})

	const mutation = useMutation({
		mutationFn: titulosOfertaRepository.registrar,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['titulos-oferta'] })
			cerrarModal()
			reset()
		},
		onError: () => {
			alert('Hubo un error al añadir el título')
		},
	})

	const onSubmit = (data) => {
		mutation.mutate({ ...data, idOferta })
	}

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
							error={!!errors.idTitulo}
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
	)
}
