import { Paper } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'

import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

export default function TitulosPage() {
	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'Id' },
		{ field: 'nombre', headerName: 'Nombre', width: 200 },
		{ field: 'enUso', headerName: 'En uso', type: 'boolean' },
		{
			field: 'cantidadDemandantes',
			headerName: 'Cantidad demanantes',
			type: 'number',
			width: 200,
		},
		{
			field: 'cantidadOfertas',
			headerName: 'Cantidad ofertas',
			type: 'number',
			width: 200,
		},
	]

	const paginationModel = { page: 0, pageSize: 5 }

	const titulosRepository = TitulosRepositoryHttp

	const { data: titulos = [], isLoading } = useQuery({
		queryKey: ['titulos'],
		queryFn: titulosRepository.obtenerExtra,
	})

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
		<Paper sx={{ height: 400, width: '100%' }}>
			<h2>Titulos</h2>

			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10]}
				checkboxSelection
				sx={{ border: 0 }}
			/>
		</Paper>
	)
}
