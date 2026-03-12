import { IconButton, Menu, MenuItem } from '@mui/material'
import { IconDotsVertical } from '@tabler/icons-react'
import { useState } from 'react'

import { Demandante } from '@/shared/models'

import { descargarArchivoSeguro } from '@/shared/utils/descargar-archivo-seguro'

export default function AccionesPopover({
	demandante,
	onAdjudicarClick,
}: {
	demandante: Demandante
	onAdjudicarClick: (demandante: Demandante) => void
}) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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

	const handleDescargarCv = () => {
		if (demandante.cvUrl) {
			descargarArchivoSeguro(demandante.cvUrl, `CV_${demandante.nombre}_${demandante.apellido1}.pdf`)
		}
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
				{!demandante.adjudicado && (
					<MenuItem onClick={handleAdjudicar}>Adjudicar</MenuItem>
				)}
				{demandante.cvUrl && (
					<MenuItem onClick={handleDescargarCv}>Descargar CV</MenuItem>
				)}
				<MenuItem onClick={handleClose}>Ver perfil</MenuItem>
			</Menu>
		</>
	)
}
