import { FamiliaProfesional } from '@/shared/repositories/MaestrosRepository'

export type Titulo = {
	id: number
	nombre: string
	id_familia_profesional: number
	familia_profesional?: FamiliaProfesional
}

export type TituloExtra = {
	id: number
	nombre: string
	cantidadDemandantes: number
	cantidadOfertas: number
}
