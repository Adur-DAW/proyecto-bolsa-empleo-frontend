import { getEntity, postEntity } from '@/shared/http/api.service'
import { Titulo } from '@/shared/models'

import { TitulosRepository } from './titulos.repository'

export const TitulosRepositoryHttp: TitulosRepository = {
	obtener: async (): Promise<Titulo[]> => {
		const titulos = (await getEntity('/titulos')) as any[]

		return titulos
	},
	registrar: async (datos: { titulo: Titulo }) => {
		postEntity('/titulos', datos)
	},
}
