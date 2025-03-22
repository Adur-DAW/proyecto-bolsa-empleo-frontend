import { useState } from 'react'

export const useNavbar = () => {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent) => {
		setAnchorElNav(event.currentTarget)
	}
	const handleOpenUserMenu = (event: React.MouseEvent) => {
		setAnchorElUser(event.currentTarget)
	}
	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}
	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	return {
		handleCloseNavMenu,
		handleCloseUserMenu,
		handleOpenNavMenu,
		handleOpenUserMenu,
		anchorElNav,
		anchorElUser,
	}
}
