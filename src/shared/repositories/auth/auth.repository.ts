import { Usuario } from '@/shared/models'

export type AuthRepository = {
	login: (datos: {
		email: string
		password: string
	}) => Promise<{ usuario: Usuario; token: string }>

	registrar: (datos: {
		email: string
		password: string
		password_confirmation: string
	}) => Promise<void>
}
