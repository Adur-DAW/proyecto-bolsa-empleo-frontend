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

type TarjetaEmpresaProps = {
  titulo: ReactNode
  subtitulo?: ReactNode
  avatar?: ReactNode
  etiquetas?: ReactNode
  detalles?: ReactNode[]
  acciones?: ReactNode
  onClick?: () => void
  to?: string
}

export default function TarjetaEmpresa({
  titulo,
  subtitulo,
  avatar,
  etiquetas,
  detalles = [],
  acciones,
  onClick,
  to
}: TarjetaEmpresaProps) {
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
        transition: 'all 0.1s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: `0 8px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          transform: 'translateY(-1px)'
        },
        cursor: (onClick || to) ? 'pointer' : 'default',
        bgcolor: 'background.paper'
      }}
      onClick={onClick}
      component={CardWrapper}
      {...wrapperProps}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, alignItems: 'flex-start' }}>
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: { xs: 1, sm: 2 }, mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5, wordBreak: 'break-word' }}>
                  {titulo}
                </Typography>
                {subtitulo && (
                  <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
                    {subtitulo}
                  </Box>
                )}
              </Box>
              {etiquetas && (
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mt: { xs: 0.5, sm: 0 } }}>
                  {etiquetas}
                </Stack>
              )}
            </Box>

            {detalles.length > 0 && (
              <Box sx={{ mt: 2.5, mb: acciones ? 2 : 0 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                  {detalles.map((detail, index) => (
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

        {acciones && (
          <>
            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'flex-end',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1.5,
                mt: 1
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {acciones}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
