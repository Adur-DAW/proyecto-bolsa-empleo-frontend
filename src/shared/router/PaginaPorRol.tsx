import { Navigate } from 'react-router'

import { useAppStore } from '@/shared/store/store'

type PaginaPorRolProps = {
	roles: { [key: string]: React.ComponentType }
	redirectTo?: string
}

export default function RPaginaPorRol({
	roles,
	redirectTo = '/login',
}: PaginaPorRolProps) {
	const usuario = useAppStore((x) => x.usuario)

	if (!usuario) {
		return <Navigate to={redirectTo} />
	}

	const Component = roles[usuario.rol]

	if (!Component) {
		return <Navigate to={redirectTo} />
	}

	return <Component />
}
