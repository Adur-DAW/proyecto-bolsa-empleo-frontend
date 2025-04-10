import { Card, CardContent, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense } from 'react'

import { Demandante, situacionesDemandante } from '@/shared/models'
import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

import AccionesPopover from './AccionesPopover'

export default function DemandantesPosiblesOferta({ id }) {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<DemandantesPosiblesOfertaInterno id={id} />
		</Suspense>
	)
}

const DemandantesPosiblesOfertaInterno = ({ id }) => {
	const ofertasDemandantesRepository = OfertasDemandanteRepositoryHttp

	const { data: demandantes = [], isError } = useSuspenseQuery({
		queryKey: ['oferta', id, 'demandantes', 'posibles'],
		queryFn: () =>
			ofertasDemandantesRepository.obtenerDemandantesPosiblesPorIdOferta(id),
	})

	if (isError) {
		return <div>Error al cargar los demandantes</div>
	}

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: (idDemandante: number) =>
			ofertasDemandantesRepository.registrarDemandanteYAdjudicar(id, idDemandante),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['oferta', id, 'demandantes'] })
		},
	})

	const onAdjudicarClick = (demandante: Demandante) => {
		mutation.mutate(demandante.idDemandante)
		queryClient.invalidateQueries({
			queryKey: ['oferta', id, 'demandantes', 'posibles'],
		})
		queryClient.invalidateQueries({
			queryKey: ['oferta', id, 'demandantes'],
		})
	}

	const columns: GridColDef[] = [
		{ field: 'nombre', headerName: 'Nombre Completo', width: 300 },
		{
			field: 'titulos',
			headerName: 'Titulos',
			type: 'number',
			flex: 1,
		},
		{ field: 'situacion', headerName: 'Situación' },
		{
			field: 'adjudicado',
			headerName: 'Adjudicado',
			type: 'boolean',
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
		titulos: demandante.titulos?.map((x) => x.titulo?.nombre).join(', '),
		aceptado: demandante.adjudicado,
	}))

	return (
		<Card sx={{ padding: 2, boxShadow: 2 }}>
			<CardContent>
				<Typography variant="h5" component="h2" marginBottom={2}>
					No inscritos en la oferta
				</Typography>

				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{ pagination: { paginationModel } }}
					pageSizeOptions={[5, 10]}
					checkboxSelection
					sx={{ border: 0 }}
				/>
			</CardContent>
		</Card>
	)
}
