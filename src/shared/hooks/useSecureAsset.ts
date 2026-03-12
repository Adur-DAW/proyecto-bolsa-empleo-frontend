import { useEffect, useState } from 'react'
import axiosInstance from '../http/axios'

export const useSecureAsset = (url?: string | null) => {
	const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined)

	useEffect(() => {
		if (!url) {
			setBlobUrl(undefined)
			return
		}

		if (url.startsWith('http') || url.startsWith('blob:')) {
			setBlobUrl(url)
			return
		}

		if (url.includes('/storage/')) {
			const baseUrl = axiosInstance.defaults.baseURL?.replace('/api', '') || ''
			setBlobUrl(`${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`)
			return
		}

		setBlobUrl(url)
	}, [url])

	return { src: blobUrl, loading: false, error: false }
}
