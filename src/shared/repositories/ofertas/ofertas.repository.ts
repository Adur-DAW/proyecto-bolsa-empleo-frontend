import { Oferta } from '@/shared/models'

export type OfertasRepository = {
	obtener: () => Promise<Oferta[]>
	obtenerPorEmpresa: () => Promise<Oferta[]>
	obtenerPorDemandante: () => Promise<Oferta[]>
	obtenerPorId: (id: number) => Promise<Oferta>
	registrar: (oferta: Oferta) => Promise<{ oferta: Oferta }>
	actualizar: (oferta: Oferta) => Promise<void>
}
