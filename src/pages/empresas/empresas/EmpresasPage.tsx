import { Container, Box } from "@mui/material";
import EmpresasLista from "./components/EmpresasLista";

export default function EmpresasPage() {
	return (
		<Container>
			<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
				<Box sx={{ flex: 1 }}>
					<EmpresasLista />
				</Box>
			</Box>
		</Container>
	);
}
