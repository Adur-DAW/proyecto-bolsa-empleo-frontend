import { deleteEntity, getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

// import { EmpresasRepository } from './empresas.repository'

export const EmpresasRepositoryHttp = {
	obtener: async (search?: string, familiaProfesionalId?: number, sortBy?: string): Promise<Empresa[]> => {
		const queryParams = new URLSearchParams()
		if (search) queryParams.append('search', search)
		if (familiaProfesionalId) queryParams.append('familia_profesional_id', familiaProfesionalId.toString())
		if (sortBy) queryParams.append('sort_by', sortBy)

		const empresas = (await getEntity(`/empresas?${queryParams.toString()}`)) as any[]

		return empresas.map((x: any) => ({
			...x,
			idEmpresa: x.id_empresa,
			cantidadOfertas: x.ofertas_count,
			cantidadVacantes: x.vacantes
		}))
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
