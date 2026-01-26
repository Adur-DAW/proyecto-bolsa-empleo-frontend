import { useQuery } from '@tanstack/react-query'
import { AdminRepositoryHttp } from '@/shared/repositories/admin/admin.repository.http'

interface FiltrosAdmin {
  fechaInicio: string
  fechaFin: string
  familia: string
  agrupacion: string
}

export const useEstadisticasAdministracion = (filtros: FiltrosAdmin) => {
  const { data: estadisticas, isLoading, error, refetch } = useQuery({
    queryKey: ['estadisticasAdmin', filtros],
    queryFn: () => AdminRepositoryHttp.obtenerEstadisticas(filtros)
  })

  const conversionRate = (estadisticas && estadisticas.funnel.inscritos > 0)
    ? ((estadisticas.funnel.adjudicados / estadisticas.funnel.inscritos) * 100).toFixed(1)
    : 0

  return {
    estadisticas,
    isLoading,
    error,
    refetch,
    conversionRate
  }
}
