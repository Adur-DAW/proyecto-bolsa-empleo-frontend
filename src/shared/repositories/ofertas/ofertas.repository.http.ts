import dayjs from 'dayjs'

import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Oferta } from '@/shared/models'

import { OfertasRepository } from './ofertas.repository'

export const OfertasRepositoryHttp: OfertasRepository = {
	obtener: async (): Promise<Oferta[]> => {
		const ofertas = await getEntity<any>('/ofertas')

		return ofertas.map((x: any) => mapOfertaToFront(x))
	},
	obtenerPorDemandante: async (): Promise<Oferta[]> => {
		const ofertas = await getEntity<any>('/demandantes/jwt/ofertas-por-titulos')

		return ofertas.map((x: any) => mapOfertaToFront(x))
	},
	obtenerPorEmpresa: async (): Promise<Oferta[]> => {
		const ofertas = await getEntity<any>('/empresas/jwt/ofertas')

		return ofertas.map((x: any) => mapOfertaToFront(x))
	},

	obtenerPorId: async (id: number): Promise<Oferta> => {
		const oferta = await getEntity<any>(`/ofertas/${id}`)

		return mapOfertaToFront(oferta)
	},
	registrar: async (oferta: Oferta) => {
		return await postEntity<any>('/ofertas/', mapOfertaToBack(oferta))
	},
	actualizar: async (oferta: Oferta) => {
		return await putEntity<void>(`/ofertas/${oferta.id}`, mapOfertaToBack(oferta))
	},
}

const mapOfertaToBack = (oferta: Oferta): any => ({
	nombre: oferta.nombre,
	horario: oferta.horario,
	obs: oferta.obs,
	abierta: oferta.abierta,
	tipo_contrato: oferta.tipoContrato,
	numero_puestos: oferta.numeroPuestos,
	fecha_publicacion: dayjs(oferta.fechaPublicacion).format('YYYY-MM-DD'),
	fecha_cierre: dayjs(oferta.fechaCierre).format('YYYY-MM-DD'),
})

const mapOfertaToFront = (oferta: any): Oferta => ({
	...oferta,
	tipoContrato: oferta.tipo_contrato,
	numeroPuestos: oferta.numero_puestos,
	fechaPublicacion: dayjs(oferta.fecha_publicacion),
	fechaCierre: dayjs(oferta.fecha_cierre),
	demandantesInscritos: oferta.demandantes_inscritos,
	idEmpresa: oferta.id_empresa,
	empresa: {
		...oferta.empresa,
	},
})
