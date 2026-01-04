import { Box, Card, CardContent, CircularProgress, MenuItem, Paper, TextField, Typography, Button, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
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
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2'
import { useState } from 'react'
import dayjs from 'dayjs'

import { AdminRepositoryHttp } from '@/shared/repositories/admin/admin.repository.http'
import { FAMILIAS_PROFESIONALES } from '@/shared/constants/familias-profesionales'

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

export default function PanelAdminPage() {
    const [filtros, setFiltros] = useState({
        fechaInicio: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
        fechaFin: dayjs().format('YYYY-MM-DD'),
        familia: '' // Nuevo filtro
    })

    const manejarCambioFiltro = (campo: string, valor: string) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }))
    }

    const { data: estadisticas, isLoading, error, refetch } = useQuery({
        queryKey: ['estadisticasAdmin', filtros],
        queryFn: () => AdminRepositoryHttp.obtenerEstadisticas(filtros)
    })

    if (isLoading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
    if (error) return <Typography color="error">Error al cargar estadísticas</Typography>
    if (!estadisticas) return null

    // --- Datos Gráficos ---

    const datosEvolucion = {
        labels: estadisticas.registros.map(r => r.periodo),
        datasets: [
            {
                label: 'Nuevos Demandantes',
                data: estadisticas.registros.map(r => r.demandantes),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            // Si hay filtro familia, empresas vendrá vacío, chart.js lo maneja bien
            ...(estadisticas.registros.some(r => r.empresas > 0) ? [{
                label: 'Nuevas Empresas',
                data: estadisticas.registros.map(r => r.empresas),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }] : []),
        ],
    }

    const datosOfertas = {
        labels: estadisticas.ofertas.map(o => o.periodo),
        datasets: [
            {
                label: 'Publicadas',
                data: estadisticas.ofertas.map(o => o.total_publicadas),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Adjudicadas',
                data: estadisticas.ofertas.map(o => o.total_adjudicadas),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    }

    const datosEstadoOfertas = {
        labels: ['Abiertas', 'Adjudicadas', 'Cerradas (Sin cubrir)'],
        datasets: [
            {
                data: [
                    estadisticas.estado_ofertas?.abiertas ?? 0,
                    estadisticas.estado_ofertas?.adjudicadas ?? 0,
                    estadisticas.estado_ofertas?.cerradas_sin_adjudicar ?? 0
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const datosTopFamilias = {
        labels: estadisticas.top_familias.map(f => f.familia_profesional),
        datasets: [{
            label: '# Demandantes',
            data: estadisticas.top_familias.map(f => f.total),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(40, 159, 64, 0.6)',
                'rgba(210, 80, 80, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)',
                'rgba(40, 159, 64, 1)',
                'rgba(210, 80, 80, 1)',
            ],
            borderWidth: 1,
        }]
    }

    // Ratio Funnel
    const conversionRate = estadisticas.funnel.inscritos > 0
        ? ((estadisticas.funnel.adjudicados / estadisticas.funnel.inscritos) * 100).toFixed(1)
        : 0

    return (
        <Box p={3}>
            {/* Header y Filtros */}
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Panel de Control
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <TextField
                            select
                            label="Filtrar por Familia"
                            value={filtros.familia}
                            onChange={(e) => manejarCambioFiltro('familia', e.target.value)}
                            sx={{ minWidth: 200 }}
                            SelectProps={{ displayEmpty: true }}
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {FAMILIAS_PROFESIONALES.map(f => (
                                <MenuItem key={f} value={f}>{f}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Desde"
                            type="date"
                            value={filtros.fechaInicio}
                            onChange={(e) => manejarCambioFiltro('fechaInicio', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Hasta"
                            type="date"
                            value={filtros.fechaFin}
                            onChange={(e) => manejarCambioFiltro('fechaFin', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button variant="contained" onClick={() => refetch()} size="large">
                            Actualizar
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* KPI Cards (Totales + Nuevas Métricas) */}
            <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Ofertas Publicadas" valor={estadisticas.totales.ofertas} color="#4caf50" />
                </Box>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Ofertas Adjudicadas" valor={estadisticas.totales.ofertas_adjudicadas} color="#2196f3" />
                </Box>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Resolución Media (Días)" valor={`${estadisticas.tiempo_resolucion || 0}d`} color="#ff9800" subtext="Tiempo medio en cubrir oferta" />
                </Box>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Tasa de Conversión" valor={`${conversionRate}%`} color="#9c27b0" subtext={`${estadisticas.funnel.adjudicados} de ${estadisticas.funnel.inscritos} inscripciones`} />
                </Box>
            </Box>

            {/* Fila 1: Evolución y Estado */}
            <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                <Box flex="2 1 600px">
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" mb={2} color="text.secondary">Evolución de Actividad</Typography>
                        <Box height={300}>
                            <Line data={datosEvolucion} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Box>
                <Box flex="1 1 300px">
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" mb={2} color="text.secondary">Estado de Ofertas</Typography>
                        <Box height={300} display="flex" justifyContent="center">
                            <Pie data={datosEstadoOfertas} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Fila 2: Eficacia y Top Familias */}
            <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                <Box flex="2 1 500px">
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} color="text.secondary">Publicadas vs Adjudicadas</Typography>
                        <Bar data={datosOfertas} />
                    </Paper>
                </Box>
                <Box flex="1 1 400px">
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} color="text.secondary">Top 10 Familias (Global)</Typography>
                        <Doughnut data={datosTopFamilias} />
                    </Paper>
                </Box>
            </Box>

            {/* Fila 3: Rankings (Tablas) */}
            <Box display="flex" flexWrap="wrap" gap={3}>
                {/* Ranking Empresas */}
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

                {/* Ranking Títulos */}
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

                {/* Top Localidades */}
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
        </Box>
    )
}

function TarjetaStat({ titulo, valor, color, subtext }: { titulo: string, valor: string | number, color: string, subtext?: string }) {
    return (
        <Card sx={{ borderTop: `4px solid ${color}`, height: '100%' }}>
            <CardContent>
                <Typography color="textSecondary" variant="subtitle2" gutterBottom>{titulo}</Typography>
                <Typography variant="h4" fontWeight="bold">{valor}</Typography>
                {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
            </CardContent>
        </Card>
    )
}
