import { Empresa } from '@/shared/models'

export type EmpresasRepository = {
	obtener: () => Promise<Empresa[]>
	registrar: (datos: { empresa: Empresa }) => Promise<void>
}
