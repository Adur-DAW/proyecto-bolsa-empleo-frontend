import { useQuery } from '@tanstack/react-query'
import { EmpresasRepositoryHttp as empresasRepository } from '@/shared/repositories/empresas/empresas.repository.http'

interface UseEmpresasQueryProps {
  search?: string
  idFamiliaProfesional?: number | null
  ordenarPor?: string
  pagina?: number
  validado?: string
}

export const useEmpresasQuery = ({ search, idFamiliaProfesional, ordenarPor, pagina = 1, validado }: UseEmpresasQueryProps) => {
  return useQuery({
    queryKey: ['empresas', { search, idFamiliaProfesional, ordenarPor, pagina, validado }],
    queryFn: () => empresasRepository.obtener(
      search,
      idFamiliaProfesional ?? undefined,
      ordenarPor,
      pagina,
      20,
      validado
    ),
  })
}
