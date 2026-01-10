import { useQuery } from '@tanstack/react-query'
import { MaestrosRepository } from '@/shared/repositories/MaestrosRepository'

export const useFamiliasQuery = () => {
  return useQuery({
    queryKey: ['familias'],
    queryFn: MaestrosRepository.obtenerFamilias,
    staleTime: 1000 * 60 * 60 * 24 // 24 hours
  })
}
