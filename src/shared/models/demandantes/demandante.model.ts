import { TituloDemandante } from "../titulos-demandante/titulo-demandante.model"

export type Demandante = {
	idDemandante: number
	idUsuario: number
	dni: string
	nombre: string
	apellido1: string
	apellido2: string
	telefonoMovil: string
	email: string
	situacion: number
	titulos: TituloDemandante[]

	adjudicado: boolean
}
