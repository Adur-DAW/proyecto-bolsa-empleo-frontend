import { deleteEntity, getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

// import { EmpresasRepository } from './empresas.repository'

export const EmpresasRepositoryHttp = {
	obtener: async (search?: string, familiaProfesionalId?: number): Promise<Empresa[]> => {
		const queryParams = new URLSearchParams()
		if (search) queryParams.append('search', search)
		if (familiaProfesionalId) queryParams.append('familia_profesional_id', familiaProfesionalId.toString())

		const empresas = (await getEntity(`/empresas?${queryParams.toString()}`)) as any[]

		return empresas.map((x: any) => ({
			...x,
			idEmpresa: x.id_empresa,
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
	actualizar: async (empresa: Empresa) => {
		return await putEntity(`/empresas/`, empresa)
	},
	validar: async (idEmpresa: number) => {
		return putEntity(`/empresas/${idEmpresa}/validar`, {})
	},
	eliminar: async (idEmpresa: number) => {
		return deleteEntity(`/empresas/${idEmpresa}`)
	},
}
