import { QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import AppRouter from './AppRouter'
import { queryClientConfig } from './shared/providers/react-query.provider'

function App() {
  return (
    <QueryClientProvider client={queryClientConfig}>
			<AppRouter />
    </QueryClientProvider>
  )
}

export default App
