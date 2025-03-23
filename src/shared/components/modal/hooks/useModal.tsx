import { useState } from 'react'

export default function useModal() {
	const [abierto, setAbierto] = useState(false)
	const abrirModal = () => setAbierto(true)
	const cerrarModal = () => setAbierto(false)

	return {
		abierto,
		abrirModal,
		cerrarModal,
	}
}
