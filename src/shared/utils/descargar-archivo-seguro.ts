import { toast } from 'sonner'
import axiosInstance, { backendHost } from "../http/axios"

export const descargarArchivoSeguro = async (url: string, nombreArchivo: string) => {
	try {
		const urlCompleta = url.startsWith('http') ? url : `${backendHost}${url}`

		const response = await axiosInstance.get(urlCompleta, {
			responseType: 'blob',
		})

		const blob = new Blob([response.data], { type: response.headers['content-type'] })
		const downloadUrl = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = downloadUrl
		link.setAttribute('download', nombreArchivo)
		document.body.appendChild(link)
		link.click()
		link.remove()
		window.URL.revokeObjectURL(downloadUrl)
	} catch (error) {
		console.error('Error al descargar el archivo:', error)
		toast.error('No se pudo descargar el archivo. Es posible que no tengas permisos.')
	}
}
