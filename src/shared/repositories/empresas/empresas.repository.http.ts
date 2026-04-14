import {
	RespuestaPaginada,
	RespuestaPaginadaBackend,
	deleteEntity,
	getEntity,
	postEntity,
	putEntity,
} from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

export const EmpresasRepositoryHttp = {
	obtener: async (
		search?: string,
		idFamiliaProfesional?: number,
		ordenarPor?: string,
		pagina: number = 1,
		limit: number = 20,
		validado?: string
	): Promise<RespuestaPaginada<Empresa>> => {
		const queryParams = new URLSearchParams()

		if (search) queryParams.append('search', search)

		if (idFamiliaProfesional)
			queryParams.append('id_familia', idFamiliaProfesional.toString())

		if (ordenarPor) queryParams.append('ordenar_por', ordenarPor)
		if (validado) queryParams.append('validado', validado)

		queryParams.append('pagina', pagina.toString())
		queryParams.append('limit', limit.toString())

		const response = await getEntity<RespuestaPaginadaBackend<any>>(
			`/empresas?${queryParams.toString()}`
		)

		if (!response)
			return {
				paginaActual: 1,
				data: [],
				primeraPaginaUrl: '',
				desde: 0,
				ultimaPagina: 1,
				ultimaPaginaUrl: '',
				links: [],
				siguientePaginaUrl: null,
				path: '',
				porPagina: limit,
				paginaAnteriorUrl: null,
				hasta: 0,
				total: 0,
			}

		return {
			...response,
			data: response.data.map((x: any) => ({
				...x,
				idEmpresa: x.id_empresa,
				cantidadOfertas: x.ofertas_count,
				cantidadVacantes: x.vacantes,
				familiaProfesional: x.familia_profesional ? {
					id: x.familia_profesional?.id,
					nombre: x.familia_profesional?.nombre,
				} : null,
				imagenUrl: x.imagen_url,
				idFamiliaProfesional: x.id_familia_profesional,
			})),
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
	obtenerPorId: async (id: number): Promise<Empresa> => {
		const empresa = (await getEntity(`/empresas/${id}`)) as any
		return {
			...empresa,
			idEmpresa: empresa.id_empresa,
			imagenUrl: empresa.imagen_url,
		}
	},
	obtenerJWT: async (): Promise<Empresa> => {
		const response = (await getEntity('/empresas/jwt')) as any
		if (!response) return null as any

		return {
			...response,
			idEmpresa: response.id_empresa,
			imagenUrl: response.imagen_url,
		}
	},
	registrar: async (empresa: Empresa) => {
		return await postEntity('/empresas/', empresa)
	},
	actualizar: async (payload: Empresa | FormData) => {
		if (payload instanceof FormData) {
			payload.append('_method', 'PUT')
			return await postEntity('/empresas', payload)
		}
		return await putEntity(`/empresas/`, payload)
	},
	validar: async (idEmpresa: number) => {
		return putEntity(`/empresas/${idEmpresa}/validar`, {})
	},
	eliminar: async (idEmpresa: number) => {
		return deleteEntity(`/empresas/${idEmpresa}`)
	},
}
