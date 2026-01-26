import { Box, Paper, Typography, Divider } from '@mui/material'
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

type EstadisticasGraficosProps = {
  estadisticas: any
  colores: {
    ofertas: string
    demandantes: string
    empresas: string
    adjudicadas: string
  }
}

export default function EstadisticasGraficos({ estadisticas, colores: COLORES }: EstadisticasGraficosProps) {
  return (
    <>
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box flex="2 1 600px">
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2} color="text.secondary">Evolución de Actividad</Typography>
            <Box height={300}>
              <Line data={{
                labels: estadisticas.registros.map(r => r.periodo),
                datasets: [
                  {
                    label: 'Demandantes',
                    data: estadisticas.registros.map(r => r.demandantes),
                    borderColor: COLORES.demandantes,
                    backgroundColor: COLORES.demandantes + '50',
                  },
                  ...(estadisticas.registros.some(r => r.empresas > 0) ? [{
                    label: 'Empresas',
                    data: estadisticas.registros.map(r => r.empresas),
                    borderColor: COLORES.empresas,
                    backgroundColor: COLORES.empresas + '50',
                  }] : []),
                ]
              }} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Box>
        <Box flex="1 1 300px">
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2} color="text.secondary">Estado de Ofertas</Typography>
            <Box height={300} display="flex" justifyContent="center">
              <Pie data={{
                labels: ['Abiertas', 'Adjudicadas', 'Cerradas'],
                datasets: [{
                  data: [
                    estadisticas.estado_ofertas.abiertas,
                    estadisticas.estado_ofertas.adjudicadas,
                    estadisticas.estado_ofertas.cerradas_sin_adjudicar
                  ],
                  backgroundColor: [COLORES.ofertas, COLORES.adjudicadas, '#e0e0e0']
                }]
              }} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box flex="2 1 500px">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="text.secondary">Publicadas vs Adjudicadas</Typography>
            <Bar data={{
              labels: estadisticas.ofertas.map(o => o.periodo),
              datasets: [
                {
                  label: 'Publicadas',
                  data: estadisticas.ofertas.map(o => o.total_publicadas),
                  backgroundColor: COLORES.ofertas + '99',
                },
                {
                  label: 'Adjudicadas',
                  data: estadisticas.ofertas.map(o => o.total_adjudicadas),
                  backgroundColor: COLORES.adjudicadas + '99',
                },
              ]
            }} />
          </Paper>
        </Box>
        <Box flex="1 1 400px">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="text.secondary">Top 10 Familias (Global)</Typography>
            <Doughnut data={{
              labels: estadisticas.top_familias.map(f => f.familia_profesional),
              datasets: [{
                label: '# Demandantes',
                data: estadisticas.top_familias.map(f => f.total),
                backgroundColor: Object.values(COLORES),
                borderWidth: 1
              }]
            }} />
          </Paper>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex="1 1 300px">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="text.secondary">Top Empresas (+Activas)</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
              {estadisticas.top_empresas?.map((e, i) => (
                <Box key={i} display="contents">
                  <Typography variant="body2">{e.nombre}</Typography>
                  <Typography variant="body2" fontWeight="bold">{e.total_ofertas}</Typography>
                  <Divider sx={{ gridColumn: 'span 2' }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
        <Box flex="1 1 300px">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="text.secondary">Títulos Más Solicitados</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
              {estadisticas.top_titulos?.map((t, i) => (
                <Box key={i} display="contents">
                  <Typography variant="body2" noWrap title={t.nombre}>{t.nombre}</Typography>
                  <Typography variant="body2" fontWeight="bold">{t.total_ofertas}</Typography>
                  <Divider sx={{ gridColumn: 'span 2' }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
        <Box flex="1 1 300px">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} color="text.secondary">Distribución Geográfica</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
              {estadisticas.localidades.map((loc, i) => (
                <Box key={i} display="contents">
                  <Typography variant="body2">{loc.localidad || 'Desconocido'}</Typography>
                  <Typography variant="body2" fontWeight="bold">{loc.total}</Typography>
                  <Divider sx={{ gridColumn: 'span 2' }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  )
}
