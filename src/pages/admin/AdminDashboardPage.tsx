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
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import { AdminRepositoryHttp } from '@/shared/repositories/admin/admin.repository.http'
import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'

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
        familia: '',
        agrupacion: 'diario'
    })
    const [familias, setFamilias] = useState<FamiliaProfesional[]>([])

    useEffect(() => {
        MaestrosRepository.obtenerFamilias().then(setFamilias)
    }, [])

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

    // Ratio Funnel
    const conversionRate = estadisticas.funnel.inscritos > 0
        ? ((estadisticas.funnel.adjudicados / estadisticas.funnel.inscritos) * 100).toFixed(1)
        : 0

    // Exportar CSV
    const exportarCSV = () => {
        const rows = [
            ['Métrica', 'Valor'],
            ['Ofertas', estadisticas.totales.ofertas],
            ['Adjudicadas', estadisticas.totales.ofertas_adjudicadas],
            ['Demandantes', estadisticas.totales.demandantes],
            [],
            ['Periodo', 'Demandantes', 'Empresas'],
            ...estadisticas.registros.map(r => [r.periodo, r.demandantes, r.empresas])
        ];

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_bolsa.csv");
        document.body.appendChild(link);
        link.click();
    }

    // Colores Unificados
    const COLORS = {
        ofertas: '#4caf50',     // Verde
        demandantes: '#2196f3', // Azul
        empresas: '#ff9800',    // Naranja
        adjudicadas: '#9c27b0'  // Morado
    }

    return (
        <Box p={3}>
            {/* Header y Filtros */}
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Panel de Control
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        {/* Selector Agrupación */}
                        <TextField
                            select
                            label="Agrupar Datos"
                            value={filtros.agrupacion || 'diario'}
                            onChange={(e) => manejarCambioFiltro('agrupacion', e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="diario">Diario</MenuItem>
                            <MenuItem value="mensual">Mensual</MenuItem>
                            <MenuItem value="familia">Por Familia</MenuItem>
                            <MenuItem value="localidad">Por Localidad</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Filtrar por Familia"
                            value={filtros.familia}
                            onChange={(e) => manejarCambioFiltro('familia', e.target.value)}
                            sx={{ minWidth: 200 }}
                            SelectProps={{ displayEmpty: true }}
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {familias.map(f => (
                                <MenuItem key={f.id} value={f.nombre}>{f.nombre}</MenuItem>
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
                        <Button variant="outlined" onClick={exportarCSV}>
                            Exportar CSV
                        </Button>
                        <Button variant="contained" onClick={() => refetch()} size="large">
                            Actualizar
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* KPI Cards (Totales + Nuevas Métricas) */}
            <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Ofertas Publicadas" valor={estadisticas.totales.ofertas} color={COLORS.ofertas} variacion={estadisticas.totales.variacion?.ofertas} />
                </Box>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Adjudicadas" valor={estadisticas.totales.ofertas_adjudicadas} color={COLORS.adjudicadas} variacion={estadisticas.totales.variacion?.ofertas_adjudicadas} />
                </Box>
                <Box flex="1 1 150px">
                    <TarjetaStat titulo="Demandantes Nuevos" valor={estadisticas.totales.demandantes} color={COLORS.demandantes} variacion={estadisticas.totales.variacion?.demandantes} />
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
                            <Line data={{
                                labels: estadisticas.registros.map(r => r.periodo),
                                datasets: [
                                    {
                                        label: 'Demandantes',
                                        data: estadisticas.registros.map(r => r.demandantes),
                                        borderColor: COLORS.demandantes,
                                        backgroundColor: COLORS.demandantes + '50', // opacidad
                                    },
                                    ...(estadisticas.registros.some(r => r.empresas > 0) ? [{
                                        label: 'Empresas',
                                        data: estadisticas.registros.map(r => r.empresas),
                                        borderColor: COLORS.empresas,
                                        backgroundColor: COLORS.empresas + '50',
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
                                    backgroundColor: [COLORS.ofertas, COLORS.adjudicadas, '#e0e0e0']
                                }]
                            }} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Fila 2: Eficacia y Top Familias */}
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
                                    backgroundColor: COLORS.ofertas + '99',
                                },
                                {
                                    label: 'Adjudicadas',
                                    data: estadisticas.ofertas.map(o => o.total_adjudicadas),
                                    backgroundColor: COLORS.adjudicadas + '99',
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
                                backgroundColor: Object.values(COLORS), // Reusar paleta
                                borderWidth: 1
                            }]
                        }} />
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
        </Box>
    )
}

function TarjetaStat({ titulo, valor, color, subtext, variacion }: { titulo: string, valor: string | number, color: string, subtext?: string, variacion?: number }) {
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
