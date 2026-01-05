import { Box, Button, Typography } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'

interface Props {
  children: React.ReactNode
}

export default function LimiteAccesoRestringido({ children }: Props) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  )
}

function ErrorFallback({ error }) {
  let isUnauthorized = false

  try {
    const parsed = JSON.parse(error.message)
    if (parsed.error === 'No autorizado') {
      isUnauthorized = true
    }
  } catch {
    // Ignorar error de parseo
  }

  if (isUnauthorized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 4,
        }}
      >
        <Typography variant="h6">
          Debes iniciar sesión para ver este contenido
        </Typography>
        <Button variant="contained" component={Link} to="/login">
          Iniciar sesión
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ color: 'error.main' }}>
      <Typography>Error al cargar el contenido: {error.message}</Typography>
    </Box>
  )
}
