import { Oferta } from '@/shared/models'

export type OfertasRepository = {
	obtener: () => Promise<Oferta[]>
	registrar: (datos: { oferta: Oferta }) => Promise<void>
}
