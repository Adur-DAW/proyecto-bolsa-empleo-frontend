import { Avatar, AvatarProps, Skeleton } from '@mui/material'
import { useSecureAsset } from '@/shared/hooks/useSecureAsset'

interface AvatarSeguroProps extends Omit<AvatarProps, 'src'> {
	src?: string | null
}

export const AvatarSeguro = ({ src, children, ...props }: AvatarSeguroProps) => {
	const { src: secureSrc, loading } = useSecureAsset(src)

	if (loading) {
		const size = props.sx as any
		return <Skeleton variant={props.variant === 'rounded' ? 'rounded' : 'circular'} width={size?.width} height={size?.height} />
	}

	return (
		<Avatar {...props} src={secureSrc}>
			{children}
		</Avatar>
	)
}
