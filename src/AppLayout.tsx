import { Outlet } from "react-router";
import Navbar from "./shared/components/navbar/Navbar";

export default function AppLayout() {

	return <>
		<Navbar />
		<Outlet />
	</>
}
