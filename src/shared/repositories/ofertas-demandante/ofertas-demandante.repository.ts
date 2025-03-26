import { Demandante, OfertaDemandante } from '@/shared/models'

export type OfertasDemandanteRepository = {
	obtenerJWT: () => Promise<OfertaDemandante[]>
	registrarJWT: (idOferta: number) => Promise<void>
	eliminarJWT: (idOferta: number) => Promise<void>
	obtenerDemandantesPorIdOferta: (idOferta: number) => Promise<Demandante[]>
	obtenerDemandantesPosiblesPorIdOferta: (idOferta: number) => Promise<Demandante[]>
	adjudicarOferta: (idOferta: number, idDemandante: number) => Promise<void>
	registrarDemandanteYAdjudicar: (idOferta: number, idDemandante: number) => Promise<void>
}
