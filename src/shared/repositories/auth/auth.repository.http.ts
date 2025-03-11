import { postEntity } from "@/shared/http/api.service"
import { AuthRepository } from "./auth.repository"
import { Usuario } from "@/shared/models"

export const AuthRepositoryHttp: AuthRepository  = {
	login: async (datos: { email: string, password: string}): Promise<{ token: string, usuario: Usuario }> => {
		return postEntity('/login', datos)
	},
	registrar: async (datos: { email: string, password: string, password_confirmation: string}) => {
		postEntity('/registrar', datos)
	}
}
