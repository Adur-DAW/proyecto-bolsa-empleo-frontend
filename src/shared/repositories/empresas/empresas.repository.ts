import { Empresa } from '@/shared/models'

export type EmpresasRepository = {
	obtener: () => Promise
	registrar: (datos: { empresa: Empresa }) => Promise
}
