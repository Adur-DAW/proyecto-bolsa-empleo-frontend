import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  useTheme,
  alpha
} from '@mui/material'
import { ReactNode } from 'react'
import { Link } from 'react-router'

interface EntityCardProps {
  title: string
  subtitle?: ReactNode
  avatar?: ReactNode
  badges?: ReactNode
  details?: ReactNode[]
  actions?: ReactNode
  onClick?: () => void
  to?: string
}

export default function EntityCard({
  title,
  subtitle,
  avatar,
  badges,
  details = [],
  actions,
  onClick,
  to
}: EntityCardProps) {
  const theme = useTheme();
  const CardWrapper = to ? Link : 'div';
  const wrapperProps = to ? { to, style: { textDecoration: 'none', color: 'inherit' } } : {};

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          transform: 'translateY(-2px)'
        },
        cursor: (onClick || to) ? 'pointer' : 'default',
        bgcolor: 'background.paper'
      }}
      onClick={onClick}
      // @ts-ignore
      component={CardWrapper}
      {...wrapperProps}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
          {/* Avatar Section */}
          {avatar && (
            <Box
              sx={{
                flexShrink: 0,
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))'
              }}
            >
              {avatar}
            </Box>
          )}

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
                    {subtitle}
                  </Box>
                )}
              </Box>
              {badges && (
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  {badges}
                </Stack>
              )}
            </Box>

            {/* Details Grid */}
            {details.length > 0 && (
              <Box sx={{ mt: 2.5, mb: actions ? 2 : 0 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                  {details.map((detail, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                        typography: 'body2',
                        fontWeight: 500
                      }}
                    >
                      {detail}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Actions Footer - Only render if actions exist */}
        {actions && (
          <>
            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5,
                mt: 1
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
