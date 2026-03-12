import { backendHost } from '../http/axios'

export const getImagenUrl = (url?: string | null): string | undefined => {
	if (!url) return undefined

	if (url.startsWith('http')) {
		return url
	}

	return `${backendHost}${url}`
}
