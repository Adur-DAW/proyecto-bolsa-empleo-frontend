import { Box, Button, Typography, Paper } from '@mui/material'
import { IconAlertTriangle } from '@tabler/icons-react'

interface ErrorStateProps {
  message?: string
  retry?: () => void
}

export default function ErrorState({
  message = 'Ha ocurrido un error al cargar los datos.',
  retry,
}: ErrorStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'error.main',
        bgcolor: 'error.lighter'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <IconAlertTriangle size={48} color="var(--mui-palette-error-main)" />
      </Box>
      <Typography variant="h6" color="error" gutterBottom>
        ¡Vaya! Algo salió mal
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {retry && (
        <Button variant="outlined" color="error" onClick={retry}>
          Reintentar
        </Button>
      )}
    </Paper>
  )
}
