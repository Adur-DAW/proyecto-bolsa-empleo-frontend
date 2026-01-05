import dayjs from 'dayjs'

import { Empresa } from '../empresas/empresa.model'

import { TipoContrato } from '@/shared/repositories/MaestrosRepository'

export type Oferta = {
	nombre: string
	fechaPublicacion: dayjs.Dayjs
	numeroPuestos: number
	tipoContratoId: number
	tipoContrato?: TipoContrato
	horario: string
	diasDescanso: string
	obs: string
	abierta: boolean
	fechaCierre: dayjs.Dayjs
	idEmpresa: number
	empresa: Empresa
	id: number
	inscrito: boolean
	demandantesInscritos: number
}

export const ofertaDefault = {
	nombre: '',
	fechaPublicacion: dayjs(),
	numeroPuestos: 1,
	tipoContratoId: 0,
	horario: '',
	diasDescanso: '',
	obs: '',
	abierta: true,
	fechaCierre: dayjs(),
}
