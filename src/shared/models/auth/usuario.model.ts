import { TiposUsuario } from "@/shared/enums/tipos-usuario.enum"

export type Usuario = {
	id: number
	email: string
	rol: TiposUsuario
	nombreCompleto: string
}
