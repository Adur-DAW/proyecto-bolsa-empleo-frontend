import { getEntity } from '@/shared/http/api.service'
import { DashboardRepository } from './dashboard.repository'

export const DashboardRepositoryHttp: DashboardRepository = {
  obtenerInvitado: async () => {
    return await getEntity<any>('/dashboard/invitado')
  },
  obtenerDemandante: async () => {
    return await getEntity<any>('/dashboard/demandante')
  },
  obtenerEmpresa: async () => {
    return await getEntity<any>('/dashboard/empresa')
  },
  obtenerAdmin: async () => {
    return await getEntity<any>('/dashboard/admin')
  }
}
