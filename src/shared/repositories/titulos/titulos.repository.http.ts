import { getEntity, postEntity } from "@/shared/http/api.service"
import { TitulosRepository } from "./titulos.repository"
import { Titulo } from "@/shared/models"

export const TitulosRepositoryHttp: TitulosRepository  = {
	obtener: async (): Promise<Titulo[]> => {
		const titulos = await getEntity('/titulos') as any[]

		return titulos.map((x: any) => ({
				...x,
			}
		))
	},
	registrar: async (datos: { titulo: Titulo }) => {
		postEntity('/titulos', datos)
	}
}
