import { useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../store/store'
import { limpiarLocalStorage } from '../utils/localStorage.utils'

export default function useLogout() {
	const logout = useAppStore((x) => x.logout)
	const queryClient = useQueryClient()

	const onLogout = () => {
		queryClient.invalidateQueries()
		logout()
		limpiarLocalStorage()
	}

	return {
		onLogout,
	}
}
