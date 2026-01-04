import { getEntity } from "@/shared/http/api.service"

interface Estadisticas {
  totales: {
    ofertas: number
    ofertas_adjudicadas: number
    demandantes: number
    empresas: number
  }
  registros: {
    periodo: string
    demandantes: number
    empresas: number
  }[]
  ofertas: {
    periodo: string
    total_publicadas: number
    total_adjudicadas: number
  }[]
  top_familias: {
    familia_profesional: string
    total: number
  }[]
  localidades: {
    localidad: string
    total: number
  }[]
  tiempo_resolucion: number
  top_empresas: {
    nombre: string
    total_ofertas: number
  }[]
  funnel: {
    inscritos: number
    adjudicados: number
  }
  estado_ofertas: {
    abiertas: number
    adjudicadas: number
    cerradas_sin_adjudicar: number
  }
  top_titulos: {
    nombre: string
    familia_profesional: string
    total_ofertas: number
  }[]
}

export const AdminRepositoryHttp = {
  obtenerEstadisticas: async (filtros?: { fechaInicio?: string; fechaFin?: string; familia?: string }) => {
    const params = new URLSearchParams()
    if (filtros?.fechaInicio) params.append('fechaInicio', filtros.fechaInicio)
    if (filtros?.fechaFin) params.append('fechaFin', filtros.fechaFin)
    if (filtros?.familia) params.append('familia', filtros.familia)

    return await getEntity<Estadisticas>(`/admin/stats?${params.toString()}`)
  }
}
