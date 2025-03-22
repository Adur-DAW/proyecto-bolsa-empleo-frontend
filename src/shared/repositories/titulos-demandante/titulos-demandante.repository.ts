import { TituloDemandante } from '@/shared/models'

export type TitulosDemandanteRepository = {
	obtenerJWT: () => Promise<TituloDemandante[]>
	registrar: (datos: { tituloDemandante: TituloDemandante }) => Promise<void>
}
