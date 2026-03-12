import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Demandante } from '@/shared/models'

import { DemandantesRepository } from './demandantes.repository'

export const DemandantesRepositoryHttp: DemandantesRepository = {
	obtenerJWT: async (): Promise<Demandante> => {
		const demandante = (await getEntity('/demandantes/jwt')) as any

		return {
			...demandante,
			idDemandante: demandante.id_demandante,
			telefonoMovil: demandante.telefono_movil,
			cvPath: demandante.cv_path,
			cvUrl: demandante.cv_path ? `/demandantes/${demandante.id_demandante}/cv` : undefined,
		}
	},
	obtenerPorId: async (id: number): Promise<Demandante> => {
		const demandante = (await getEntity(`/demandantes/${id}`)) as any

		return {
			...demandante,
			idDemandante: demandante.id_demandante,
			telefonoMovil: demandante.telefono_movil,
			cvPath: demandante.cv_path,
			cvUrl: demandante.cv_path ? `/demandantes/${demandante.id_demandante}/cv` : undefined,
		}
	},
	actualizar: async (payload: Demandante | FormData) => {
		if (payload instanceof FormData) {
			payload.append('_method', 'PUT')
			return await postEntity('/demandantes', payload)
		}
		return await putEntity('/demandantes', payload)
	},
}
