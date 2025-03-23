import { postEntity } from '@/shared/http/api.service'
import { Usuario } from '@/shared/models'

import { AuthRepository } from './auth.repository'

export const AuthRepositoryHttp: AuthRepository = {
	login: async (datos: {
		email: string
		password: string
	}): Promise<{ usuario: Usuario; token: string }> => {
		return postEntity('/login', datos)
	},
	registrar: async (datos: {
		email: string
		password: string
		password_confirmation: string
	}) => {
		return postEntity('/registrar', datos)
	},
}
