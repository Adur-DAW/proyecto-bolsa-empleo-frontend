import { toast } from 'sonner'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Card, CardContent, Typography, Chip, Button as MuiButton, Stack } from '@mui/material'
import { IconCheck, IconX } from '@tabler/icons-react'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense, useState, useMemo } from 'react'

import { Demandante, situacionesDemandante } from '@/shared/models'
import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

import AccionesPopover from './AccionesPopover'

export default function DemandantesOferta({ id }) {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<DemandantesOfertaInterno id={id} />
		</Suspense>
	)
}

const DemandantesOfertaInterno = ({ id }) => {
	const ofertasDemandantesRepository = OfertasDemandanteRepositoryHttp

	const { data: demandantes = [], isError } = useSuspenseQuery({
		queryKey: ['oferta', id, 'demandantes'],
		queryFn: () =>
			ofertasDemandantesRepository.obtenerDemandantesPorIdOferta(id),
	})

	if (isError) {
		return <div>Error al cargar los demandantes</div>
	}

	const [mostrarRechazado, setMostrarRechazado] = useState(false)
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: (idDemandante: number) =>
			ofertasDemandantesRepository.adjudicarOferta(id, idDemandante),
		onSuccess: () => {
			toast.success('Demandante adjudicado correctamente')
			queryClient.invalidateQueries({ queryKey: ['oferta', id] })
			queryClient.invalidateQueries({ queryKey: ['oferta', id, 'demandantes'] })
		},
		onError: () => {
			toast.error('Error al adjudicar el demandante')
		}
	})

	const onAdjudicarClick = (demandante: Demandante) => {
		mutation.mutate(demandante.idDemandante)
	}

	const rechazarMutation = useMutation({
		mutationFn: (idDemandante: number) =>
			ofertasDemandantesRepository.rechazarOferta(id, idDemandante),
		onSuccess: () => {
			toast.success('Demandante rechazado correctamente')
			queryClient.invalidateQueries({ queryKey: ['oferta', id] })
			queryClient.invalidateQueries({ queryKey: ['oferta', id, 'demandantes'] })
		},
		onError: () => {
			toast.error('Error al rechazar el demandante')
		}
	})

	const onRechazarClick = (demandante: Demandante) => {
		rechazarMutation.mutate(demandante.idDemandante)
	}

	const columns: GridColDef[] = [
		{ field: 'nombre', headerName: 'Nombre Completo', width: 300 },
		{
			field: 'titulos',
			headerName: 'Títulos',
			type: 'string',
			flex: 1,
		},
		{ field: 'situacion', headerName: 'Situación' },
		{
			field: 'adjudicado',
			headerName: 'Estado',
			width: 150,
			renderCell: (params) => {
				if (params.row.adjudicado) {
					return <Chip label="Adjudicado" color="success" size="small" icon={<IconCheck size={16} />} />
				}
				if (params.row.rechazada) {
					return <Chip label="Rechazado" color="error" size="small" icon={<IconX size={16} />} variant="outlined" />
				}
				return <Chip label="Pendiente" color="warning" size="small" variant="outlined" />
			},
		},
		{
			field: 'acciones',
			headerName: 'Acciones',
			type: 'actions',
			align: 'right',
			renderCell: (params) => (
				<AccionesPopover
					demandante={params.row}
					onAdjudicarClick={onAdjudicarClick}
					onRechazarClick={onRechazarClick}
				/>
			),
		},
	]

	const paginationModel = { page: 0, pageSize: 5 }

	const rows = demandantes.map((demandante) => ({
		id: demandante.idDemandante,
		idDemandante: demandante.idDemandante,
		nombre:
			demandante.nombre +
			' ' +
			demandante.apellido1 +
			' ' +
			demandante.apellido2,
		situacion: situacionesDemandante.find(x => x.id == demandante.situacion)?.valor ?? 'Sin especificar',
		titulos: demandante.titulos?.map((x) => x.titulo?.nombre).join(', ') ?? '',
		adjudicado: demandante.adjudicado,
		rechazada: demandante.rechazada,
		cvUrl: demandante.cvUrl,
		imagenUrl: demandante.imagenUrl,
	}))

	const demandantesFiltrados = useMemo(() => {
		let result = rows
		if (!mostrarRechazado) {
			result = rows.filter(r => !r.rechazada)
		} else {
			result = rows.filter(r => r.rechazada)
		}

		return [...result].sort((a, b) => {
			if (a.adjudicado && !b.adjudicado) return -1
			if (!a.adjudicado && b.adjudicado) return 1
			if (a.rechazada && !b.rechazada) return 1
			if (!a.rechazada && b.rechazada) return -1
			return 0
		})
	}, [rows, mostrarRechazado])

	return (
		<Card sx={{ padding: 2, boxShadow: 2 }}>
			<CardContent>
				<Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
					<Typography variant="h5" component="h2">
						Inscritos en la oferta
					</Typography>
					<MuiButton
						size="small"
						variant="outlined"
						color={mostrarRechazado ? "primary" : "inherit"}
						onClick={() => setMostrarRechazado(!mostrarRechazado)}
					>
						{mostrarRechazado ? "Ocultar rechazados" : "Ver rechazados"}
					</MuiButton>
				</Stack>

				<DataGrid
					rows={demandantesFiltrados}
					columns={columns}
					initialState={{ pagination: { paginationModel } }}
					pageSizeOptions={[5, 10]}
					checkboxSelection
					sx={{ border: 0 }}
					autoHeight
				/>
			</CardContent>
		</Card>
	)
}
