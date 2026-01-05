import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from '@mui/material'
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { useNavigate } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'

interface EmpresasListaProps {
	search?: string
	familiaProfesionalId?: number | null
}

export default function EmpresasLista({ search, familiaProfesionalId }: EmpresasListaProps) {
	return (
		<Stack spacing={3}>
			<Suspense fallback={<div>Cargando...</div>}>
				<EmpresasListaSuspense search={search} familiaProfesionalId={familiaProfesionalId} />
			</Suspense>
		</Stack>
	)
}

const EmpresasListaSuspense = ({ search, familiaProfesionalId }: EmpresasListaProps) => {
	const { mismoRol } = useRol()
	const navigate = useNavigate();

	const empresasRepository = EmpresasRepositoryHttp

	const { data: empresas = [] } = useSuspenseQuery({
		queryKey: ['empresas', search, familiaProfesionalId],
		queryFn: () => empresasRepository.obtener(search, familiaProfesionalId ?? undefined),
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
			{empresas.length === 0 && (
				<Typography align="center" color="text.secondary">No se encontraron empresas.</Typography>
			)}

			<Stack spacing={2}>
				{empresas.map((empresa) => {
					return (
						<Card
							key={empresa.idEmpresa}
							sx={{ padding: 2, boxShadow: 2, cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: 'action.hover' } }}
							onClick={() => navigate(`/empresas/${empresa.idEmpresa}`)}
						>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
									}}
								>
									<Box sx={{ textAlign: 'left' }}>
										<Typography variant="h6" sx={{ marginBottom: 2 }}>
											{empresa.nombre}
										</Typography>
										<Box sx={{ marginBottom: 1 }}>
											<Typography
												variant="subtitle2"
												color="text.secondary"
												component="span"
											>
												Familia Profesional:{' '}
											</Typography>
											<Typography variant="body2" component="span">
												{empresa.familiaProfesional?.nombre || 'N/D'}
											</Typography>
										</Box>
										<Box sx={{ marginBottom: 1 }}>
											<Typography
												variant="subtitle2"
												color="text.secondary"
												component="span"
											>
												Localidad:{' '}
											</Typography>
											<Typography variant="body2" component="span">
												{empresa.localidad}
											</Typography>
										</Box>
									</Box>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'flex-end',
										}}
									>
										{mismoRol('centro') &&
											(empresa.validado ? (
												<Button variant="outlined" color="secondary" disabled>
													Validado
												</Button>
											) : (
												<Box sx={{ display: 'flex', gap: 1 }}>
													<Button
														variant="outlined"
														color="error"
														onClick={(e) => onRechazarClick(e, empresa.idEmpresa)}
													>
														Rechazar
													</Button>
													<Button
														variant="outlined"
														color="secondary"
														onClick={(e) => onValidarClick(e, empresa.idEmpresa)}
													>
														Aceptar
													</Button>
												</Box>
											))}
									</Box>
								</Box>
							</CardContent>
						</Card>
					)
				})}
			</Stack>
		</Box>
	)
}
