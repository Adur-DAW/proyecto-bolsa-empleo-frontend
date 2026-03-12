import { Suspense } from 'react'
import useRol from '@/shared/hooks/rol.hook'
import DashboardInvitado from './components/DashboardInvitado'
import DashboardDemandante from './components/DashboardDemandante'
import DashboardEmpresa from './components/DashboardEmpresa'
import DashboardAdmin from './components/DashboardAdmin'

export default function InicioPage() {
	const { rol } = useRol()

	return (
		<Suspense fallback={<div>Cargando panel...</div>}>
			{rol === 'sinRol' && <DashboardInvitado />}
			{rol === 'demandante' && <DashboardDemandante />}
			{rol === 'empresa' && <DashboardEmpresa />}
			{rol === 'centro' && <DashboardAdmin />}
		</Suspense>
	)
}
