import { Box, Container } from '@mui/material'
import { useState } from 'react'

import EmpresasFiltros from './components/EmpresasFiltros'
import EmpresasLista from './components/EmpresasLista'

export default function EmpresasPage() {
	const [search, setSearch] = useState('')
	const [familiaProfesionalId, setFamiliaProfesionalId] = useState<number | null>(null)
	const [sortBy, setSortBy] = useState('nombre.asc')

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
					search={search}
					onSearchChange={setSearch}
					familiaProfesionalId={familiaProfesionalId}
					onFamiliaChange={setFamiliaProfesionalId}
					sortBy={sortBy}
					onSortChange={setSortBy}
				/>

				<Box sx={{ flex: 1 }}>
					<EmpresasLista search={search} familiaProfesionalId={familiaProfesionalId} sortBy={sortBy} />
				</Box>
			</Box>
		</Container>
	)
}
