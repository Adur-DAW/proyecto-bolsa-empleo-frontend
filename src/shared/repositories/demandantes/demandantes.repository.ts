import { Demandante } from '@/shared/models'

export type DemandantesRepository = {
	obtenerJWT: () => Promise<Demandante>
	obtenerPorId: (id: number) => Promise<Demandante>
	actualizar: (datos: Demandante) => Promise<void>
}
