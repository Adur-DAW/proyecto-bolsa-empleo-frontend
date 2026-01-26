export type Empresa = {
	idEmpresa: number
	nombre: string
	localidad: string
	familiaProfesional: any
	validado: boolean
	cantidadOfertas?: number
	cantidadVacantes?: number
	telefono: string
	cif?: string
	imagen_url?: string
	id_familia_profesional?: number
}
