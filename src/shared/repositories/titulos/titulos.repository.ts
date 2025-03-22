import { Titulo } from '@/shared/models'

export type TitulosRepository = {
	obtener: () => Promise
	registrar: (datos: { titulo: Titulo }) => Promise
}
