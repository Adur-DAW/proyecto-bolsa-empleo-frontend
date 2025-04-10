// import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import {
	ThemeProvider as MUIThemeProvider,
	createTheme,
} from '@mui/material/styles'
import { ReactNode, useMemo } from 'react'

import { grey } from './colors'
import { customShadows } from './custom-shadows'
import { overrides } from './overrides'
import { palette, palette_dark } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'

interface ThemeProviderProps {
	children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
	// const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

	const isLightMode = true

	const memoizedValue: any = useMemo(
		() => ({
			palette: isLightMode ? palette() : palette_dark(),
			typography,
			shadows: shadows(isLightMode ? grey[500] : grey[900]),
			customShadows: customShadows(),
			shape: { borderRadius: 8 },
		}),
		[isLightMode]
	)

	const currentTheme = createTheme(memoizedValue)
	currentTheme.components = overrides(currentTheme) as any

	return (
		<MUIThemeProvider theme={currentTheme}>
			<CssBaseline />
			{children}
		</MUIThemeProvider>
	)
}
