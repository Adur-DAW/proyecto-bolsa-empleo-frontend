import { getEntity, postEntity } from '@/shared/http/api.service'
import { Empresa } from '@/shared/models'

import { EmpresasRepository } from './empresas.repository'

export const EmpresasRepositoryHttp: EmpresasRepository = {
	obtener: async (): Promise<Empresa[]> => {
		const empresas = (await getEntity('/empresas')) as any[]

		return empresas.map((x: any) => ({
			...x,
		}))
	},
	registrar: async (datos: { empresa: Empresa }) => {
		postEntity('/empresas/', datos)
	},
}
