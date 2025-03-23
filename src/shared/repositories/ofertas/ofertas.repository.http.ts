import dayjs from 'dayjs'

import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Oferta } from '@/shared/models'

import { OfertasRepository } from './ofertas.repository'

export const OfertasRepositoryHttp: OfertasRepository = {
	obtener: async (): Promise<Oferta[]> => {
		const ofertas = await getEntity<any>('/ofertas')

		return ofertas.map((x: any) => ({
			...x,
			tipoContrato: x.tipo_contrato,
			numeroPuestos: x.numero_puestos,
			fechaPublicacion: dayjs(x.fecha_publicacion),
			fechaCierre: dayjs(x.fecha_cierre),
			empresa: {
				...x.empresa,
			},
		}))
	},
	obtenerPorId: async (id: number): Promise<Oferta> => {
		const oferta = await getEntity<any>(`/ofertas/${id}`)

		return {
			...oferta,
			tipoContrato: oferta.tipo_contrato,
			numeroPuestos: oferta.numero_puestos,
			fechaPublicacion: dayjs(oferta.fecha_publicacion),
			fechaCierre: dayjs(oferta.fecha_cierre),
			empresa: {
				...oferta.empresa,
			},
		}
	},
	registrar: async (oferta: Oferta) => {
		return postEntity('/ofertas/', oferta)
	},
	actualizar: async (oferta: Oferta) => {
		return putEntity<void>(`/ofertas/${oferta.id}`, oferta)
	},
}
