import { Box, Container, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

import EmpresasFiltros from './components/EmpresasFiltros'
import EmpresasLista from './components/EmpresasLista'

type EmpresasFilterForm = {
	search: string
	idFamiliaProfesional: number | null
	ordenarPor: string
	filtro: string
}

export default function EmpresasPage() {
	const [searchParams, setSearchParams] = useSearchParams()

	const [query, setQuery] = useState('')

	const { control, handleSubmit, watch, reset } = useForm<EmpresasFilterForm>({
		defaultValues: {
			search: searchParams.get('search') || '',
			idFamiliaProfesional: searchParams.get('idFamiliaProfesional')
				? Number(searchParams.get('idFamiliaProfesional'))
				: null,
			ordenarPor: searchParams.get('ordenarPor') || 'nombre.asc',
			filtro: searchParams.get('filtro') || 'todas',
		},
	})

	const [filtros, setFiltros] =
		useState<EmpresasFilterForm>(watch())

	const handleLimpiar = () => {
		const emptyValues: EmpresasFilterForm = {
			search: '',
			idFamiliaProfesional: null,
			ordenarPor: 'nombre.asc',
			filtro: 'todas',
		}
		reset(emptyValues)
		setSearchParams({})
		setFiltros(emptyValues)
	}

	const onSubmit = (data: EmpresasFilterForm) => {
		const params: any = {}
		if (data.search) params.search = data.search
		if (data.idFamiliaProfesional)
			params.idFamiliaProfesional = data.idFamiliaProfesional.toString()
		if (data.ordenarPor) params.ordenarPor = data.ordenarPor
		if (data.filtro) params.filtro = data.filtro

		setSearchParams(params)
		setFiltros(data)
	}

	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					gap: 4,
				}}
			>
				<EmpresasFiltros 
					control={control} 
					onBuscar={handleSubmit(onSubmit)} 
					onLimpiar={handleLimpiar}
				/>

				<Box sx={{ flex: 1 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
							mb: 2,
						}}
					>
						<TextField
							size="small"
							placeholder="Filtrar..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							sx={{ width: 300 }}
						/>
					</Box>

					<EmpresasLista
						search={filtros.search}
						idFamiliaProfesional={filtros.idFamiliaProfesional}
						ordenarPor={filtros.ordenarPor}
						query={query}
						filtro={filtros.filtro}
					/>
				</Box>
			</Box>
		</Container>
	)
}
