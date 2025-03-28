import {
	deleteEntity,
	getEntity,
	postEntity,
	putEntity,
} from '@/shared/http/api.service'
import { OfertaDemandante } from '@/shared/models'

import { OfertasDemandanteRepository } from './ofertas-demandante.repository'

export const OfertasDemandanteRepositoryHttp: OfertasDemandanteRepository = {
	obtenerJWT: async (): Promise<OfertaDemandante[]> => {
		const ofertasDemandante = (await getEntity('/demandante/ofertas')) as any[]
		return ofertasDemandanteToFront(ofertasDemandante)
	},
	obtenerDemandantesPorIdOferta: async (id: number) => {
		const demandantes = await getEntity<any>(`/ofertas/${id}/demandantes`)
		return demandanteToFront(demandantes)
	},
	obtenerDemandantesPosiblesPorIdOferta: async (id: number) => {
		const demandantes = await getEntity<any>(
			`/ofertas/${id}/demandantes/posibles`
		)
		return demandanteToFront(demandantes)
	},
	registrarJWT: async (id: number) => {
		return postEntity(`/demandantes/jwt/ofertas`, { id_oferta: id })
	},
	eliminarJWT: async (id: number) => {
		return deleteEntity(`/demandantes/jwt/ofertas/${id}`)
	},
	adjudicarOferta: async (idOferta: number, idDemandante: number) => {
		return putEntity(
			`/ofertas/${idOferta}/demandantes/${idDemandante}/adjudicar`,
			{}
		)
	},
	registrarDemandanteYAdjudicar: async (
		idOferta: number,
		idDemandante: number
	) => {
		return postEntity(`/ofertas/demandantes`, {
			id_oferta: idOferta,
			id_demandante: idDemandante,
		})
	},
}

const ofertasDemandanteToFront = (x: any) => ({
	...x,
	idOferta: x.id_oferta,
	idDemandante: x.id_demandante,
})

const demandanteToFront = (demandantes: any[]) =>
	demandantes?.map((x) => ({
		...x,
		idDemandante: x.id_demandante,
	}))
