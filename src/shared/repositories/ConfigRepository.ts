import { getEntity } from '../http/api.service'

export interface AppConfig {
  ofertas_publicas: boolean
}

export const ConfigRepository = {
  obtener: async (): Promise<AppConfig> => {
    return await getEntity<AppConfig>('/config') ?? { ofertas_publicas: false }
  },
}
