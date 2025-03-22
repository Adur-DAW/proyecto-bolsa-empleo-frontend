import { alpha } from '@mui/material/styles'

import {
	common,
	error,
	grey,
	info,
	primary,
	secondary,
	success,
	warning,
} from './colors'

export const action = {
	hover: alpha(grey[500], 0.08),
	selected: alpha(grey[500], 0.16),
	disabled: alpha(grey[500], 0.8),
	disabledBackground: alpha(grey[500], 0.24),
	focus: alpha(grey[500], 0.24),
	hoverOpacity: 0.08,
	disabledOpacity: 0.48,
}

const base = {
	primary,
	secondary,
	info,
	success,
	warning,
	error,
	grey,
	common,
	divider: alpha(grey[500], 0.2),
	action,
}

export function palette() {
	return {
		...base,
		mode: 'light',
		primary: {
			main: '#5b9ad5',
			dark: '#4878a6',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#202020',
			dark: '#000',
			contrastText: '#FFFFFF',
		},
		text: {
			primary: grey[800],
			secondary: grey[600],
			disabled: grey[500],
		},
		background: {
			paper: '#FFFFFF', //CARD
			default: grey[100], //FONDO
			neutral: grey[200],
		},
		action: {
			...base.action,
			active: grey[600],
		},
	}
}

export function palette_dark() {
	return {
		...base,
		mode: 'dark',
		primary: {
			main: '#4878a6',
		},
		secondary: {
			main: '#404040',
			dark: '#303030',
			contrastText: '#FFFFFF',
		},
		text: {
			primary: grey[100],
			secondary: grey[200],
			disabled: grey[300],
		},
		background: {
			paper: '#161616',
			default: '#121212',
			neutral: grey[200],
		},
		action: {
			...base.action,
			active: grey[600],
		},
	}
}
