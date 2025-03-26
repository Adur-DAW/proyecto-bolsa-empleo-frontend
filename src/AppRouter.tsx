import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import AppLayout from './AppLayout'
import PaginaPorRol from './shared/router/PaginaPorRol'
import ProtectedRoute from './shared/router/ProtectedRoute'
import { getAbsolutePath } from './shared/routes'

const InicioPage = lazy(() => import('@/pages/inicio/InicioPage'))
const OfertaEditarPage = lazy(
	() => import('@/pages/ofertas/oferta-editar/OfertaEditarPage')
)
const OfertaPage = lazy(() => import('@/pages/ofertas/oferta/OfertaPage'))
const OfertasPage = lazy(() => import('@/pages/ofertas/ofertas/OfertasPage'))
const LoginPage = lazy(() => import('@/pages/auth/login/LoginPage'))
const RegistrarPage = lazy(() => import('@/pages/auth/registrar/RegistrarPage'))
const EmpresasPage = lazy(
	() => import('@/pages/empresas/empresas/EmpresasPage')
)
const ConfiguracionUsuarioPage = lazy(
	() =>
		import(
			'@/pages/configuracion/configuracion-usuario/ConfiguracionUsuarioPage'
		)
)
const ConfiguracionEmpresaPage = lazy(
	() =>
		import(
			'@/pages/configuracion/configuracion-empresa/ConfiguracionEmpresaPage'
		)
)

const TitulosPage = lazy(() => import('./pages/titulos/TitulosPage'))

const OfertaCrearPage = lazy(
	() => import('./pages/ofertas/oferta-crear/OfertaCrearPage')
)

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Cargando...</div>}>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path={getAbsolutePath('login')} element={<LoginPage />} />

						<Route
							path={getAbsolutePath('registro')}
							element={<RegistrarPage />}
						/>

						<Route path={getAbsolutePath('root')} element={<InicioPage />} />

						<Route path={getAbsolutePath('ofertas')}>
							<Route index element={<OfertasPage />} />
							<Route
								path={getAbsolutePath('ofertas_detalle')}
								element={<OfertaPage />}
							/>

							<Route
								element={
									<ProtectedRoute
										allowedRoles={['empresa', 'centro']}
										redirectTo={getAbsolutePath('login')}
									/>
								}
							>
								<Route
									path={getAbsolutePath('ofertas_crear')}
									element={<OfertaCrearPage />}
								/>
								<Route
									path={getAbsolutePath('ofertas_editar')}
									element={<OfertaEditarPage />}
								/>
							</Route>
						</Route>

						<Route
							element={
								<ProtectedRoute
									allowedRoles={['centro']}
									redirectTo={getAbsolutePath('login')}
								/>
							}
						>
							<Route
								path={getAbsolutePath('titulos')}
								element={<TitulosPage />}
							/>
						</Route>

						<Route
							path={getAbsolutePath('configuracion')}
							element={
								<PaginaPorRol
									roles={{
										demandante: ConfiguracionUsuarioPage,
										empresa: ConfiguracionEmpresaPage,
									}}
									redirectTo={getAbsolutePath('login')}
								/>
							}
						/>
						<Route path={getAbsolutePath('empresas')}>
							<Route index element={<EmpresasPage />} />
						</Route>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
