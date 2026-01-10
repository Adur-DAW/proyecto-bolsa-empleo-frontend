import { Box, Container, TextField } from '@mui/material'
import { useState } from 'react'
import { useSearchParams } from 'react-router'

import EmpresasFiltros from './components/EmpresasFiltros'
import EmpresasLista from './components/EmpresasLista'
import { useForm } from 'react-hook-form'

interface EmpresasFilterForm {
	search: string
	familiaProfesionalId: number | null
	sortBy: string
}

export default function EmpresasPage() {
	const [searchParams, setSearchParams] = useSearchParams()

	// 1. Client Filter
	const [clientFilter, setClientFilter] = useState('')

	// 2. Initialize Form with useFormHook
	const { control, handleSubmit, watch } = useForm<EmpresasFilterForm>({
		defaultValues: {
			search: searchParams.get('search') || '',
			familiaProfesionalId: searchParams.get('familiaProfesionalId') ? Number(searchParams.get('familiaProfesionalId')) : null,
			sortBy: searchParams.get('sortBy') || 'nombre.asc'
		}
	})

	// 3. Applied state for Query
	const [appliedFilters, setAppliedFilters] = useState<EmpresasFilterForm>(watch())

	const onSubmit = (data: EmpresasFilterForm) => {
		const params: any = {}
		if (data.search) params.search = data.search
		if (data.familiaProfesionalId) params.familiaProfesionalId = data.familiaProfesionalId.toString()
		if (data.sortBy) params.sortBy = data.sortBy

		setSearchParams(params)
		setAppliedFilters(data)
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
				/>

				<Box sx={{ flex: 1 }}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
						<TextField
							size="small"
							placeholder="Filtrar resultados vistos..."
							value={clientFilter}
							onChange={(e) => setClientFilter(e.target.value)}
							sx={{ width: 300 }}
						/>
					</Box>

					<EmpresasLista
						search={appliedFilters.search}
						familiaProfesionalId={appliedFilters.familiaProfesionalId}
						sortBy={appliedFilters.sortBy}
						clientFilter={clientFilter}
					/>
				</Box>
			</Box>
		</Container>
	)
}
