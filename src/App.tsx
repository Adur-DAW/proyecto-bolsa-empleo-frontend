import { QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import AppRouter from './AppRouter'
import { queryClientConfig } from './shared/providers/react-query.provider'
import ThemeProvider from './shared/theme'

function App() {
  return (
    <QueryClientProvider client={queryClientConfig}>
			<ThemeProvider>
				<AppRouter />
			</ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
