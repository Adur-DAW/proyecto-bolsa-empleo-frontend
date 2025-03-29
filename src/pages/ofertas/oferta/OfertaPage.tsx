import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useParams } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

import DemandantesOferta from './components/DemandantesOferta'
import DemandantesPosiblesOferta from './components/DemandantesPosiblesOferta'
import DetalleOferta from './components/DetalleOferta'
import { Box } from '@mui/material'
import TitulosOferta from './components/TitulosOferta'

export default function OfertaPage() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<OfertaInternoPage />
		</Suspense>
	)
}

const OfertaInternoPage = () => {
	const { id } = useParams()

	const { mismoRol } = useRol()

	if (!id) {
		return <div>Oferta no encontrada</div>
	}

	const ofertasRepository = OfertasRepositoryHttp

	const { data: oferta } = useSuspenseQuery({
		queryKey: ['oferta', +id],
		queryFn: () => ofertasRepository.obtenerPorId(+id),
	})

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left'}}>
			<DetalleOferta oferta={oferta} />
			<TitulosOferta oferta={oferta} />
			{mismoRol('empresa') && (
				<>
					<DemandantesOferta id={+id} />
					<DemandantesPosiblesOferta id={+id} />
				</>
			)}
		</Box>
	)
}
