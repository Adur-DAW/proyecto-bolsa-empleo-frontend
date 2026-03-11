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
	IconChartBar,
	IconHome,
	IconLetterA,
	IconListCheck,
	IconLogout,
	IconMenu,
	IconSettings,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { useUsuarioQuery } from '@/shared/hooks/useUsuarioQuery'
import useLogout from '@/shared/hooks/logout.hook'
import { useNavbar } from '@/shared/hooks/navbar.hook'
import { ConfigRepository } from '@/shared/repositories/ConfigRepository'
import { getAbsolutePath } from '@/shared/routes'


interface Menu {
	name: string
	icon: any
	link: string
	submenus?: Menu[]
}

export default function Navbar() {
	const navigate = useNavigate()

	const { onLogout } = useLogout()
	const { data: usuarioPerfil } = useUsuarioQuery()
	const { usuario: usuarioStore } = useRol()

	const usuario = usuarioPerfil
		? {
			...usuarioStore,
			...usuarioPerfil,
			nombreCompleto:
				(usuarioPerfil as any).nombre ||
				(usuarioPerfil as any).nombreCompleto ||
				usuarioStore?.nombreCompleto,
			imagenUrl: (usuarioPerfil as any).imagenUrl || usuarioStore?.imagenUrl,
		}
		: usuarioStore

	const { data: config } = useQuery({
		queryKey: ['appConfig'],
		queryFn: ConfigRepository.obtener,
		initialData: { ofertas_publicas: false },
	})

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

	const paginas = [
		{
			texto: 'Inicio',
			to: getAbsolutePath('inicio'),
			icono: <IconHome />,
		},
	]

	if (config.ofertas_publicas || usuario) {
		paginas.push({
			texto: 'Ofertas',
			to: getAbsolutePath('ofertas'),
			icono: <IconListCheck />,
		})

		if (usuario?.rol !== 'empresa') {
			paginas.push({
				texto: 'Empresas',
				to: getAbsolutePath('empresas'),
				icono: <IconBuildingCommunity />,
			})
		}
	}

	if (usuario?.rol === 'centro') {
		paginas.push({
			texto: 'Titulos',
			to: getAbsolutePath('titulos'),
			icono: <IconLetterA />,
		})
		paginas.push({
			texto: 'Admin',
			to: getAbsolutePath('admin'),
			icono: <IconChartBar />,
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
						{paginas.length > 1 &&
							paginas.map((pagina) => (
								<MenuItem
									key={pagina.to}
									onClick={handleCloseNavMenu}
									sx={{ display: 'flex', gap: 1 }}
								>
									{pagina.icono}
									<Link
										style={{ textAlign: 'center', color: 'black' }}
										to={pagina.to}
									>
										{pagina.texto}
									</Link>
								</MenuItem>
							))}
					</Menu>
				</Box>

				<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
					{paginas.length > 1 &&
						paginas.map((pagina) => (
							<Link
								key={pagina.to}
								style={{
									color: 'white',
									fontSize: '1rem',
									padding: '1rem',
									display: 'flex',
									alignItems: 'center',
									gap: '.5rem',
									fontWeight: location.pathname === pagina.to ? 'bold' : 'normal',
								}}
								to={pagina.to}
								onClick={handleCloseNavMenu}
							>
								{pagina.icono}
								{pagina.texto}
							</Link>
						))}
				</Box>

				{usuario && (
					<Box sx={{ flexGrow: 0 }}>
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar
								alt={usuario.nombreCompleto}
								src={usuario.imagenUrl}
							>
								{usuario.nombreCompleto?.charAt(0)}
							</Avatar>
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
