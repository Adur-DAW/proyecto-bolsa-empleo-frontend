import { getEntity } from "../http/api.service";

export interface FamiliaProfesional {
  id: number;
  nombre: string;
}

export interface TipoContrato {
  id: number;
  nombre: string;
}

export const MaestrosRepository = {
  obtenerFamilias: async (): Promise<FamiliaProfesional[]> => {
    const response = await getEntity<FamiliaProfesional[]>('/maestros/familias-profesionales');
    return response ?? [];
  },
  obtenerTiposContrato: async (): Promise<TipoContrato[]> => {
    const response = await getEntity<TipoContrato[]>('/maestros/tipos-contrato');
    return response ?? [];
  }
};
