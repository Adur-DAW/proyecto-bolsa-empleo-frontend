import { OfertaDemandante } from '@/shared/models'

export type OfertasDemandanteRepository = {
	obtenerJWT: () => Promise<OfertaDemandante[]>
	registrarJWT: (idOferta: number) => Promise<void>
	eliminarJWT: (idOferta: number) => Promise<void>
}
