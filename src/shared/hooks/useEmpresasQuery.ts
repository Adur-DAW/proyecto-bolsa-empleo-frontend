import { useQuery } from '@tanstack/react-query'
import { EmpresasRepositoryHttp as empresasRepository } from '@/shared/repositories/empresas/empresas.repository.http'

interface UseEmpresasQueryProps {
  search?: string
  familiaProfesionalId?: number | null
  sortBy?: string
  page?: number
}

export const useEmpresasQuery = ({ search, familiaProfesionalId, sortBy, page = 1 }: UseEmpresasQueryProps) => {
  return useQuery({
    queryKey: ['empresas', { search, familiaProfesionalId, sortBy, page }],
    queryFn: () => empresasRepository.obtener(
      search,
      familiaProfesionalId ?? undefined,
      sortBy,
      page
    ),
  })
}
