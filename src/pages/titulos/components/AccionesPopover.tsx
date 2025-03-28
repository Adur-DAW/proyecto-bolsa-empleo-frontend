import { IconButton, Menu, MenuItem } from '@mui/material'
import { IconDotsVertical } from '@tabler/icons-react'
import { useState } from 'react'

export default function AccionesPopover({ id }: { id: number }) {
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
		console.log(`Editar título con ID: ${id}`)
		handleClose()
	}

	const handleEliminar = () => {
		console.log(`Eliminar título con ID: ${id}`)
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
