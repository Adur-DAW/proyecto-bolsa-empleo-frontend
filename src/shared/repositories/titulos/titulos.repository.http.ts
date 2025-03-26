import { deleteEntity, getEntity, postEntity } from '@/shared/http/api.service'
import { Titulo, TituloExtra} from '@/shared/models'

import { TitulosRepository } from './titulos.repository'

export const TitulosRepositoryHttp: TitulosRepository = {
	obtener: async (): Promise<Titulo[]> => {
		const titulos = await getEntity<any[]>('/titulos') ?? []
		return titulos
	},
	obtenerExtra: async (): Promise<TituloExtra[]> => {
		const titulos = await getEntity<any[]>('/titulos/extra') ?? []
		return titulos.map(x => ({
			...x,
			cantidadDemandantes: x.demandantes_count,
			cantidadOfertas: x.ofertas_count
		}))
	},
	registrar: async (titulo: Titulo) => {
		return await postEntity('/titulos', titulo)
	},
	eliminar: async (id: number) => {
		return await deleteEntity(`/titulos/${id}`)
	}
}
