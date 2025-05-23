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

import useRol from '@/shared/hooks/rol.hook'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'

export default function EmpresasLista() {
	return (
		<Stack spacing={3}>
			<Suspense fallback={<div>Cargando...</div>}>
				<EmpresasListaSuspense />
			</Suspense>
		</Stack>
	)
}

const EmpresasListaSuspense = () => {
	const { mismoRol } = useRol()

	const empresasRepository = EmpresasRepositoryHttp

	const { data: empresas = [] } = useSuspenseQuery({
		queryKey: ['empresas'],
		queryFn: () => empresasRepository.obtener(),
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

	const onValidarClick = (idEmpresa: number) => {
		mutationAceptar.mutate(idEmpresa)
	}

	const onRechazarClick = (idEmpresa: number) => {
		mutationRechazar.mutate(idEmpresa)
	}

	return empresas.map((empresa) => {
		return (
			<Card key={empresa.id} sx={{ padding: 2, boxShadow: 2 }}>
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
									CIF:{' '}
								</Typography>
								<Typography variant="body2" component="span">
									{empresa.cif}
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
							<Box sx={{ marginBottom: 1 }}>
								<Typography
									variant="subtitle2"
									color="text.secondary"
									component="span"
								>
									Teléfono:{' '}
								</Typography>
								<Typography variant="body2" component="span">
									{empresa.telefono}
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
											onClick={() => onRechazarClick(empresa.idEmpresa)}
										>
											Rechazar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => onValidarClick(empresa.idEmpresa)}
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
	})
}
