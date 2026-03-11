import { useQuery } from '@tanstack/react-query'
import { AuthRepositoryHttp } from '../repositories/auth/auth.repository.http'
import { EmpresasRepositoryHttp } from '../repositories/empresas/empresas.repository.http'
import { DemandantesRepositoryHttp } from '../repositories/demandantes/demandantes.repository.http'
import { useAppStore } from '../store/store'

export const useUsuarioQuery = () => {
	const usuario = useAppStore((state) => state.usuario)
	const token = useAppStore((state) => state.token)

	return useQuery({
		queryKey: ['usuario-perfil'],
		queryFn: async () => {
			if (!usuario) return null

			if (usuario.rol === 'empresa') {
				return await EmpresasRepositoryHttp.obtenerJWT()
			}

			if (usuario.rol === 'demandante') {
				return await DemandantesRepositoryHttp.obtenerJWT()
			}

			return await AuthRepositoryHttp.obtenerPerfil()
		},
		enabled: !!token && !!usuario,
	})
}
