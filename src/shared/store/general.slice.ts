import { StateCreator } from 'zustand'

import { Usuario } from '../models'

export type GeneralState = {
	titulo: string
	token?: string
	usuario?: Usuario
}

export const defaultGeneralState: GeneralState = {
	titulo: 'Bolsa de Empleo - Inicio',
	token: undefined,
	usuario: undefined,
}

export type GeneralActions = {
	setTitulo: (titulo: string) => void
	setUsuario: (usuario: Usuario) => void
	login: (usuario: Usuario, token: string) => void
	logout: () => void
	reset: () => void
}

export const createGeneralSlice: StateCreator<GeneralState & GeneralActions> = (
	set
) => ({
	...defaultGeneralState,

	reset: () => set(defaultGeneralState),

	setTitulo: (titulo: string) => set(() => ({ titulo })),

	setUsuario: (usuario: Usuario) =>
		set(() => ({ usuario })),

	login: (usuario: Usuario, token: string) =>
		set(() => ({ usuario, token })),

	logout: () =>
		set(() => ({ usuario: undefined, token: undefined })),
})
