import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { TituloDemandante } from '@/shared/models'

import { TitulosDemandanteRepository } from './titulos-demandante.repository'

export const TitulosDemandanteRepositoryHttp: TitulosDemandanteRepository = {
	obtenerJWT: async (): Promise<TituloDemandante[]> => {
		const titulosDemandante = (await getEntity(
			'/demandante/titulos'
		)) as any[]
		return titulosDemandante.map((x: any) => ({
			...x,
			idTitulo: x.id_titulo,
			idDemandante: x.id_demandante,
		}))
	},
	registrar: async (tituloDemandante: TituloDemandante) => {
		return postEntity('/demandante/titulos', {
			...tituloDemandante,
			id_titulo: tituloDemandante.idTitulo,
			id_demandante: tituloDemandante.idDemandante,
		})
	},
	actualizar: async (tituloDemandante: TituloDemandante) => {
		return putEntity(`/demandante/titulos/${tituloDemandante.idTitulo}`, {
			...tituloDemandante,
			id_titulo: tituloDemandante.idTitulo,
			id_demandante: tituloDemandante.idDemandante,
		})
	},
}
