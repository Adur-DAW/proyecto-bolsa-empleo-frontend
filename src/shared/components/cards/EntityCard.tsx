import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography
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
  const CardWrapper = to ? Link : 'div';
  const wrapperProps = to ? { to, style: { textDecoration: 'none', color: 'inherit' } } : {};

  return (
    <Card
      sx={{
        boxShadow: 2,
        transition: '0.2s',
        '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-2px)', boxShadow: 4 },
        cursor: (onClick || to) ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={onClick}
      // @ts-ignore
      component={CardWrapper}
      {...wrapperProps}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left', display: 'flex', gap: 2 }}>
            {avatar && (
              <Box sx={{ flexShrink: 0 }}>
                {avatar}
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                {badges}
              </Box>

              {subtitle && (
                <Box sx={{ mb: 2, color: 'text.secondary' }}>
                  {subtitle}
                </Box>
              )}

              <Stack spacing={0.5}>
                {details.map((detail, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    {typeof detail === 'string' ? (
                      <Typography variant="body2" color="text.secondary">
                        {detail}
                      </Typography>
                    ) : detail}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
          {actions && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1
              }}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking actions
            >
              {actions}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
