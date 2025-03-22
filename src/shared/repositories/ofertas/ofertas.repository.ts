import { Oferta } from '@/shared/models'

export type OfertasRepository = {
	obtener: () => Promise
	registrar: (datos: { oferta: Oferta }) => Promise
}
