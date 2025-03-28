import { getEntity, postEntity, putEntity } from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

import { EmpresasRepository } from './empresas.repository'

export const EmpresasRepositoryHttp: EmpresasRepository = {
	obtener: async (): Promise<Empresa[]> => {
		const empresas = (await getEntity('/empresas')) as any[]

		return empresas.map((x: any) => ({
			...x,
			idEmpresa: x.id_empresa,
		}))
	},
	registrar: async (datos: { empresa: Empresa }) => {
		return postEntity('/empresas/', datos)
	},
	validar: async (idEmpresa: number) => {
		return putEntity(`/empresas/${idEmpresa}/validar`, {})
	}
}
