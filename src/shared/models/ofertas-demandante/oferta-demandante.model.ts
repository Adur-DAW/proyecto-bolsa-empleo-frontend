import dayjs from 'dayjs'

import { Oferta } from '../ofertas/oferta.model'

export type OfertaDemandante = {
	idDemandante: number
	idOferta: number
	adjudicada: boolean
	fecha: dayjs.Dayjs
	oferta: Oferta
}
