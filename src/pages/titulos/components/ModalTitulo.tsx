import { zodResolver } from '@hookform/resolvers/zod'
import {
	Box,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

const schema = z.object({
	nombre: z.string().min(1, 'Por favor introduce un nombre'),
})

export default function ModalNuevoTitulo({
	cerrarModal,
}: {
	cerrarModal: () => void
}) {
	const titulosRepository = TitulosRepositoryHttp

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
			nombre: '',
		},
	})

	const mutation = useMutation({
		mutationFn: titulosRepository.registrar,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['titulos'] })
			cerrarModal()
			reset()
		},
		onError: () => {
			alert('Hubo un error al añadir el título')
		},
	})

	const onSubmit = (data) => {
		mutation.mutate({ ...data })
	}

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="h6" gutterBottom>
				Añadir nuevo
			</Typography>

			<Stack spacing={2}>
				<Controller
					name="nombre"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Nombre"
							fullWidth
							variant="outlined"
							error={!!errors.nombre}
							helperText={errors.nombre?.message}
						/>
					)}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={!isValid || mutation.isPending}
					startIcon={<IconDeviceFloppy />}
				>
					{mutation.isPending ? 'Añadiendo...' : 'Añadir'}
				</Button>
			</Stack>
		</Box>
	)
}
