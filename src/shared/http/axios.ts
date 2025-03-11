import axios from 'axios'

import { limpiarLocalStorage } from '@/shared/utils/localStorage.utils'
import { useAppStore } from '@/shared/store/store'


export const baseUrl = 'http://127.0.0.1:8000/api'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
			useAppStore.getState().logout()
			limpiarLocalStorage()
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
