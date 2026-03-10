import {
	Avatar,
	Box,
	Button,
	Chip,
	Pagination,
	Stack,
	Typography,
} from '@mui/material'
import {
	IconBriefcase,
	IconCheck,
	IconMapPin,
	IconNews,
	IconUsers,
	IconX,
} from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import Tarjeta from '@/shared/components/tarjetas/Tarjeta'
import useRol from '@/shared/hooks/rol.hook'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useEmpresasQuery } from '@/shared/hooks/useEmpresasQuery'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'

type EmpresasListaProps = {
	search?: string
	idFamiliaProfesional?: number | null
	ordenarPor?: string
	query?: string
}

export default function EmpresasLista({
	search,
	idFamiliaProfesional,
	ordenarPor,
	query,
}: EmpresasListaProps) {
	return (
		<Stack spacing={3}>
			<PageDataContainer skeletonType="list">
				<EmpresasListaSuspense
					search={search}
					idFamiliaProfesional={idFamiliaProfesional}
					ordenarPor={ordenarPor}
					query={query}
				/>
			</PageDataContainer>
		</Stack>
	)
}

const EmpresasListaSuspense = ({
	search,
	idFamiliaProfesional,
	ordenarPor,
	query,
}: EmpresasListaProps) => {
	const { mismoRol } = useRol()
	const [searchParams, setSearchParams] = useSearchParams()
	const pagina = Number(searchParams.get('pagina')) || 1

	const setPagina = (nuevaPagina: number) => {
		searchParams.set('pagina', nuevaPagina.toString())
		setSearchParams(searchParams, { replace: true })
	}

	const [busquedaDebounce] = useDebounce(search || '', 500)

	useEffect(() => {
		setPagina(1)
	}, [search, idFamiliaProfesional, ordenarPor])

	const { data: paginatedData, isLoading } = useEmpresasQuery({
		search: busquedaDebounce,
		idFamiliaProfesional,
		ordenarPor,
		pagina,
	})

	const allEmpresas = paginatedData?.data || []

	const empresas = query
		? allEmpresas.filter(
			(e) =>
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
		e.stopPropagation()
		mutationAceptar.mutate(idEmpresa)
	}

	const onRechazarClick = (e: any, idEmpresa: number) => {
		e.stopPropagation()
		mutationRechazar.mutate(idEmpresa)
	}

	const handleCambioPagina = (_, value: number) => {
		setPagina(value)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box>
			{empresas.length === 0 && !isLoading && (
				<Typography align="center" color="text.secondary">
					No se encontraron empresas.
				</Typography>
			)}

			<Stack spacing={2}>
				{empresas.map((empresa) => {
					return (
						<Tarjeta
							key={empresa.idEmpresa}
							titulo={empresa.nombre}
							to={`/empresas/${empresa.idEmpresa}`}
							avatar={
								<Avatar
									src={empresa.imagenUrl || undefined}
									sx={{ width: 48, height: 48 }}
									variant="rounded"
								>
									{empresa.nombre.charAt(0)}
								</Avatar>
							}
							etiquetas={
								mismoRol('centro') && (
									<Chip
										label={empresa.validado ? 'Validado' : 'Pendiente'}
										color={empresa.validado ? 'success' : 'warning'}
										size="small"
										icon={
											empresa.validado ? (
												<IconCheck size={14} />
											) : (
												<IconX size={14} />
											)
										}
									/>
								)
							}
							detalles={[
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<IconBriefcase
										size={16}
										color="var(--mui-palette-text-secondary)"
									/>
									<Typography variant="body2" color="text.secondary">
										{empresa.familiaProfesional?.nombre ||
											'Sin Familia Profesional'}
									</Typography>
								</Box>,
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<IconMapPin
										size={16}
										color="var(--mui-palette-text-secondary)"
									/>
									<Typography variant="body2" color="text.secondary">
										{empresa.localidad || 'Sin localidad'}
									</Typography>
								</Box>,
								<Box sx={{ display: 'flex', gap: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<IconNews
											size={16}
											color="var(--mui-palette-primary-main)"
										/>
										<Typography variant="body2" fontWeight="medium">
											{empresa.cantidadOfertas || 0} Ofertas
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<IconUsers
											size={16}
											color="var(--mui-palette-secondary-main)"
										/>
										<Typography variant="body2" fontWeight="medium">
											{empresa.cantidadVacantes || 0} Vacantes
										</Typography>
									</Box>
								</Box>,
							]}
							acciones={
								mismoRol('centro') &&
								!empresa.validado && (
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

			{paginatedData && paginatedData.ultimaPagina > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={paginatedData.ultimaPagina}
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
