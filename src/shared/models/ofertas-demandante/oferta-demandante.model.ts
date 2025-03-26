import dayjs from 'dayjs'

import { Oferta } from '../ofertas/oferta.model'
import { Demandante } from '../demandantes/demandante.model'

export type OfertaDemandante = {
	idDemandante: number
	idOferta: number
	adjudicada: boolean
	fecha: dayjs.Dayjs
	oferta: Oferta
	demandante: Demandante
}
