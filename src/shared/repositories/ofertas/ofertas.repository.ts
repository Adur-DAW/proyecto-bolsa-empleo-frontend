import { Oferta } from '@/shared/models'

export type OfertasRepository = {
	obtener: () => Promise<Oferta[]>
	obtenerPorId: (id: number) => Promise<Oferta>
	registrar: (oferta: Oferta) => Promise<void>
	actualizar: (oferta: Oferta) => Promise<void>
}
