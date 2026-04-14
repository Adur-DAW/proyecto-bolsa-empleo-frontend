import { useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../store/store'

export default function useLogout() {
	const logout = useAppStore((x) => x.logout)
	const queryClient = useQueryClient()

	const onLogout = () => {
		queryClient.invalidateQueries()
		logout()
		window.location.href = '/'
	}

	return {
		onLogout,
	}
}
