import { Box } from '@mui/material'
import { Outlet } from 'react-router'
import { Toaster } from 'sonner'

import { CustomErrorBoundary } from './shared/components/error/ErrorBoundary'
import Navbar from './shared/components/navbar/Navbar'

export default function AppLayout() {
	return (
		<>
			<Navbar />
			<Toaster position="top-center" richColors />
			<Box sx={{ marginTop: 8 }}>
				<CustomErrorBoundary>
					<Outlet />
				</CustomErrorBoundary>
			</Box>
		</>
	)
}
