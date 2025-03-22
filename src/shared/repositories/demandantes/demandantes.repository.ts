import { Demandante } from '@/shared/models'

export type DemandanteRepository = {
	obtenerJWT: () => Promise
	actualizar: (datos: Demandante) => Promise
}
