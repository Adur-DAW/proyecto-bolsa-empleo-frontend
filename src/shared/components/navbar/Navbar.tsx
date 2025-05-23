import logoImage from '@/assets/icon.svg'
import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from '@mui/material'
import {
	IconBuildingCommunity,
	IconHome,
	IconLetterA,
	IconListCheck,
	IconLogout,
	IconMenu,
	IconSettings,
} from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'

import useLogout from '@/shared/hooks/logout.hook'
import { useNavbar } from '@/shared/hooks/navbar.hook'
import { getAbsolutePath } from '@/shared/routes'
import { useAppStore } from '@/shared/store/store'

interface Menu {
	name: string
	icon: any
	link: string
	submenus?: Menu[]
}

export default function Navbar() {
	const navigate = useNavigate()

	const { onLogout } = useLogout()
	const usuario = useAppStore((x) => x.usuario)

	const settings = [
		{
			name: 'Configuración',
			icon: <IconSettings />,
			action: () => navigate(getAbsolutePath('configuracion')),
		},
		{
			name: 'Cerrar sesión',
			icon: <IconLogout />,
			action: () => onLogout(),
		},
	]

	const {
		handleOpenUserMenu,
		anchorElNav,
		handleCloseNavMenu,
		anchorElUser,
		handleCloseUserMenu,
		handleOpenNavMenu,
	} = useNavbar()

	const pages = [
		{
			texto: 'Inicio',
			to: getAbsolutePath('inicio'),
			icono: <IconHome />,
		},
		{
			texto: 'Ofertas',
			to: getAbsolutePath('ofertas'),
			icono: <IconListCheck />,
		},
		{
			texto: 'Empresas',
			to: getAbsolutePath('empresas'),
			icono: <IconBuildingCommunity />,
		},
	]

	if (usuario?.rol === 'centro') {
		pages.push({
			texto: 'Titulos',
			to: getAbsolutePath('titulos'),
			icono: <IconLetterA />,
		})
	}

	return (
		<AppBar position="absolute">
			<Toolbar sx={{ pr: '22px' }}>
				<Link
					to={getAbsolutePath('inicio')}
					onClick={handleCloseNavMenu}
					style={{
						display: 'flex',
						alignItems: 'center',
						flexGrow: 1,
						gap: 1,
						color: 'white',
					}}
				>
					<img
						src={logoImage}
						alt="Logo"
						style={{
							width: '40px',
							height: '40px',
						}}
					/>

					<Typography
						component="h1"
						variant="h6"
						noWrap
						sx={{ marginTop: 0.5 }}
					>
						Bolsa Empleo
					</Typography>
				</Link>

				<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
					<IconButton
						size="large"
						aria-label="Menú"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleOpenNavMenu}
						color="inherit"
					>
						<IconMenu />
					</IconButton>
					<Menu
						id="menu-appbar"
						anchorEl={anchorElNav}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						open={Boolean(anchorElNav)}
						onClose={handleCloseNavMenu}
						sx={{ display: { xs: 'block', md: 'none' } }}
					>
						{pages.map((page) => (
							<MenuItem
								key={page.to}
								onClick={handleCloseNavMenu}
								sx={{ display: 'flex', gap: 1 }}
							>
								{page.icono}
								<Link
									style={{ textAlign: 'center', color: 'black' }}
									to={page.to}
								>
									{page.texto}
								</Link>
							</MenuItem>
						))}
					</Menu>
				</Box>

				<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
					{pages.map((page) => (
						<Link
							key={page.to}
							style={{
								color: 'white',
								fontSize: '1rem',
								padding: '1rem',
								display: 'flex',
								alignItems: 'center',
								gap: '.5rem',
								fontWeight: location.pathname === page.to ? 'bold' : 'normal',
							}}
							to={page.to}
							onClick={handleCloseNavMenu}
						>
							{page.icono}
							{page.texto}
						</Link>
					))}
				</Box>

				{usuario && (
					<Box sx={{ flexGrow: 0 }}>
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar alt="Remy Sharp" />
						</IconButton>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							keepMounted
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem
									key={setting.name}
									onClick={() => {
										handleCloseUserMenu()
										setting.action()
									}}
								>
									<ListItemIcon>{setting.icon}</ListItemIcon>
									{setting.name}
								</MenuItem>
							))}
						</Menu>
					</Box>
				)}
				{!usuario && (
					<Link
						to={getAbsolutePath('login')}
						onClick={handleCloseNavMenu}
						style={{
							margin: 2,
							color: 'white',
							display: 'block',
							textDecoration: 'none',
						}}
					>
						Iniciar Sesión
					</Link>
				)}
			</Toolbar>
		</AppBar>
	)
}
