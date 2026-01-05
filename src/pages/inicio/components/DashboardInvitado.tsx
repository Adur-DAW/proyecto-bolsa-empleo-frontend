import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material'
import { IconArrowRight, IconBriefcase, IconUsers, IconBuildingSkyscraper } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DashboardRepositoryHttp } from '@/shared/repositories/dashboard/dashboard.repository.http'

export default function DashboardInvitado() {
  const { data: stats } = useSuspenseQuery({
    queryKey: ['dashboard', 'invitado'],
    queryFn: () => DashboardRepositoryHttp.obtenerInvitado()
  })

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 6, py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Conecta con tu Futuro Profesional
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          La plataforma líder que une a empresas innovadoras con el mejor talento.
          Encuentra prácticas, primer empleo y oportunidades de crecimiento.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/registro"
            variant="contained"
            size="large"
            endIcon={<IconArrowRight />}
          >
            Empezar ahora
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="large"
          >
            Ya tengo cuenta
          </Button>
        </Box>
      </Box>

      {/* Live Stats */}
      <Grid container spacing={3} justifyContent="center">
        <StatCard
          icon={<IconBriefcase size={40} />}
          label="Ofertas Activas"
          value={stats.ofertas_activas}
        />
        <StatCard
          icon={<IconUsers size={40} />}
          label="Candidatos"
          value={stats.candidatos_registrados}
        />
        <StatCard
          icon={<IconBuildingSkyscraper size={40} />}
          label="Empresas"
          value={stats.empresas_colaboradoras}
        />
      </Grid>

      {/* Latest Public Offers (if enabled) */}
      {stats.ultimas_ofertas && stats.ultimas_ofertas.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Últimas Ofertas Publicadas
          </Typography>
          <Grid container spacing={3}>
            {stats.ultimas_ofertas.map((oferta: any) => (
              <Grid size={{ xs: 12, md: 4 }} key={oferta.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" style={{ marginBottom: '8px', fontWeight: 'bold' }}>{oferta.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '16px' }}>
                      {oferta.empresa?.nombre}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/ofertas/${oferta.id}`}
                      size="small"
                    >
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <Grid size={{ xs: 12, sm: 4 }}>
      <Card sx={{ textAlign: 'center', py: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
          <Typography variant="h4" fontWeight="bold">{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
