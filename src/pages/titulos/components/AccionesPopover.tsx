import { IconButton, Menu, MenuItem } from '@mui/material'
import { IconDotsVertical } from '@tabler/icons-react'
import { useState } from 'react'

import { Titulo } from '@/shared/models'

export default function AccionesPopover({
	titulo,
	onEditarClick,
	onEliminarClick,
}: {
	titulo: Titulo
	onEditarClick: (titulo: Titulo) => void,
	onEliminarClick: (titulo: Titulo) => void,
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

	const handleEditar = () => {
		onEditarClick(titulo)
		handleClose()
	}

	const handleEliminar = () => {
		onEliminarClick(titulo)
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
				<MenuItem onClick={handleEditar}>Editar</MenuItem>
				<MenuItem onClick={handleEliminar}>Eliminar</MenuItem>
			</Menu>
		</>
	)
}
