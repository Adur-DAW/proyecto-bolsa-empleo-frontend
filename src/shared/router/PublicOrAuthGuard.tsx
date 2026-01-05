import { Navigate, Outlet } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/shared/store/store'
import { ConfigRepository } from '@/shared/repositories/ConfigRepository'
import { getAbsolutePath } from '@/shared/routes'

export default function PublicOrAuthGuard() {
  const usuario = useAppStore((state) => state.usuario)

  // Use suspense to block rendering until config is loaded
  const { data: config } = useQuery({
    queryKey: ['appConfig'],
    queryFn: ConfigRepository.obtener,
    initialData: { ofertas_publicas: true },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  if (!config.ofertas_publicas && !usuario) {
    return <Navigate to={getAbsolutePath('login')} replace />
  }

  return <Outlet />
}
