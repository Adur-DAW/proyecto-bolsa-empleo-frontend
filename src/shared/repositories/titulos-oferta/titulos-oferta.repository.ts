import { TituloOferta } from '@/shared/models'

export type TitulosOfertaRepository = {
	obtenerPorIdOferta: (id: number) => Promise<TituloOferta[]>
	registrar: (tituloOferta: TituloOferta) => Promise<void>
	eliminar: (tituloOferta: TituloOferta) => Promise<void>
}
