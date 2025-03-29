import { Empresa } from '@/shared/models'

export type EmpresasRepository = {
	obtener: () => Promise<Empresa[]>
	obtenerJWT: () => Promise<Empresa>
	registrar: (empresa: Empresa) => Promise<void>
	actualizar: (empresa: Empresa) => Promise<void>
	validar: (idEmpresa: number) => Promise<void>
	eliminar: (idEmpresa: number) => Promise<void>
}
