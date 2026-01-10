import { useQuery } from '@tanstack/react-query'
import { OfertasRepositoryHttp as ofertasRepository } from '@/shared/repositories/ofertas/ofertas.repository.http'
// Define strict types for params if possible, using `any` for now to match repository legacy
export const useOfertasQuery = (params: {
  filtro?: string
  search?: string
  empresaId?: string
  estado?: string
  sortBy?: string
  familiaId?: string
  page?: number
}) => {
  const { filtro, search, empresaId, estado, sortBy, familiaId, page = 1 } = params

  return useQuery({
    queryKey: ['ofertas', { filtro, search, empresaId, estado, sortBy, familiaId, page }],
    queryFn: async () => {
      if (filtro === 'demandante') {
        const res = await ofertasRepository.obtenerPorDemandante({
          search,
          estado,
          sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined,
          page,
          limit: 10
        })
        return res
      } else if (filtro === 'empresa') {
        const res = await ofertasRepository.obtenerPorEmpresa({
          search,
          estado,
          sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined,
          page,
          limit: 10
        })
        return res
      } else {
        return ofertasRepository.obtener({
          page,
          limit: 10,
          search: search,
          empresa_id: empresaId ? Number(empresaId) : undefined,
          estado: estado,
          sortBy: sortBy,
          familia_id: familiaId ? Number(familiaId) : undefined
        })
      }
    },
  })
}
