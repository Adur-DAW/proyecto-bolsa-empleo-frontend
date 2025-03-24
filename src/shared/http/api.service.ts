import axiosInstance from './axios'

export const getEntity = async <T>(
	endpoint: string,
	params?: { [key: string]: string | number }
) => {
	if (params) {
		const queryString = Object.entries(params)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
			)
			.join('&')
		endpoint += `?${queryString}`
	}

	try {
		const response = await axiosInstance.get(`${endpoint}`)

		const pagination = response.headers['x-pagination']

		if (pagination) {
			return {
				data: (await response.data) as T,
				pagination: JSON.parse(pagination),
			} as T
		}

		return response.data as T
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data)
		}
		throw new Error()
	}
}

export const postEntity = async <T>(endpoint: string, data) => {
	try {
		const response = await axiosInstance.post(`${endpoint}`, data)
		return response.data as T
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(JSON.stringify(error.response.data))
		}
		throw new Error()
	}
}

export const putEntity = async <T>(endpoint: string, data) => {
	try {
		const response = await axiosInstance.put(`${endpoint}`, data)
		return response.data as T
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(JSON.stringify(error.response.data))
		}
		throw new Error()
	}
}

export const deleteEntity = async <T>(endpoint: string) => {
	try {
		const response = await axiosInstance.delete(`${endpoint}`)
		return response.data as T
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(JSON.stringify(error.response.data))
		}
		throw new Error()
	}
}

export const toQueryString = (params: Record<string, any>) => {
	return (
		'?' +
		Object.keys(params)
			.map((key) => key + '=' + encodeURIComponent(params[key]))
			.join('&')
	)
}

export interface Pagination {
	CurrentPage: number
	TotalPageCount: number
}
