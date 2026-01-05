import { Box, Button, Card, CardContent, Chip, Container, Grid, Paper, Typography } from '@mui/material'
import { IconClock, IconCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DashboardRepositoryHttp } from '@/shared/repositories/dashboard/dashboard.repository.http'
import dayjs from 'dayjs'

export default function DashboardDemandante() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard', 'demandante'],
    queryFn: () => DashboardRepositoryHttp.obtenerDemandante()
  })

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Mis Oportunidades
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column: Matches */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>
            Ofertas que encajan contigo ({data.matches.length})
          </Typography>
          {data.matches.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No hemos encontrado ofertas nuevas para tu perfil hoy.
              </Typography>
              <Button component={Link} to="/ofertas" sx={{ mt: 2 }}>
                Ver todas las ofertas
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.matches.map((oferta: any) => (
                <Card key={oferta.id} variant="outlined">
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {oferta.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {oferta.empresa?.nombre} • {dayjs(oferta.fecha_publicacion).format('DD/MM/YYYY')}
                      </Typography>
                    </Box>
                    <Button component={Link} to={`/ofertas/${oferta.id}`} variant="outlined" size="small">
                      Ver
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right Column: Status & Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Semanal
              </Typography>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {data.nuevas_esta_semana}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nuevas ofertas publicadas esta semana
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            Mis últimas candidaturas
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.mis_candidaturas.map((candidatura: any) => (
              <Paper key={candidatura.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {candidatura.oferta}
                  </Typography>
                  <StatusChip adjudicada={candidatura.adjudicada} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left' }}>
                  {candidatura.empresa}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'left' }}>
                  Inscrito el: {dayjs(candidatura.fecha_inscripcion).format('DD/MM/YYYY')}
                </Typography>
              </Paper>
            ))}
            {data.mis_candidaturas.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No te has inscrito a ninguna oferta recientemente.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

function StatusChip({ adjudicada }: { adjudicada: number }) {
  if (adjudicada) {
    return <Chip icon={<IconCheck size={16} />} label="Adjudicada" color="success" size="small" />
  }
  // Simplificación: si no está adjudicada, asumimos "En proceso" o "Pendiente" 
  // visualmente, aunque podría haber sido rechazada si tuviéramos ese estado explícito separado.
  return <Chip icon={<IconClock size={16} />} label="En proceso" color="warning" size="small" />
}
