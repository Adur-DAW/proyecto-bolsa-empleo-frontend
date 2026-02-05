import {
	Typography,
	Chip,
	Avatar,
	Stack,
	Box,
	Button,
	Pagination
} from '@mui/material'
import { useState, useEffect } from 'react'
import {
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { IconMapPin, IconBriefcase, IconCheck, IconX, IconNews, IconUsers } from '@tabler/icons-react'

import useRol from '@/shared/hooks/rol.hook'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'
import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import EntityCard from '@/shared/components/cards/EntityCard'
import { useEmpresasQuery } from '@/shared/hooks/useEmpresasQuery'
import { useDebounce } from '@/shared/hooks/useDebounce'

type EmpresasListaProps = {
	search?: string
	idFamiliaProfesional?: number | null
	ordenarPor?: string
	query?: string
}

export default function EmpresasLista({ search, idFamiliaProfesional, ordenarPor, query }: EmpresasListaProps) {
	return (
		<Stack spacing={3}>
			<PageDataContainer skeletonType="list">
				<EmpresasListaSuspense search={search} idFamiliaProfesional={idFamiliaProfesional} ordenarPor={ordenarPor} query={query} />
			</PageDataContainer>
		</Stack>
	)
}

const EmpresasListaSuspense = ({ search, idFamiliaProfesional, ordenarPor, query }: EmpresasListaProps) => {
	const { mismoRol } = useRol()
	const [pagina, setPagina] = useState(1)

	const [busquedaDebounce] = useDebounce(search || '', 500)

	useEffect(() => {
		setPagina(1)
	}, [search, idFamiliaProfesional, ordenarPor])

	const { data: paginatedData, isLoading } = useEmpresasQuery({
		search: busquedaDebounce,
		idFamiliaProfesional,
		ordenarPor,
		pagina
	})

	const allEmpresas = paginatedData?.data || []

	const empresas = query
		? allEmpresas.filter(e =>
			e.nombre.toLowerCase().includes(query.toLowerCase()) ||
			e.localidad?.toLowerCase().includes(query.toLowerCase())
		)
		: allEmpresas

	const queryClient = useQueryClient()
	const empresasRepository = EmpresasRepositoryHttp

	const mutationAceptar = useMutation({
		mutationFn: (idEmpresa: number) => empresasRepository.validar(idEmpresa),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
	})

	const mutationRechazar = useMutation({
		mutationFn: (idEmpresa: number) => empresasRepository.eliminar(idEmpresa),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
	})

	const onValidarClick = (e: any, idEmpresa: number) => {
		e.stopPropagation();
		mutationAceptar.mutate(idEmpresa)
	}

	const onRechazarClick = (e: any, idEmpresa: number) => {
		e.stopPropagation();
		mutationRechazar.mutate(idEmpresa)
	}

	const handleCambioPagina = (_, value: number) => {
		setPagina(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box>
			{empresas.length === 0 && !isLoading && (
				<Typography align="center" color="text.secondary">No se encontraron empresas.</Typography>
			)}

			<Stack spacing={2}>
				{empresas.map((empresa) => {
					return (
						<EntityCard
							key={empresa.idEmpresa}
							title={empresa.nombre}
							to={`/empresas/${empresa.idEmpresa}`}
							avatar={
								<Avatar
									src={empresa.imagen_url || undefined}
									sx={{ width: 48, height: 48 }}
									variant="rounded"
								>
									{empresa.nombre.charAt(0)}
								</Avatar>
							}
							badges={
								mismoRol('centro') && (
									<Chip
										label={empresa.validado ? 'Validado' : 'Pendiente'}
										color={empresa.validado ? 'success' : 'warning'}
										size="small"
										icon={empresa.validado ? <IconCheck size={14} /> : <IconX size={14} />}
									/>
								)
							}
							details={[
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<IconBriefcase size={16} color="var(--mui-palette-text-secondary)" />
									<Typography variant="body2" color="text.secondary">
										{empresa.familiaProfesional?.nombre || 'Sin Familia Profesional'}
									</Typography>
								</Box>,
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<IconMapPin size={16} color="var(--mui-palette-text-secondary)" />
									<Typography variant="body2" color="text.secondary">
										{empresa.localidad || 'Sin localidad'}
									</Typography>
								</Box>,
								<Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<IconNews size={16} color="var(--mui-palette-primary-main)" />
										<Typography variant="body2" fontWeight="medium">
											{empresa.cantidadOfertas || 0} Ofertas
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<IconUsers size={16} color="var(--mui-palette-secondary-main)" />
										<Typography variant="body2" fontWeight="medium">
											{empresa.cantidadVacantes || 0} Vacantes
										</Typography>
									</Box>
								</Box>
							]}
							actions={
								mismoRol('centro') && !empresa.validado && (
									<Box sx={{ display: 'flex', gap: 1 }}>
										<Button
											variant="outlined"
											color="error"
											size="small"
											onClick={(e) => onRechazarClick(e, empresa.idEmpresa)}
										>
											Rechazar
										</Button>
										<Button
											variant="contained"
											color="success"
											size="small"
											onClick={(e) => onValidarClick(e, empresa.idEmpresa)}
										>
											Aceptar
										</Button>
									</Box>
								)
							}
						/>
					)
				})}
			</Stack>

			{paginatedData && paginatedData.ultima_pagina > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={paginatedData.ultima_pagina}
						page={pagina}
						onChange={handleCambioPagina}
						color="primary"
						size="large"
					/>
				</Box>
			)}
		</Box>
	)
}
