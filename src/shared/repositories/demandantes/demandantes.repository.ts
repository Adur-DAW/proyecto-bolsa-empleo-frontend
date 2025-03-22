import { Demandante } from '@/shared/models'

export type DemandantesRepository = {
	obtenerJWT: () => Promise<Demandante>
	actualizar: (datos: Demandante) => Promise<void>
}
