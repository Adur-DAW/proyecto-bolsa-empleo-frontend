import dayjs from 'dayjs'

import { Empresa } from '../empresas/empresa.model'

export type Oferta = {
	nombre: string
	fechaPublicacion: dayjs.Dayjs
	numeroPuestos: number
	tipoContrato: string
	horario: string
	obs: string
	abierta: boolean
	fechaCierre: dayjs.Dayjs
	idEmpresa: number
	empresa: Empresa
	id: number
}
