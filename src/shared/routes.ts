type Route = {
	relativePath: string
	absolutePath: string
}

const createRouting = <T>(route: { [K in keyof T]: Route }) => route

const routing = createRouting({
	root: {
		relativePath: '/',
		absolutePath: '/',
	},
	inicio: {
		relativePath: '',
		absolutePath: '/',
	},
	login: {
		relativePath: 'login',
		absolutePath: '/login',
	},
	registro: {
		relativePath: 'registro',
		absolutePath: '/registro',
	},
	ofertas: {
		relativePath: 'ofertas',
		absolutePath: '/ofertas',
	},
	ofertas_detalle: {
		relativePath: ':id',
		absolutePath: '/ofertas/:id',
	},
	ofertas_editar: {
		relativePath: ':id',
		absolutePath: '/ofertas/:id/editar',
	},
	ofertas_crear: {
		relativePath: 'nueva',
		absolutePath: '/ofertas/nueva',
	},
	empresas: {
		relativePath: 'empresas',
		absolutePath: '/empresas',
	},
	configuracion: {
		relativePath: 'configuracion',
		absolutePath: '/configuracion',
	},
})

export const getRelativePath = (name: keyof typeof routing): string =>
	routing[name].relativePath
export const getAbsolutePath = (name: keyof typeof routing): string =>
	routing[name].absolutePath
