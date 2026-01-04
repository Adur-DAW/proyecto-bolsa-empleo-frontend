import { postEntity } from '@/shared/http/api.service'
import { Usuario } from '@/shared/models'

import { AuthRepository } from './auth.repository'

export const AuthRepositoryHttp: AuthRepository = {
	login: async (datos: {
		email: string
		password: string
	}): Promise<{ usuario: Usuario; token: string }> => {
		const res = await postEntity<{ usuario: Usuario; token: string }>('/login', datos)
		if (!res) throw new Error('Error al iniciar sesión')
		return res
	},
	registrar: async (datos: {
		email: string
		password: string
		password_confirmation: string
	}) => {
		return postEntity('/registrar', datos)
	},
}
