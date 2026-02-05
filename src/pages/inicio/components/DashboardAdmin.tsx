import { Box, Card, CardContent, Container, Grid, Paper, Typography, LinearProgress } from '@mui/material'
import { IconAlertTriangle, IconActivity, IconBuildingStore, IconUsers } from '@tabler/icons-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DashboardRepositoryHttp } from '@/shared/repositories/dashboard/dashboard.repository.http'
import { Link } from 'react-router'
import dayjs from 'dayjs'

export default function DashboardAdmin() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => DashboardRepositoryHttp.obtenerAdmin()
  })

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Panel de Administración
      </Typography>

      {data.validaciones_pendientes > 0 && (
        <Paper
          component={Link}
          to="/empresas"
          sx={{
            p: 2, mb: 4,
            display: 'flex', alignItems: 'center', gap: 2,
            bgcolor: 'warning.light', color: 'warning.contrastText',
            textDecoration: 'none'
          }}
        >
          <IconAlertTriangle />
          <Typography fontWeight="bold">
            {data.validaciones_pendientes} Empresas pendientes de validación
          </Typography>
          <Typography variant="body2" sx={{ ml: 'auto' }}>Revisar ahora →</Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconActivity size={20} /> Indicadores Clave
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Ofertas Activas</Typography>
                  <Typography fontWeight="bold">{data.kpis.ofertas_activas}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="primary" sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Demandantes</Typography>
                  <Typography fontWeight="bold">{data.kpis.total_demandantes}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="secondary" sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tasa de Éxito (Adjudicadas)</Typography>
                  <Typography fontWeight="bold">{data.kpis.tasa_exito_ofertas}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(data.kpis.tasa_exito_ofertas)}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {data.actividad_reciente.empresas.map((empresa: any, index: number) => (
                  <ElementoActividad
                    key={`emp-${index}`}
                    icon={<IconBuildingStore size={18} />}
                    text={`Nueva empresa registrada: ${empresa.nombre}`}
                    date={empresa.created_at}
                  />
                ))}
                {data.actividad_reciente.demandantes.map((dem: any, index: number) => (
                  <ElementoActividad
                    key={`dem-${index}`}
                    icon={<IconUsers size={18} />}
                    text={`Nuevo candidato: ${dem.nombre} ${dem.apellido1}`}
                    date={dem.created_at}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

function ElementoActividad({ icon, text, date }: { icon: any, text: string, date: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
      <Box sx={{ flex: 1, textAlign: 'left' }}>
        <Typography variant="body2">{text}</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {dayjs(date).format('DD/MM HH:mm')}
      </Typography>
    </Box>
  )
}
