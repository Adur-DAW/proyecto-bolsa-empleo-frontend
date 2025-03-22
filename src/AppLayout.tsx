import { Box } from '@mui/material'
import { Outlet } from 'react-router'

import Navbar from './shared/components/navbar/Navbar'

export default function AppLayout() {
	return (
		<>
			<Navbar />
			<Box sx={{ marginTop: 8 }}>
				<Outlet />
			</Box>
		</>
	)
}
