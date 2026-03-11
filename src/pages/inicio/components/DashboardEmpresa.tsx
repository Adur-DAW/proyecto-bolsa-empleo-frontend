import { Box, Button, Card, CardContent, Container, Grid, IconButton, Paper, Typography } from '@mui/material'
import { IconPlus, IconUsers, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DashboardRepositoryHttp } from '@/shared/repositories/dashboard/dashboard.repository.http'
import dayjs from 'dayjs'

export default function DashboardEmpresa() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard', 'empresa'],
    queryFn: () => DashboardRepositoryHttp.obtenerEmpresa()
  })

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Inicio
        </Typography>
        <Button
          component={Link}
          to="/ofertas/nueva"
          variant="contained"
          startIcon={<IconPlus />}
        >
          Publicar Oferta
        </Button>
      </Box>

      <Grid container spacing={4}>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'secondary.dark', color: 'secondary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <IconUsers size={32} />
                <Typography variant="h6">Candidatos Pendientes</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {data.candidatos_pendientes}
              </Typography>
              <Typography variant="body2">
                Esperando revisión en tus ofertas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>
            Estado de Ofertas Activas
          </Typography>
          <Paper sx={{ overflow: 'hidden' }}>
            {data.ofertas_activas.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No tienes ofertas activas.</Typography>
              </Box>
            ) : (
              <Box>
                {data.ofertas_activas.map((oferta: any, index: number) => (
                  <Box
                    key={oferta.id}
                    sx={{
                      p: 2,
                      borderBottom: index < data.ofertas_activas.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography fontWeight="bold">{oferta.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Publicada: {dayjs(oferta.fecha_publicacion).format('DD/MM/YYYY')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">{oferta.inscritos}</Typography>
                        <Typography variant="caption" color="text.secondary">Inscritos</Typography>
                      </Box>
                      <IconButton component={Link} to={`/ofertas/${oferta.id}`} title="Ver oferta">
                        <IconEye />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
