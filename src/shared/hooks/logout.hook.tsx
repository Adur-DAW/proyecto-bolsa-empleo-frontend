import { useAppStore } from '../store/store'
import { limpiarLocalStorage } from '../utils/localStorage.utils'

export default function useLogout() {
	const logout = useAppStore((x) => x.logout)

	const onLogout = () => {
		logout()
		limpiarLocalStorage()
	}

	return {
		onLogout,
	}
}
