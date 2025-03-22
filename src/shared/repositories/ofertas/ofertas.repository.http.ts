import dayjs from 'dayjs'

import { getEntity, postEntity } from '@/shared/http/api.service'
import { Oferta } from '@/shared/models'

import { OfertasRepository } from './ofertas.repository'

export const OfertasRepositoryHttp: OfertasRepository = {
	obtener: async (): Promise => {
		const ofertas = (await getEntity('/ofertas')) as any[]

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
	registrar: async (datos: { oferta: Oferta }) => {
		postEntity('/ofertas/', datos)
	},
}
