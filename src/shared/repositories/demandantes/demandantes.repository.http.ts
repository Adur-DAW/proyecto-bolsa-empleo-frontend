import { getEntity, putEntity } from '@/shared/http/api.service'
import { Demandante } from '@/shared/models'

import { DemandanteRepository } from './demandante.repository'

export const DemandanteRepositoryHttp: DemandanteRepository = {
	obtenerJWT: async (): Promise => {
		return getEntity('/usuarios/demandante/jwt')
	},
	actualizar: async (demandante: Demandante) => {
		putEntity('/usuarios/demandante', demandante)
	},
}
