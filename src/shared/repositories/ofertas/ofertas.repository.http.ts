import dayjs from 'dayjs'

import {
	RespuestaPaginada,
	RespuestaPaginadaBackend,
	getEntity,
	postEntity,
	putEntity,
} from '@/shared/http/api.service'
import { Oferta } from '@/shared/models'

export const OfertasRepositoryHttp = {
	obtener: async (params?: {
		pagina?: number
		limite?: number
		search?: string
		idEmpresa?: number
		estado?: string
		ordenarPor?: string
		idFamilia?: number
		inscrito?: string
	}): Promise<RespuestaPaginada<Oferta>> => {
		const queryParams = new URLSearchParams()

		if (params?.pagina) queryParams.append('pagina', params.pagina.toString())

		if (params?.limite) queryParams.append('limite', params.limite.toString())

		if (params?.search) queryParams.append('search', params.search)

		if (params?.idEmpresa)
			queryParams.append('id_empresa', params.idEmpresa.toString())

		if (params?.estado) queryParams.append('estado', params.estado)

		if (params?.ordenarPor)
			queryParams.append('ordenar_por', params.ordenarPor)

		if (params?.idFamilia)
			queryParams.append('id_familia', params.idFamilia.toString())

		if (params?.inscrito)
			queryParams.append('inscrito', params.inscrito)

		const response = await getEntity<RespuestaPaginadaBackend<any>>(
			`/ofertas?${queryParams.toString()}`
		)

		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			paginaActual: response?.current_page || 1,
			ultimaPagina: response?.last_page || 1,
			primeraPaginaUrl: response?.first_page_url || '',
			ultimaPaginaUrl: response?.last_page_url || '',
			links: response?.links || [],
			siguientePaginaUrl: response?.next_page_url || null,
			desde: response?.from || 0,
			porPagina: response?.per_page || 0,
			hasta: response?.to || 0,
			total: response?.total || 0,
			paginaAnteriorUrl: response?.prev_page_url || null,
			path: response?.path || '',
		}
	},
	obtenerPorDemandante: async (params?: {
		pagina?: number
		limite?: number
		search?: string
		estado?: string
		ordenarPor?: string
		idFamilia?: number
		inscrito?: string
	}): Promise<RespuestaPaginada<Oferta>> => {
		const queryParams = new URLSearchParams()

		if (params?.pagina) queryParams.append('pagina', params.pagina.toString())

		if (params?.limite) queryParams.append('limite', params.limite.toString())

		if (params?.search) queryParams.append('search', params.search)

		if (params?.estado) queryParams.append('estado', params.estado)

		if (params?.ordenarPor)
			queryParams.append('ordenar_por', params.ordenarPor)

		if (params?.idFamilia)
			queryParams.append('id_familia', params.idFamilia.toString())

		if (params?.inscrito)
			queryParams.append('inscrito', params.inscrito)

		const response = await getEntity<RespuestaPaginadaBackend<any>>(
			`/demandantes/jwt/ofertas-por-titulos?${queryParams.toString()}`
		)

		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			paginaActual: response?.current_page || 1,
			ultimaPagina: response?.last_page || 1,
			primeraPaginaUrl: response?.first_page_url || '',
			ultimaPaginaUrl: response?.last_page_url || '',
			links: response?.links || [],
			siguientePaginaUrl: response?.next_page_url || null,
			desde: response?.from || 0,
			porPagina: response?.per_page || 0,
			hasta: response?.to || 0,
			total: response?.total || 0,
			paginaAnteriorUrl: response?.prev_page_url || null,
			path: response?.path || '',
		}
	},
	obtenerPorEmpresa: async (params?: {
		pagina?: number
		limite?: number
		search?: string
		estado?: string
		ordenarPor?: string
		idFamilia?: number
	}): Promise<RespuestaPaginada<Oferta>> => {
		const queryParams = new URLSearchParams()
		if (params?.pagina) queryParams.append('pagina', params.pagina.toString())

		if (params?.limite) queryParams.append('limite', params.limite.toString())

		if (params?.search) queryParams.append('search', params.search)

		if (params?.estado) queryParams.append('estado', params.estado)

		if (params?.ordenarPor)
			queryParams.append('ordenar_por', params.ordenarPor)

		if (params?.idFamilia)
			queryParams.append('id_familia', params.idFamilia.toString())

		const response = await getEntity<RespuestaPaginadaBackend<any>>(
			`/empresas/jwt/ofertas?${queryParams.toString()}`
		)
		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			paginaActual: response?.current_page || 1,
			ultimaPagina: response?.last_page || 1,
			primeraPaginaUrl: response?.first_page_url || '',
			ultimaPaginaUrl: response?.last_page_url || '',
			links: response?.links || [],
			siguientePaginaUrl: response?.next_page_url || null,
			desde: response?.from || 0,
			porPagina: response?.per_page || 0,
			hasta: response?.to || 0,
			total: response?.total || 0,
			paginaAnteriorUrl: response?.prev_page_url || null,
			path: response?.path || '',
		}
	},

	obtenerPorId: async (id: number): Promise<Oferta> => {
		const oferta = await getEntity<any>(`/ofertas/${id}`)

		return mapOfertaToFront(oferta)
	},
	registrar: async (oferta: Oferta) => {
		return await postEntity<any>('/ofertas/', mapOfertaToBack(oferta))
	},
	actualizar: async (oferta: Oferta) => {
		return await putEntity<void>(
			`/ofertas/${oferta.id}`,
			mapOfertaToBack(oferta)
		)
	},
}

const mapOfertaToBack = (oferta: Oferta): any => ({
	nombre: oferta.nombre,
	horario: oferta.horario,
	dias_descanso: oferta.diasDescanso,
	obs: oferta.obs,
	abierta: oferta.abierta,
	id_tipo_contrato: oferta.idTipoContrato,
	numero_puestos: oferta.numeroPuestos,
	fecha_publicacion: (oferta.fechaPublicacion && dayjs(oferta.fechaPublicacion).isValid()) 
		? dayjs(oferta.fechaPublicacion).format('YYYY-MM-DD') 
		: null,
	fecha_cierre: (oferta.fechaCierre && dayjs(oferta.fechaCierre).isValid()) 
		? dayjs(oferta.fechaCierre).format('YYYY-MM-DD') 
		: null,
})

const mapOfertaToFront = (oferta: any): Oferta => ({
	...oferta,
	idTipoContrato: oferta.id_tipo_contrato,
	diasDescanso: oferta.dias_descanso,
	numeroPuestos: oferta.numero_puestos,
	fechaPublicacion: oferta.fecha_publicacion ? dayjs(oferta.fecha_publicacion) : dayjs(),
	fechaCierre: oferta.fecha_cierre ? dayjs(oferta.fecha_cierre) : null,
	abierta: !!oferta.abierta && (oferta.fecha_cierre ? !dayjs(oferta.fecha_cierre).isBefore(dayjs(), 'day') : true),
	demandantesInscritos: oferta.demandantes_inscritos,
	idEmpresa: oferta.id_empresa,
	tipoContrato: oferta.id_tipo_contrato == 1
		? { id: 1, nombre: 'Jornada Completa' }
		: { id: 2, nombre: 'Media Jornada' },
	empresa: {
		...oferta.empresa,
	},
})
