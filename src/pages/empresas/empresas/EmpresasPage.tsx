import { Box, Container } from '@mui/material'
import { useState } from 'react'

import EmpresasFiltros from './components/EmpresasFiltros'
import EmpresasLista from './components/EmpresasLista'

export default function EmpresasPage() {
	const [search, setSearch] = useState('')
	const [familiaProfesionalId, setFamiliaProfesionalId] = useState<number | null>(null)

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
				/>

				<Box sx={{ flex: 1 }}>
					<EmpresasLista search={search} familiaProfesionalId={familiaProfesionalId} />
				</Box>
			</Box>
		</Container>
	)
}
