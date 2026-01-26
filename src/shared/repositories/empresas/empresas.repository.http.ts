import {
	RespuestaPaginada,
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
		limit: number = 20
	): Promise<RespuestaPaginada<Empresa>> => {

		const queryParams = new URLSearchParams()

		if (search) queryParams.append('search', search)

		if (idFamiliaProfesional)
			queryParams.append('id_familia', idFamiliaProfesional.toString())

		if (ordenarPor)
			queryParams.append('ordenar_por', ordenarPor)

		queryParams.append('pagina', pagina.toString())
		queryParams.append('limit', limit.toString())

		const response = await getEntity<RespuestaPaginada<any>>(
			`/empresas?${queryParams.toString()}`
		)

		if (!response)
			return {
				pagina_actual: 1,
				data: [],
				primera_pagina_url: '',
				desde: 0,
				ultima_pagina: 1,
				ultima_pagina_url: '',
				links: [],
				siguiente_pagina_url: null,
				path: '',
				per_pagina: limit,
				pagina_anterior_url: null,
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
			})),
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
