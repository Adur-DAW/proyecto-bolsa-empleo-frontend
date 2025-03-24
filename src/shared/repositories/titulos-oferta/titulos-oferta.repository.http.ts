import {
	deleteEntity,
	getEntity,
	postEntity,
} from '@/shared/http/api.service'
import { TituloOferta } from '@/shared/models'

import { TitulosOfertaRepository } from './titulos-oferta.repository'

export const TitulosOfertaRepositoryHttp: TitulosOfertaRepository = {
	obtenerPorIdOferta: async (id): Promise<TituloOferta[]> => {
		const titulosOferta = await getEntity<any>(`/ofertas/${id}/titulos`)
		return titulosOferta.map((x: any) => ({
			...x,
			idTitulo: x.id_titulo,
			idOferta: x.id_oferta,
		}))
	},
	registrar: async (tituloOferta: TituloOferta) => {
		return postEntity('/ofertas/titulos', {
			...tituloOferta,
			id_titulo: tituloOferta.idTitulo,
			id_oferta: tituloOferta.idOferta,
		})
	},
	eliminar: async (tituloOferta: TituloOferta) => {
		return deleteEntity(
			`/ofertas/${tituloOferta.idOferta}/titulos/${tituloOferta.idTitulo}`
		)
	},
}
