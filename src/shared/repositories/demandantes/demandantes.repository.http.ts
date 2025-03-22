import { getEntity, putEntity } from '@/shared/http/api.service'
import { Demandante } from '@/shared/models'

import { DemandantesRepository } from './demandantes.repository'

export const DemandantesRepositoryHttp: DemandantesRepository = {
	obtenerJWT: async (): Promise<Demandante> => {
		const demandante = (await getEntity('/demandantes/jwt')) as any

		return {
			...demandante,
			telefonoMovil: demandante.telefono_movil,
		}
	},
	actualizar: async (demandante: Demandante) => {
		putEntity('/demandantes', demandante)
	},
}
