import { Card, CardContent } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useParams } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { OfertasRepositoryHttp } from '@/shared/repositories/ofertas/ofertas.repository.http'

import DemandantesOferta from './components/DemandantesOferta'
import DemandantesPosiblesOferta from './components/DemandantesPosiblesOferta'
import DetalleOferta from './components/DetalleOferta'

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
		queryKey: ['oferta', id],
		queryFn: () => ofertasRepository.obtenerPorId(+id),
	})

	return (
		<>
			<Card sx={{ padding: 2, boxShadow: 2 }}>
				<CardContent>
					<DetalleOferta oferta={oferta} />
				</CardContent>
			</Card>
			{mismoRol('empresa') && (
				<>
					<DemandantesOferta id={+id} />
					<DemandantesPosiblesOferta id={+id} />
				</>
			)}
		</>
	)
}
