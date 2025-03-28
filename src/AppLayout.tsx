import { Box } from '@mui/material'
import { Outlet } from 'react-router'

import { CustomErrorBoundary } from './shared/components/error/ErrorBoundary'
import Navbar from './shared/components/navbar/Navbar'

export default function AppLayout() {
	return (
		<>
			<Navbar />
			<Box sx={{ marginTop: 8 }}>
				<CustomErrorBoundary>
					<Outlet />
				</CustomErrorBoundary>
			</Box>
		</>
	)
}
