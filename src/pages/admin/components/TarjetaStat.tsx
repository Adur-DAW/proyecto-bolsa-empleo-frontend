import { Box, Card, CardContent, Typography } from '@mui/material'

interface TarjetaStatProps {
  titulo: string
  valor: string | number
  color: string
  subtext?: string
  variacion?: number
}

export default function TarjetaStat({ titulo, valor, color, subtext, variacion }: TarjetaStatProps) {
  return (
    <Card sx={{ borderTop: `4px solid ${color}`, height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" variant="subtitle2" gutterBottom>{titulo}</Typography>
        <Box display="flex" alignItems="baseline" gap={1}>
          <Typography variant="h4" fontWeight="bold">{valor}</Typography>
          {variacion !== undefined && (
            <Typography variant="body2" color={variacion >= 0 ? 'success.main' : 'error.main'} fontWeight="bold">
              {variacion > 0 ? '+' : ''}{variacion}%
            </Typography>
          )}
        </Box>
        {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
      </CardContent>
    </Card>
  )
}
