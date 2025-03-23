import { getEntity, postEntity } from '@/shared/http/api.service'
import { TituloDemandante } from '@/shared/models'

import { TitulosDemandanteRepository } from './titulos-demandante.repository'

export const TitulosDemandanteRepositoryHttp: TitulosDemandanteRepository = {
	obtenerJWT: async (): Promise<TituloDemandante[]> => {
		const titulosDemandante = (await getEntity(
			'/titulos/demandante/jwt'
		)) as any[]
		return titulosDemandante.map((x: any) => ({
			...x,
			idTitulo: x.id_titulo,
			idDemandante: x.id_demandante,
		}))
	},
	registrar: async (tituloDemandante: TituloDemandante) => {
		return postEntity('/titulos/demandante', {
			...tituloDemandante,
			id_titulo: tituloDemandante.idTitulo,
			id_demandante: tituloDemandante.idDemandante,
		})
	},
}
