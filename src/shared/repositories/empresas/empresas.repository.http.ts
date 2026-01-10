import { deleteEntity, getEntity, postEntity, putEntity, PaginatedResponse } from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

// import { EmpresasRepository } from './empresas.repository'

export const EmpresasRepositoryHttp = {
	obtener: async (search?: string, familiaProfesionalId?: number, sortBy?: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Empresa>> => {
		const queryParams = new URLSearchParams()
		if (search) queryParams.append('search', search)
		if (familiaProfesionalId) queryParams.append('familia_id', familiaProfesionalId.toString())
		if (sortBy) queryParams.append('sort_by', sortBy)
		queryParams.append('page', page.toString())
		queryParams.append('limit', limit.toString())

		const response = (await getEntity<PaginatedResponse<any>>(`/empresas?${queryParams.toString()}`))


		if (!response) return { current_page: 1, data: [], first_page_url: '', from: 0, last_page: 1, last_page_url: '', links: [], next_page_url: null, path: '', per_page: limit, prev_page_url: null, to: 0, total: 0 }

		return {
			...response,
			data: response.data.map((x: any) => ({
				...x,
				idEmpresa: x.id_empresa,
				cantidadOfertas: x.ofertas_count,
				cantidadVacantes: x.vacantes
			}))
		}
	},
	obtenerPorId: async (id: number): Promise<Empresa> => {
		const empresa = (await getEntity(`/empresas/${id}`)) as any
		return {
			...empresa,
			idEmpresa: empresa.id_empresa,
		}
	},
	obtenerJWT: async (): Promise<Empresa> => {
		const empresa = (await getEntity('/empresas/jwt')) as any
		return {
			...empresa,
			idEmpresa: empresa.id_empresa,
		}
	},
	registrar: async (empresa: Empresa) => {
		return await postEntity('/empresas/', empresa)
	},
	actualizar: async (empresa: Empresa | FormData) => {
		return await putEntity(`/empresas/`, empresa)
	},
	validar: async (idEmpresa: number) => {
		return putEntity(`/empresas/${idEmpresa}/validar`, {})
	},
	eliminar: async (idEmpresa: number) => {
		return deleteEntity(`/empresas/${idEmpresa}`)
	},
}
