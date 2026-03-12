import { Avatar, Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'

interface TarjetaStatProps {
	titulo: string
	valor: string | number
	color: string
	subtext?: string
	variacion?: number
	icon?: React.ReactNode
}

export default function TarjetaEstadistica({ titulo, valor, color, subtext, variacion, icon }: TarjetaStatProps) {
	const theme = useTheme()

	return (
		<Card sx={{ 
			height: '100%', 
			boxShadow: theme.shadows[4],
			position: 'relative',
			overflow: 'visible',
			'&:before': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '4px',
				backgroundColor: color,
				borderRadius: '4px 4px 0 0'
			}
		}}>
			<CardContent>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<Typography color="textSecondary" variant="overline" fontWeight="bold">{titulo}</Typography>
					{icon && (
						<Avatar sx={{ backgroundColor: color + '20', color: color, width: 40, height: 40 }}>
							{icon}
						</Avatar>
					)}
				</Box>
				
				<Box display="flex" alignItems="baseline" gap={1}>
					<Typography variant="h3" fontWeight="900" sx={{ color: theme.palette.text.primary }}>{valor}</Typography>
					{variacion !== undefined && (
						<Box display="flex" alignItems="center" color={variacion >= 0 ? 'success.main' : 'error.main'}>
							{variacion >= 0 ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
							<Typography variant="caption" fontWeight="bold">
								{Math.abs(variacion)}%
							</Typography>
						</Box>
					)}
				</Box>
				
				{subtext && (
					<Typography variant="caption" display="block" sx={{ mt: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
						{subtext}
					</Typography>
				)}
			</CardContent>
		</Card>
	)
}
