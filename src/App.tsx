import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './App.css'
import AppRouter from './AppRouter'
import { queryClientConfig } from './shared/providers/react-query.provider'
import ThemeProvider from './shared/theme'

function App() {
	return (
		<QueryClientProvider client={queryClientConfig}>
			<ReactQueryDevtools initialIsOpen={false} />
			<ThemeProvider>
				<AppRouter />
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
