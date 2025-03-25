import { TiposUsuario } from '../enums/tipos-usuario.enum'
import { useAppStore } from '../store/store'

const jerarquiaRoles: Record<TiposUsuario, number> = {
	sinRol: 0,
	demandante: 1,
	empresa: 2,
	centro: 3,
}

export default function useRol() {
	const usuario = useAppStore((x) => x.usuario)
	const rol = usuario?.rol ?? 'sinRol'

	const masRol = (rolNecesario: TiposUsuario) => {
		return jerarquiaRoles[rol] >= jerarquiaRoles[rolNecesario]
	}

	const mismoRol = (rolNecesario: TiposUsuario) => {
		return rol === rolNecesario
	}

	return {
		rol,
		masRol,
		mismoRol
	}
}
