import { Outlet } from "react-router";
import Navbar from "./shared/components/navbar/Navbar";
import { Box } from "@mui/material";

export default function AppLayout() {

	return <>
		<Navbar />
		<Box sx={{ marginTop: 8 }}>
			<Outlet />
		</Box>
	</>
}
