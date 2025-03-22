import { postEntity } from '@/shared/http/api.service'
import { Usuario } from '@/shared/models'

import { AuthRepository } from './auth.repository'

export const AuthRepositoryHttp: AuthRepository = {
	login: async (datos: { email: string; password: string }): Promise => {
		return postEntity('/login', datos)
	},
	registrar: async (datos: {
		email: string
		password: string
		password_confirmation: string
	}) => {
		postEntity('/registrar', datos)
	},
}
