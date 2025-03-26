import { Titulo, TituloExtra } from '@/shared/models'

export type TitulosRepository = {
	obtener: () => Promise<Titulo[]>
	obtenerExtra: () => Promise<TituloExtra[]>
	registrar: (titulo: Titulo) => Promise<void>
	eliminar: (id: number) => Promise<void>
}
