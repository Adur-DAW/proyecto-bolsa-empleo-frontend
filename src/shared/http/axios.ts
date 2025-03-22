import axios from 'axios'

import { useAppStore } from '@/shared/store/store'

import { limpiarLocalStorage } from '../utils/localStorage.utils'

export const baseUrl = 'http://127.0.0.1:8000/api'

export const refrescarToken = async (): Promise<any> => {
	const respuesta = await fetch(`${baseUrl}/refrescar`, {
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		},
	})
	if (!respuesta.ok) throw new Error()

	return respuesta.json()
}

const refrescarTokenYActualizarLocalStorage = async () => {
	const response = await refrescarToken()
	localStorage.setItem('token', response.token)

	return response.token
}

const axiosInstance = axios.create({
	baseURL: baseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (token) {
			prom.resolve(token)
		} else {
			prom.reject(error)
		}
	})
	failedQueue = []
}

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = 'Bearer ' + token
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = 'Bearer ' + token
						return axiosInstance(originalRequest)
					})
					.catch((err) => {
						return Promise.reject(err)
					})
			}

			originalRequest._retry = true
			isRefreshing = true

			return refrescarTokenYActualizarLocalStorage()
				.then((token) => {
					processQueue(null, token)
					originalRequest.headers['Authorization'] = 'Bearer ' + token
					return axiosInstance(originalRequest)
				})
				.catch((err) => {
					processQueue(err, null)
					useAppStore.getState().logout()
					limpiarLocalStorage()
					return Promise.reject(err)
				})
				.finally(() => {
					isRefreshing = false
				})
		}

		return Promise.reject(error)
	}
)

export default axiosInstance
