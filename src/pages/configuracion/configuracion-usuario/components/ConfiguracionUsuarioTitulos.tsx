import { Box, MenuItem, TextField } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Controller } from 'react-hook-form'

import { TitulosDemandanteRepositoryHttp } from '@/shared/repositories/titulos-demandante/titulos-demandante.repository.http'
import { TitulosRepositoryHttp } from '@/shared/repositories/titulos/titulos.repository.http'

export default function ConfiguracionUsuarioTitulos() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<ConfiguracionUsuarioTitulosInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioTitulosInterno = () => {
	const titulosRepository = TitulosRepositoryHttp
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp

	const { data: titulos } = useSuspenseQuery({
		queryKey: ['titulos'],
		queryFn: () => titulosRepository.obtener(),
	})

	const { data: titulosDemandante } = useSuspenseQuery({
		queryKey: ['titulos-demandante'],
		queryFn: () => titulosDemandanteRepository.obtenerJWT(),
	})

	return (
		<div>
			<h1>ConfiguracionUsuarioDatos</h1>
			{titulos?.map((titulo) => <div key={titulo.id}>{titulo.nombre}</div>)}

			{titulosDemandante?.map(({ idTitulo, idDemandante, centro }) => (
				<div key={idTitulo + idDemandante}>{centro}</div>
			))}

			{/* <Box>
				<Controller
					name="titulo"
					control={control}
					render={({ field }) => (
						<TextField {...field} fullWidth select label="Título académico">
							<MenuItem value="Grado Superior">Grado Superior</MenuItem>
							<MenuItem value="Grado Medio">Grado Medio</MenuItem>
							<MenuItem value="Grado Básico">Grado Básico</MenuItem>
						</TextField>
					)}
				/>
			</Box> */}
		</div>
	)
}
