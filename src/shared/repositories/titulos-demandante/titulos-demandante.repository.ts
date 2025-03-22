import { TituloDemandante } from '@/shared/models'

export type TitulosDemandanteRepository = {
	obtenerJWT: () => Promise
	registrar: (datos: { tituloDemandante: TituloDemandante }) => Promise
}
