import { Box, Button, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'

import Modal from '@/shared/components/modal/Modal'
import useModal from '@/shared/components/modal/hooks/useModal'
import { TituloDemandante } from '@/shared/models'
import { TitulosDemandanteRepositoryHttp } from '@/shared/repositories/titulos-demandante/titulos-demandante.repository.http'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

import ModalEditarTitulo from './components/ModalEditarTitulo'
import ModalNuevoTitulo from './components/ModalNuevoTitulo'

export default function ConfiguracionUsuarioTitulos() {
	return (
		<Suspense fallback={<div>Cargando titulos...</div>}>
			<ConfiguracionUsuarioTitulosInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioTitulosInterno = () => {
	const titulosRepository = TitulosRepositoryHttp
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp

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

	const {
		abierto: nuevoAbierto,
		abrirModal: abrirModalNuevo,
		cerrarModal: cerrarModalNuevo,
	} = useModal()
	const {
		abierto: editarAbierto,
		abrirModal: abrirModalEditar,
		cerrarModal: cerrarModalEditar,
	} = useModal()

	const [tituloDemandanteSelecionado, setTituloDemandanteSelecionado] =
		useState<TituloDemandante | undefined>()

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
				{titulosDemandante.map((tituloDemandante) => (
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
					>
						<Box
							key={`${tituloDemandante.idDemandante}-${tituloDemandante.idTitulo}`}
							sx={{ textAlign: 'start', flex: 1 }}
						>
							<Typography variant="h6">
								{tituloDemandante.titulo.nombre}
							</Typography>
							<Typography>Centro: {tituloDemandante.centro}</Typography>
							<Typography>Año: {tituloDemandante.año}</Typography>
							<Typography>Cursando: {tituloDemandante.cursando == true ? 'Si' : 'No'}</Typography>
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
								onClick={() => {
									setTituloDemandanteSelecionado(tituloDemandante)
									abrirModalEditar()
								}}
							>
								Actualizar
							</Button>
						</Box>
					</Box>
				))}
			</Box>

			<Modal open={nuevoAbierto} onClose={cerrarModalNuevo}>
				<ModalNuevoTitulo titulos={titulos} cerrarModal={cerrarModalNuevo} />
			</Modal>

			<Modal open={editarAbierto} onClose={cerrarModalEditar}>
				{tituloDemandanteSelecionado && (
					<ModalEditarTitulo
						titulos={[...titulos, tituloDemandanteSelecionado.titulo]}
						cerrarModal={cerrarModalEditar}
						tituloDemandante={tituloDemandanteSelecionado}
					/>
				)}
			</Modal>
		</Box>
	)
}
