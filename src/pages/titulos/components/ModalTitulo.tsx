import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { IconDeviceFloppy, IconPlus } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Titulo } from '@/shared/models'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

const schema = z.object({
	nombre: z.string().min(1, 'Por favor introduce un nombre'),
})

export default function ModalNuevoTitulo({
	cerrarModal,
	titulo,
}: {
	titulo: Titulo | undefined
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
			nombre: titulo?.nombre || '',
		},
	})

	const mutation = useMutation({
		mutationFn: titulo?.id
			? titulosRepository.actualizar
			: titulosRepository.registrar,
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
		mutation.mutate({ ...data, id: titulo?.id })
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
					startIcon={titulo?.id ? <IconDeviceFloppy /> : <IconPlus />}
				>
					{titulo?.id
						? mutation.isPending
							? 'Actualizando...'
							: 'Actualizar'
						: mutation.isPending
							? 'Añadiendo...'
							: 'Añadir'}
				</Button>
			</Stack>
		</Box>
	)
}
