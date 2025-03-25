import { deleteEntity, getEntity, postEntity } from '@/shared/http/api.service'
import { OfertaDemandante } from '@/shared/models'

import { OfertasDemandanteRepository } from './ofertas-demandante.repository'

export const OfertasDemandanteRepositoryHttp: OfertasDemandanteRepository = {
	obtenerJWT: async (): Promise<OfertaDemandante[]> => {
		const ofertasDemandante = (await getEntity(
			'/demandante/ofertas'
		)) as any[]
		return ofertasDemandante.map((x: any) => ({
			...x,
			idOferta: x.id_oferta,
			idDemandante: x.id_demandante,
		}))
	},
	registrarJWT: async (id: number) => {
		return postEntity(`/ofertas/${id}/demandantes/jwt`, {})
	},
	eliminarJWT: async (id: number) => {
		return deleteEntity(`/ofertas/${id}/demandantes/jwt`)
	},
}
