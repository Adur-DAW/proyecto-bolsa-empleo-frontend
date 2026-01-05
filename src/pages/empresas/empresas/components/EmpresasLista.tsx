import {
	Typography,
	Chip,
	Avatar,
	Stack,
	Box,
	Button
} from '@mui/material'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { IconMapPin, IconBriefcase, IconCheck, IconX, IconNews, IconUsers } from '@tabler/icons-react'

import useRol from '@/shared/hooks/rol.hook'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'
import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import EntityCard from '@/shared/components/cards/EntityCard'

interface EmpresasListaProps {
	search?: string
	familiaProfesionalId?: number | null
	sortBy?: string
}

export default function EmpresasLista({ search, familiaProfesionalId, sortBy }: EmpresasListaProps) {
	return (
		<Stack spacing={3}>
			<PageDataContainer skeletonType="list">
				<EmpresasListaSuspense search={search} familiaProfesionalId={familiaProfesionalId} sortBy={sortBy} />
			</PageDataContainer>
		</Stack>
	)
}

const EmpresasListaSuspense = ({ search, familiaProfesionalId, sortBy }: EmpresasListaProps) => {
	const { mismoRol } = useRol()

	const empresasRepository = EmpresasRepositoryHttp

	const { data: empresas = [] } = useSuspenseQuery({
		queryKey: ['empresas', search, familiaProfesionalId, sortBy],
		queryFn: () => empresasRepository.obtener(search, familiaProfesionalId ?? undefined, sortBy),
	})

	const queryClient = useQueryClient()

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

	return (
		<Box>
			{/* Sort controls moved to EmpresasFiltros */}

			{empresas.length === 0 && (
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
		</Box>
	)
}
