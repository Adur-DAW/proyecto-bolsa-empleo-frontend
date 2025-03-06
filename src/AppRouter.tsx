import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from "./AppLayout";
import InicioPage from "./pages/inicio/InicioPage";
import OfertaEditarPage from "./pages/ofertas/oferta-editar/OfertaEditar";
import OfertaPage from "./pages/ofertas/oferta/OfertaPage";
import OfertasPage from "./pages/ofertas/ofertas/OfertasPage";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>

					<Route path="/" element={<InicioPage />} />

					<Route path="ofertas">
						<Route index element={<OfertasPage />} />
						<Route path=":id" element={<OfertaPage />} />
						<Route path=":id/editar" element={<OfertaEditarPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
