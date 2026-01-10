import { useInfiniteQuery } from '@tanstack/react-query'
import { OfertasRepositoryHttp as ofertasRepository } from '@/shared/repositories/ofertas/ofertas.repository.http'
// Define strict types for params if possible, using `any` for now to match repository legacy
export const useOfertasQuery = (params: {
  filtro?: string
  search?: string
  empresaId?: string
  estado?: string
  sortBy?: string
  familiaId?: string
}) => {
  const { filtro, search, empresaId, estado, sortBy, familiaId } = params

  return useInfiniteQuery({
    queryKey: ['ofertas', { filtro, search, empresaId, estado, sortBy, familiaId }],
    queryFn: async ({ pageParam = 1 }) => {
      if (filtro === 'demandante') {
        const res = await ofertasRepository.obtenerPorDemandante({
          search,
          estado,
          sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined
        })
        return { data: res, nextPage: null }
      } else if (filtro === 'empresa') {
        const res = await ofertasRepository.obtenerPorEmpresa({
          search,
          estado,
          sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined
        })
        return { data: res, nextPage: null }
      } else {
        return ofertasRepository.obtener({
          page: pageParam as number,
          limit: 20,
          search: search,
          empresa_id: empresaId ? Number(empresaId) : undefined,
          estado: estado,
          sortBy: sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined
        })
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
