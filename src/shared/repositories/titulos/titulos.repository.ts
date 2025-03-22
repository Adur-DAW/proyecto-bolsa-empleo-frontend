import { Titulo } from '@/shared/models'

export type TitulosRepository = {
	obtener: () => Promise<Titulo[]>
	registrar: (datos: { titulo: Titulo }) => Promise<void>
}
