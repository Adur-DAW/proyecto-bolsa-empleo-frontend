import { StateCreator } from 'zustand'

import { Usuario } from '../models'
import { defaultState } from './store'

export type GeneralState = {
	titulo: string
	token?: string
	usuario?: Usuario
}

export const defaultGeneralState: GeneralState = {
	titulo: 'Bolsa de Empleo - Inicio',
	token: localStorage.getItem('token') || undefined,
	usuario: (() => {
		try {
			const usuario = localStorage.getItem('usuario')
			return usuario !== null ? JSON.parse(usuario) : undefined
		} catch {
			localStorage.removeItem('usuario')
			return undefined
		}
	})(),
}

export type GeneralActions = {
	setTitulo: (titulo: string) => void
	setUsuario: (usuario: Usuario) => void
	login: (usuario: Usuario) => void
	logout: () => void
}

export const createGeneralSlice: StateCreator<GeneralState & GeneralActions> = (
	set
) => ({
	...defaultGeneralState,

	reset: () => set(defaultState),

	setTitulo: (titulo: string) => set(() => ({ titulo })),

	setUsuario: (usuario: Usuario) =>
		set(() => {
			localStorage.setItem('usuario', JSON.stringify(usuario))
			return { usuario }
		}),

	login: (usuario: Usuario) =>
		set(() => {
			localStorage.setItem('usuario', JSON.stringify(usuario))
			return { usuario }
		}),

	logout: () =>
		set(() => {
			localStorage.removeItem('usuario')
			return { usuario: undefined }
		}),
})
