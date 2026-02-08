import axios, { InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

import { useAppStore } from '@/shared/store/store'

export const baseUrl = 'http://127.0.0.1:8000/api'

const axiosInstance = axios.create({
	baseURL: baseUrl,
})

axiosInstance.interceptors.request.use(
	(config) => {
		const token = useAppStore.getState().token
		if (token) {
			config.headers.Authorization = 'Bearer ' + token
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

import { refreshTokenService } from '@/shared/services/refresh-token.service'

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean
}

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as CustomAxiosRequestConfig

		if (error.response) {
			const { status } = error.response

			if (status === 401 && !originalRequest._retry) {
				originalRequest._retry = true
				const token = useAppStore.getState().token

				if (token) {
					try {
						const newToken = await refreshTokenService(token)
						useAppStore.getState().login(useAppStore.getState().usuario!, newToken)
						axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken
						originalRequest.headers['Authorization'] = 'Bearer ' + newToken
						return axiosInstance(originalRequest)
					} catch (refreshError) {
						useAppStore.getState().logout()
						toast.error('Tu sesión ha caducado', { description: 'Por favor, inicia sesión de nuevo.' })
						return Promise.reject(refreshError)
					}
				} else {
					useAppStore.getState().logout()
				}
			} else if (status === 403) {
				toast.error('Acceso denegado', { description: 'No tienes permisos para realizar esta acción.' })
			} else if (status >= 500) {
				toast.error('Error del servidor', { description: 'Inténtalo más tarde.' })
			}
		} else {
			toast.error('Error de conexión', { description: 'Comprueba tu conexión a internet.' })
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
