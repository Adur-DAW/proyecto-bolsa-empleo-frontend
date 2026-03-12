export interface DashboardRepository {
  obtenerInvitado(): Promise<any>
  obtenerDemandante(): Promise<any>
  obtenerEmpresa(): Promise<any>
  obtenerAdmin(): Promise<any>
}
