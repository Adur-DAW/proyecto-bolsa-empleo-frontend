import { Navigate, Outlet } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/shared/store/store'
import { ConfigRepository } from '@/shared/repositories/ConfigRepository'
import { getAbsolutePath } from '@/shared/routes'

export default function PublicOrAuthGuard() {
  const usuario = useAppStore((state) => state.usuario)

  const { data: config, isLoading } = useQuery({
    queryKey: ['appConfig'],
    queryFn: ConfigRepository.obtener,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  if (isLoading) {
    return <div>Cargando configuración...</div> // Or a proper Spinner
  }

  // If config is not loaded or ofertas_publicas is false AND user is not logged in, redirect
  if (config && !config.ofertas_publicas && !usuario) {
    return <Navigate to={getAbsolutePath('login')} replace />
  }

  return <Outlet />
}
