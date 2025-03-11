import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import AppLayout from "./AppLayout";

import InicioPage from "@/pages/inicio/InicioPage";
import OfertaEditarPage from "@/pages/ofertas/oferta-editar/OfertaEditar";
import OfertaPage from "@/pages/ofertas/oferta/OfertaPage";
import OfertasPage from "@/pages/ofertas/ofertas/OfertasPage";
import LoginPage from "@/pages/auth/login/LoginPage";
import RegistrarPage from "@/pages/auth/registrar/RegistrarPage";
import { useAppStore } from "./shared/store/store";
import { getAbsolutePath } from "./shared/routes";

export default function AppRouter() {
	const usuario = useAppStore(x => x.usuario)
	console.log(usuario)

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path={getAbsolutePath('login')} element={<LoginPage />} />
					<Route path={getAbsolutePath('registro')} element={<RegistrarPage />} />

					<Route path={getAbsolutePath('root')} element={<InicioPage />} />

					<Route
						element={usuario ? <Outlet /> : <Navigate to={getAbsolutePath('login')} />}
					>
						<Route path={getAbsolutePath('ofertas')}>
							<Route index element={<OfertasPage />} />
							<Route path={getAbsolutePath('ofertas_detalle')} element={<OfertaPage />} />
							<Route path={getAbsolutePath('ofertas_editar')} element={<OfertaEditarPage />} />
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
