import { Box, Typography, Button } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { ReactNode } from 'react'

type EmptyStateProps = {
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({
  title = 'No se encontraron datos',
  description = 'Intenta ajustar tus filtros o búsqueda',
  icon,
  action
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      textAlign="center"
    >
      <Box sx={{ color: 'text.disabled', mb: 2 }}>
        {icon || <IconSearch size={64} stroke={1.5} />}
      </Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>

      {action && (
        <Button variant="outlined" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}
