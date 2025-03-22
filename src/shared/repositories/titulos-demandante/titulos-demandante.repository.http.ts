import { getEntity, postEntity } from "@/shared/http/api.service"
import { TitulosDemandanteRepository } from "./titulos-demandante.repository"
import { TituloDemandante } from "@/shared/models"

export const TitulosDemandanteRepositoryHttp: TitulosDemandanteRepository  = {
	obtenerJWT: async (): Promise<TituloDemandante[]> => {
		const titulosDemandante = await getEntity('/titulos/demandante/jwt') as any[]
		return titulosDemandante.map((x: any) => ({
				...x,
			}
		))
	},
	registrar: async (datos: { tituloDemandante: TituloDemandante }) => {
		postEntity('/titulos/demandante', datos)
	}
}
