import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

export default function DemandantesOferta({ id }) {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<DemandantesOfertaInterno id={id} />
		</Suspense>
	)
}

const DemandantesOfertaInterno = ({ id }) => {
	const ofertasDemandantesRepository = OfertasDemandanteRepositoryHttp

	const { data: demandantes = [], isError } = useSuspenseQuery({
		queryKey: ['demandantes', id],
		queryFn: () =>
			ofertasDemandantesRepository.obtenerDemandantesPorIdOferta(id),
	})

	if (isError) {
		return <div>Error al cargar los demandantes</div>
	}

	return (
		<>
			{demandantes.map((demandante) => (
				<div key={demandante.id}>{demandante.nombre}</div>
			))}
		</>
	)
}
