import { TituloDemandante } from '@/shared/models'

export type TitulosDemandanteRepository = {
	obtenerJWT: () => Promise<TituloDemandante[]>
	registrar: (tituloDemandante: TituloDemandante) => Promise<void>
}
