import { Box, Modal as MUIModal } from '@mui/material'
import React from 'react'

type ModalProps = {
	open: boolean
	onClose: () => void
	children: React.ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
	return (
		<MUIModal open={open} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
					borderRadius: '8px',
				}}
			>
				{children}
			</Box>
		</MUIModal>
	)
}
