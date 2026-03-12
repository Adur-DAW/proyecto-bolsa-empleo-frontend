import { IconButton, Menu, MenuItem } from '@mui/material'
import { IconDotsVertical } from '@tabler/icons-react'
import { useState } from 'react'

import { Demandante } from '@/shared/models'

import { useNavigate } from 'react-router'
import { getAbsolutePath } from '@/shared/routes'
import { descargarArchivoSeguro } from '@/shared/utils/descargar-archivo-seguro'

export default function AccionesPopover({
	demandante,
	onAdjudicarClick,
	onRechazarClick,
}: {
	demandante: Demandante
	onAdjudicarClick: (demandante: Demandante) => void
	onRechazarClick: (demandante: Demandante) => void
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const navigate = useNavigate()

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleAdjudicar = () => {
		onAdjudicarClick(demandante)
		handleClose()
	}

	const handleRechazar = () => {
		onRechazarClick(demandante)
		handleClose()
	}

	const handleDescargarCv = () => {
		if (demandante.cvUrl) {
			descargarArchivoSeguro(demandante.cvUrl, `CV_${demandante.nombre}_${demandante.apellido1}.pdf`)
		}
		handleClose()
	}

	const handleVerPerfil = () => {
		navigate(getAbsolutePath('demandante_detalle').replace(':id', demandante.idDemandante.toString()))
		handleClose()
	}

	return (
		<>
			<IconButton onClick={handleOpen}>
				<IconDotsVertical />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				{!demandante.adjudicado && !demandante.rechazada && (
					<MenuItem onClick={handleAdjudicar}>Adjudicar</MenuItem>
				)}
				{!demandante.adjudicado && !demandante.rechazada && (
					<MenuItem onClick={handleRechazar}>Rechazar</MenuItem>
				)}
				{demandante.cvUrl && (
					<MenuItem onClick={handleDescargarCv}>Descargar CV</MenuItem>
				)}
				<MenuItem onClick={handleVerPerfil}>Ver perfil</MenuItem>
			</Menu>
		</>
	)
}
