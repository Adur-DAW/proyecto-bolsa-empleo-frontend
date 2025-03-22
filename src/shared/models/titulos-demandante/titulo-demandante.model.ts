import { Titulo } from '../titulos/titulo.model'

export type TituloDemandante = {
	idDemandante: number
	idTitulo: number
	centro: string
	año: string
	titulo: Titulo
}
