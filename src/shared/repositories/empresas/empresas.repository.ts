import { Empresa } from '@/shared/models'

export type EmpresasRepository = {
	obtener: () => Promise<Empresa[]>
	registrar: (datos: { empresa: Empresa }) => Promise<void>
	validar: (idEmpresa: number) => Promise<void>
	eliminar: (idEmpresa: number) => Promise<void>
}
