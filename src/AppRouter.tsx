import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { lazy, Suspense } from "react";
import AppLayout from "./AppLayout";
import { useAppStore } from "./shared/store/store";
import { getAbsolutePath } from "./shared/routes";
import EmpresasPage from "./pages/empresas/empresas/EmpresasPage";
import ConfiguracionUsuarioPage from "./pages/configuracion/configuracion-usuario/ConfiguracionUsuarioPage";

const InicioPage = lazy(() => import("@/pages/inicio/InicioPage"));
const OfertaEditarPage = lazy(() => import("@/pages/ofertas/oferta-editar/OfertaEditar"));
const OfertaPage = lazy(() => import("@/pages/ofertas/oferta/OfertaPage"));
const OfertasPage = lazy(() => import("@/pages/ofertas/ofertas/OfertasPage"));
const LoginPage = lazy(() => import("@/pages/auth/login/LoginPage"));
const RegistrarPage = lazy(() => import("@/pages/auth/registrar/RegistrarPage"));

export default function AppRouter() {
	const usuario = useAppStore((x) => x.usuario);

	return (
		<BrowserRouter>
			<Suspense fallback={<div>Cargando...</div>}>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path={getAbsolutePath("login")} element={<LoginPage />} />
						<Route path={getAbsolutePath("registro")} element={<RegistrarPage />} />

						<Route path={getAbsolutePath("root")} element={<InicioPage />} />

						<Route path={getAbsolutePath("ofertas")}>
							<Route index element={<OfertasPage />} />
							<Route path={getAbsolutePath("ofertas_detalle")} element={<OfertaPage />} />

							<Route
								element={usuario ? <Outlet /> : <Navigate to={getAbsolutePath("login")} />}
							>
								<Route path={getAbsolutePath("ofertas_editar")} element={<OfertaEditarPage />} />
							</Route>
						</Route>

						<Route
							element={usuario ? <Outlet /> : <Navigate to={getAbsolutePath("login")} />}
						>
							{
								usuario!.rol == 'demandante' && <Route path={getAbsolutePath("configuracion")} element={<ConfiguracionUsuarioPage />} />
							}
						</Route>

						<Route path={getAbsolutePath("empresas")}>
							<Route index element={<EmpresasPage />} />
						</Route>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
