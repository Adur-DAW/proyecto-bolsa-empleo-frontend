import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { useAppStore } from '@/shared/store/store'

export default function useLogin() {
	const loginStore = useAppStore((state) => state.login)

	const authRepository = AuthRepositoryHttp

	const login = async (datos: { email: string; password: string }) => {
		const { token, usuario } = await authRepository.login(datos)
		loginStore(usuario, token)
	}

	return { login }
}
