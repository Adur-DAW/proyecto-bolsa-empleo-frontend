import { getEntity } from '@/shared/http/api.service'
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

export default function AdminDashboardPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => await getEntity<any>('/admin/stats')
    })

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box mt={4}>
                <Typography color="error">Error al cargar las estadísticas</Typography>
            </Box>
        )
    }

    // Transform data for chart if needed, or use directly if format matches
    // Data format from backend: [{ total: 5, mes: '2025-01' }, ...]
    const chartData = stats.ofertas_por_mes || []

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Panel de Administración
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr 1fr',
                    },
                    gap: 3,
                    marginBottom: 4,
                }}
            >
                <StatCard title="Ofertas Totales" value={stats.total_ofertas} />
                <StatCard title="Ofertas Adjudicadas" value={stats.ofertas_adjudicadas} />
                <StatCard title="Demandantes" value={stats.total_demandantes} />
                <StatCard title="Empresas" value={stats.total_empresas} />
            </Box>

            <Typography variant="h5" gutterBottom mt={4}>
                Evolución de Ofertas Publicadas
            </Typography>
            <Box height={400} width="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="Ofertas" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

function StatCard({ title, value }: { title: string, value: number }) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h3" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}
