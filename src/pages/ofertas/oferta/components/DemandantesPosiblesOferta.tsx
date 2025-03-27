import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { Card, CardContent, Typography } from '@mui/material'

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

	const columns: GridColDef[] = [
		{ field: 'nombre', headerName: 'Nombre Completo', width: 300 },
		{
			field: 'titulos',
			headerName: 'Titulos',
			type: 'number',
			width: 500,
		},
		{ field: 'situacion', headerName: 'Situación', type: 'boolean' },
		{
			field: 'adjudicado',
			headerName: 'Adjudicado',
			type: 'boolean',
			width: 90,
		},
	]

	const paginationModel = { page: 0, pageSize: 5 }

	const rows = demandantes.map((demandante) => ({
		id: demandante.idDemandante,
		nombre:
			demandante.nombre +
			' ' +
			demandante.apellido1 +
			' ' +
			demandante.apellido2,
		situacion: demandante.situacion,
		titulos: demandante.titulos?.map((x) => x.titulo?.nombre).join(', '),
		aceptado: demandante.adjudicado,
	}))

	return (
		<Card sx={{ padding: 2 }}>
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
