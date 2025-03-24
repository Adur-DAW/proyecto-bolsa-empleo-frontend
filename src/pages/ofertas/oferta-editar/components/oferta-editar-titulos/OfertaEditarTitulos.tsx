import { Box, Button, Typography } from '@mui/material'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { useParams } from 'react-router'

import Modal from '@/shared/components/modal/Modal'
import useModal from '@/shared/components/modal/hooks/useModal'
import { TitulosOfertaRepositoryHttp } from '@/shared/repositories/titulos-oferta/titulos-oferta.repository.http'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

import ModalNuevoTitulo from './components/ModalNuevoTitulo'

export default function OfertaEditarTitulos() {
	return (
		<Suspense fallback={<div>Cargando titulos...</div>}>
			<OfertaEditarTitulosInterno />
		</Suspense>
	)
}

const OfertaEditarTitulosInterno = () => {
	const { id } = useParams()
	if (!id) {
		throw new Error('No se ha proporcionado un ID')
	}

	const titulosRepository = TitulosRepositoryHttp
	const titulosOfertaRepository = TitulosOfertaRepositoryHttp

	const { data: titulosOferta = [] } = useSuspenseQuery({
		queryKey: ['titulos-oferta'],
		queryFn: () => titulosOfertaRepository.obtenerPorIdOferta(+id),
	})

	const { data: titulosSinFiltrar = [] } = useSuspenseQuery({
		queryKey: ['titulos'],
		queryFn: () => titulosRepository.obtener(),
	})

	const titulosActuales = titulosOferta.map((x) => x.idTitulo)
	const titulos = titulosSinFiltrar.filter(
		({ id }) => !titulosActuales.includes(id)
	)

	const queryClient = useQueryClient()

	const mutationEliminar = useMutation({
		mutationFn: titulosOfertaRepository.eliminar,
		onSuccess: () =>
			queryClient.refetchQueries({ queryKey: ['titulos-oferta'] }),
	})

	const {
		abierto: nuevoAbierto,
		abrirModal: abrirModalNuevo,
		cerrarModal: cerrarModalNuevo,
	} = useModal()

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
					onClick={abrirModalNuevo}
					sx={{ mb: 2 }}
				>
					Añadir nuevo
				</Button>
			</Box>

			<Box>
				{titulosOferta.map((tituloOferta) => (
					<Box
						sx={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: 2,
							marginBottom: 2,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
						key={tituloOferta.idTitulo}
					>
						<Box
							key={`${tituloOferta.idOferta}-${tituloOferta.idTitulo}`}
							sx={{ textAlign: 'start', flex: 1 }}
						>
							<Typography variant="h6">{tituloOferta.titulo.nombre}</Typography>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							<Button
								variant="outlined"
								color="secondary"
								onClick={() => mutationEliminar.mutate(tituloOferta)}
							>
								Eliminar
							</Button>
						</Box>
					</Box>
				))}
			</Box>

			<Modal open={nuevoAbierto} onClose={cerrarModalNuevo}>
				<ModalNuevoTitulo
					titulos={titulos}
					cerrarModal={cerrarModalNuevo}
					idOferta={+id}
				/>
			</Modal>
		</Box>
	)
}
