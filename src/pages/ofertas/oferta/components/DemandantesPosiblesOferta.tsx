import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

export default function DemandantesPosiblesOferta({ id }) {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<DemandantesPosiblesOfertaInterno id={id} />
		</Suspense>
	)
}

const DemandantesPosiblesOfertaInterno = ({ id }) => {
	const ofertasDemandantesRepository = OfertasDemandanteRepositoryHttp

	const { data: demandantes = [], isError } = useSuspenseQuery({
		queryKey: ['oferta', id, 'demandantes', 'posibles'],
		queryFn: () =>
			ofertasDemandantesRepository.obtenerDemandantesPosiblesPorIdOferta(id),
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
