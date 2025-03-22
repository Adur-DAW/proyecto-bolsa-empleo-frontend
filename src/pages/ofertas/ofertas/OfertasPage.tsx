import { Container, Box } from "@mui/material";
import OfertasLista from "./components/OfertasLista";
import OfertasFiltros from "./components/OfertasFiltros";

export default function OfertasPage() {
	return (
		<Container>
			<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
				<OfertasFiltros />
				<Box sx={{ flex: 1 }}>
					<OfertasLista />
				</Box>
			</Box>
		</Container>
	);
}
