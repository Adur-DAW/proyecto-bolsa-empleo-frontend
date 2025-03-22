import { AuthRepositoryHttp } from '@/shared/repositories/auth/auth.repository.http'
import { useAppStore } from '@/shared/store/store'

export default function useLogin() {
	const setUsuario = useAppStore((state) => state.setUsuario)

	const authRepository = AuthRepositoryHttp

	const login = async (datos: { email: string; password: string }) => {
		const { token, usuario } = await authRepository.login(datos)

		localStorage.setItem('token', token)
		setUsuario(usuario)
	}

	return { login }
}
