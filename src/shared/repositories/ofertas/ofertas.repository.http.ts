import dayjs from 'dayjs'

import {
	RespuestaPaginada,
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

		const response = await getEntity<RespuestaPaginada<any>>(
			`/ofertas?${queryParams.toString()}`
		)

		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			pagina_actual: response?.pagina_actual || 1,
			ultima_pagina: response?.ultima_pagina || 1,
			primera_pagina_url: response?.primera_pagina_url || '',
			ultima_pagina_url: response?.ultima_pagina_url || '',
			links: response?.links || [],
			siguiente_pagina_url: response?.siguiente_pagina_url || null,
			desde: response?.desde || 0,
			per_pagina: response?.per_pagina || 0,
			hasta: response?.hasta || 0,
			total: response?.total || 0,
			pagina_anterior_url: response?.pagina_anterior_url || null,
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
		const response = await getEntity<RespuestaPaginada<any>>(
			`/demandantes/jwt/ofertas-por-titulos?${queryParams.toString()}`
		)
		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			pagina_actual: response?.pagina_actual || 1,
			ultima_pagina: response?.ultima_pagina || 1,
			primera_pagina_url: response?.primera_pagina_url || '',
			ultima_pagina_url: response?.ultima_pagina_url || '',
			links: response?.links || [],
			siguiente_pagina_url: response?.siguiente_pagina_url || null,
			desde: response?.desde || 0,
			per_pagina: response?.per_pagina || 0,
			hasta: response?.hasta || 0,
			total: response?.total || 0,
			pagina_anterior_url: response?.pagina_anterior_url || null,
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

		const response = await getEntity<RespuestaPaginada<any>>(
			`/empresas/jwt/ofertas?${queryParams.toString()}`
		)
		return {
			...response,
			data: response?.data.map((x: any) => mapOfertaToFront(x)) || [],

			pagina_actual: response?.pagina_actual || 1,
			ultima_pagina: response?.ultima_pagina || 1,
			primera_pagina_url: response?.primera_pagina_url || '',
			ultima_pagina_url: response?.ultima_pagina_url || '',
			links: response?.links || [],
			siguiente_pagina_url: response?.siguiente_pagina_url || null,
			desde: response?.desde || 0,
			per_pagina: response?.per_pagina || 0,
			hasta: response?.hasta || 0,
			total: response?.total || 0,
			pagina_anterior_url: response?.pagina_anterior_url || null,
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
	fecha_publicacion: dayjs(oferta.fechaPublicacion).format('YYYY-MM-DD'),
	fecha_cierre: dayjs(oferta.fechaCierre).format('YYYY-MM-DD'),
})

const mapOfertaToFront = (oferta: any): Oferta => ({
	...oferta,
	idTipoContrato: oferta.id_tipo_contrato,
	tipoContrato: oferta.tipo_contrato,
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
