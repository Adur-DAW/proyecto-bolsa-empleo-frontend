import { Box, Skeleton } from '@mui/material'
import { useSecureAsset } from '@/shared/hooks/useSecureAsset'

interface ImagenSeguraProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
	src?: string | null
	width?: string | number
	height?: string | number
}

export const ImagenSegura = ({ src, width, height, style, ...props }: ImagenSeguraProps) => {
	const { src: secureSrc, loading, error } = useSecureAsset(src)

	if (loading) {
		return <Skeleton variant="rectangular" width={width} height={height} />
	}

	if (error || !secureSrc) {
		return <Box sx={{ width, height, bgcolor: 'action.disabledBackground', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚠️</Box>
	}

	return (
		<img
			{...props}
			src={secureSrc}
			style={{
				width,
				height,
				objectFit: 'cover',
				...style,
			}}
		/>
	)
}
