import { StateCreator } from 'zustand'

import { defaultState } from './store'
import { Usuario } from '../models'

export type GeneralState = {
  titulo: string
  token?: string
  usuario?: Usuario
}

export const defaultGeneralState: GeneralState = {
  titulo: 'Bolsa de Empleo - Inicio',
  token: localStorage.getItem('token') || undefined,
  usuario: (() => {
    const user = localStorage.getItem('user')
    return user !== null ? JSON.parse(user) : undefined
  })()
}

export type GeneralActions = {
  setTitulo: (titulo: string) => void
  setUsuario: (usuario: Usuario) => void
  login: (usuario: Usuario) => void
  logout: () => void
}

export const createGeneralSlice: StateCreator<GeneralState & GeneralActions> = (set) => ({
  ...defaultGeneralState,

  reset: () => set(defaultState),

  setTitulo: (titulo: string) => set(() => ({ titulo })),

  setUsuario: (usuario: Usuario) => set(() => ({ usuario })),
  login: (usuario: Usuario) => set(() => ({ usuario })),
  logout: () => set(() => ({ usuario: undefined })),
})
