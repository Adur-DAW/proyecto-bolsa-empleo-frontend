import dayjs from 'dayjs'

import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Oferta } from '@/shared/models'

// import { OfertasRepository } from './ofertas.repository'

export const OfertasRepositoryHttp = {
	obtener: async (params?: { page: number; limit: number; search?: string; empresa_id?: number; estado?: string; sortBy?: string; familia_id?: number }): Promise<{ data: Oferta[]; nextPage: number | null }> => {
		const queryParams = new URLSearchParams()
		if (params?.page) queryParams.append('page', params.page.toString())
		if (params?.limit) queryParams.append('limit', params.limit.toString())
		if (params?.search) queryParams.append('search', params.search)
		if (params?.empresa_id) queryParams.append('empresa_id', params.empresa_id.toString())
		if (params?.estado) queryParams.append('estado', params.estado)
		if (params?.sortBy) queryParams.append('sort_by', params.sortBy)
		if (params?.familia_id) queryParams.append('familia_id', params.familia_id.toString())

		const response = await getEntity<any>(`/ofertas?${queryParams.toString()}`)

		return {
			data: response.data.map((x: any) => mapOfertaToFront(x)),
			nextPage: response.next_page_url ? response.current_page + 1 : null,
		}
	},
	obtenerPorDemandante: async (params?: { search?: string; estado?: string; sortBy?: string; familia_id?: number }): Promise<Oferta[]> => {
		const queryParams = new URLSearchParams()
		if (params?.search) queryParams.append('search', params.search)
		if (params?.estado) queryParams.append('estado', params.estado)
		if (params?.sortBy) queryParams.append('sort_by', params.sortBy)
		if (params?.familia_id) queryParams.append('familia_id', params.familia_id.toString())

		const ofertas = await getEntity<any>(`/demandantes/jwt/ofertas-por-titulos?${queryParams.toString()}`)
		return ofertas.map((x: any) => mapOfertaToFront(x))
	},
	obtenerPorEmpresa: async (params?: { search?: string; estado?: string; sortBy?: string; familia_id?: number }): Promise<Oferta[]> => {
		const queryParams = new URLSearchParams()
		if (params?.search) queryParams.append('search', params.search)
		if (params?.estado) queryParams.append('estado', params.estado)
		if (params?.sortBy) queryParams.append('sort_by', params.sortBy)
		if (params?.familia_id) queryParams.append('familia_id', params.familia_id.toString())

		const ofertas = await getEntity<any>(`/empresas/jwt/ofertas?${queryParams.toString()}`)
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
	dias_descanso: oferta.diasDescanso,
	obs: oferta.obs,
	abierta: oferta.abierta,
	tipo_contrato_id: oferta.tipoContratoId,
	numero_puestos: oferta.numeroPuestos,
	fecha_publicacion: dayjs(oferta.fechaPublicacion).format('YYYY-MM-DD'),
	fecha_cierre: dayjs(oferta.fechaCierre).format('YYYY-MM-DD'),
})

const mapOfertaToFront = (oferta: any): Oferta => ({
	...oferta,
	tipoContratoId: oferta.tipo_contrato_id,
	tipoContrato: oferta.tipo_contrato, // Object from relation
	diasDescanso: oferta.dias_descanso,
	numeroPuestos: oferta.numero_puestos,
	fechaPublicacion: dayjs(oferta.fecha_publicacion),
	fechaCierre: dayjs(oferta.fecha_cierre),
	demandantesInscritos: oferta.demandantes_inscritos,
	idEmpresa: oferta.id_empresa,
	empresa: {
		...oferta.empresa,
	},
})
