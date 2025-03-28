import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { IconPlus } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import Modal from '@/shared/components/modal/Modal'
import useModal from '@/shared/components/modal/hooks/useModal'
import { Titulo } from '@/shared/models'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

import AccionesPopover from './components/AccionesPopover'
import ModalTitulo from './components/ModalTitulo'

export default function TitulosPage() {
	const [tituloSeleccionado, setTituloSeleccionado] = useState<
		Titulo | undefined
	>()

	const titulosRepository = TitulosRepositoryHttp

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: (titulo: Titulo) => titulosRepository.eliminar(titulo.id),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['titulos'] })
		},
	})

	const onEditarClick = (titulo: Titulo) => {
		setTituloSeleccionado(titulo)
		abrirModal()
	}

	const onEliminarClick = (titulo: Titulo) => {
		mutation.mutate(titulo)
	}

	const paginationModel = { page: 0, pageSize: 5 }

	const { data: titulos = [], isLoading } = useQuery({
		queryKey: ['titulos'],
		queryFn: titulosRepository.obtenerExtra,
	})

	const { abierto, abrirModal, cerrarModal } = useModal()

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'Id',
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'nombre',
			headerName: 'Nombre',
			flex: 2,
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'enUso',
			headerName: 'En uso',
			type: 'boolean',
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'cantidadDemandantes',
			flex: 1,
			headerName: 'Cantidad demandantes',
			type: 'number',
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'cantidadOfertas',
			flex: 1,
			headerName: 'Cantidad ofertas',
			type: 'number',
			headerAlign: 'center',
			align: 'center',
		},
		{
			field: 'acciones',
			headerName: 'Acciones',
			headerAlign: 'center',
			align: 'center',
			renderCell: (params) => (
				<AccionesPopover
					titulo={params.row}
					onEditarClick={onEditarClick}
					onEliminarClick={onEliminarClick}
				/>
			),
		},
	]

	if (isLoading) {
		return <div>Cargando...</div>
	}

	const rows = titulos.map((titulo) => ({
		id: titulo.id,
		nombre: titulo.nombre,
		enUso: titulo.cantidadDemandantes + titulo.cantidadOfertas > 0,
		cantidadDemandantes: titulo.cantidadDemandantes,
		cantidadOfertas: titulo.cantidadOfertas,
	}))

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="h4" gutterBottom component="h1">
					Títulos
				</Typography>

				<Button
					variant="contained"
					color="secondary"
					sx={{ marginBottom: 2 }}
					startIcon={<IconPlus />}
					onClick={abrirModal}
				>
					Agregar
				</Button>
			</Box>

			<Card sx={{ padding: 4 }}>
				<CardContent>
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{ pagination: { paginationModel } }}
						pageSizeOptions={[5, 10]}
					/>
				</CardContent>
			</Card>

			<Modal open={abierto} onClose={cerrarModal}>
				<ModalTitulo cerrarModal={cerrarModal} titulo={tituloSeleccionado} />
			</Modal>
		</>
	)
}
