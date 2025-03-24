import { Navigate, Outlet } from 'react-router'

import { useAppStore } from '@/shared/store/store'
import { TiposUsuario } from '../enums/tipos-usuario.enum'
import { getAbsolutePath } from '../routes'

type ProtectedRouteProps = {
	allowedRoles: TiposUsuario[]
	redirectTo?: string
}

export default function ProtectedRoute({
	allowedRoles: rolesAutorizados,
	redirectTo = getAbsolutePath('login'),
}: ProtectedRouteProps) {
	const usuario = useAppStore((x) => x.usuario)

	if (!usuario || !rolesAutorizados.includes(usuario.rol)) {
		return <Navigate to={redirectTo} />
	}

	return <Outlet />
}
