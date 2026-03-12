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

const defaultOptions: any = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom',
			labels: {
				usePointStyle: true,
				padding: 20,
				font: { size: 12 }
			}
		},
		tooltip: {
			backgroundColor: 'rgba(0,0,0,0.8)',
			padding: 12,
			cornerRadius: 8,
			titleFont: { size: 14, weight: 'bold' },
			bodyFont: { size: 13 },
			displayColors: true
		}
	},
	scales: {
		x: { grid: { display: false } },
		y: {
			beginAtZero: true,
			grid: { borderDash: [5, 5], color: 'rgba(0,0,0,0.05)' }
		}
	},
	animation: {
		duration: 1500,
		easing: 'easeInOutQuart'
	}
}

export default function EstadisticasGraficos({ estadisticas, colores: COLORES }: EstadisticasGraficosProps) {
	return (
		<>
			<Box display="flex" flexWrap="wrap" gap={3} mb={4}>
				<Box flex="2 1 600px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
						<Typography variant="h6" mb={3} fontWeight="bold">Evolución de Actividad</Typography>
						<Box height={350}>
							<Line data={{
								labels: estadisticas.registros.map((r: any) => r.periodo),
								datasets: [
									{
										label: 'Demandantes',
										data: estadisticas.registros.map((r: any) => r.demandantes),
										borderColor: COLORES.demandantes,
										backgroundColor: COLORES.demandantes + '20',
										fill: true,
										tension: 0.4,
										pointRadius: 4,
										pointHoverRadius: 6,
									},
									...(estadisticas.registros.some((r: any) => r.empresas > 0) ? [{
										label: 'Empresas',
										data: estadisticas.registros.map((r: any) => r.empresas),
										borderColor: COLORES.empresas,
										backgroundColor: COLORES.empresas + '20',
										fill: true,
										tension: 0.4,
										pointRadius: 4,
										pointHoverRadius: 6,
									}] : []),
								]
							}} options={defaultOptions} />
						</Box>
					</Paper>
				</Box>
				<Box flex="1 1 300px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
						<Typography variant="h6" mb={3} fontWeight="bold">Estado de Ofertas</Typography>
						<Box height={350} display="flex" justifyContent="center">
							<Pie data={{
								labels: ['Abiertas', 'Adjudicadas', 'Finalizadas'],
								datasets: [{
									data: [
										estadisticas.estado_ofertas.abiertas,
										estadisticas.estado_ofertas.adjudicadas,
										estadisticas.estado_ofertas.cerradas_sin_adjudicar
									],
									backgroundColor: [COLORES.ofertas, COLORES.adjudicadas, '#cfd8dc'],
									borderWidth: 0,
								}]
							}} options={{ 
								...defaultOptions, 
								scales: undefined,
								plugins: { ...defaultOptions.plugins, legend: { position: 'bottom' } } 
							}} />
						</Box>
					</Paper>
				</Box>
			</Box>

			<Box display="flex" flexWrap="wrap" gap={3} mb={4}>
				<Box flex="2 1 500px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" mb={3} fontWeight="bold">Ofertas publicadas vs adjudicadas</Typography>
						<Box height={350}>
							<Bar data={{
								labels: estadisticas.ofertas.map((o: any) => o.periodo),
								datasets: [
									{
										label: 'Publicadas',
										data: estadisticas.ofertas.map((o: any) => o.total_publicadas),
										backgroundColor: COLORES.ofertas + 'cc',
										borderRadius: 6,
									},
									{
										label: 'Adjudicadas',
										data: estadisticas.ofertas.map((o: any) => o.total_adjudicadas),
										backgroundColor: COLORES.adjudicadas + 'cc',
										borderRadius: 6,
									},
								]
							}} options={defaultOptions} />
						</Box>
					</Paper>
				</Box>
				<Box flex="1 1 400px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" mb={3} fontWeight="bold">Top 10 Familias</Typography>
						<Box height={350}>
							<Doughnut data={{
								labels: estadisticas.top_familias.map((f: any) => f.familia_profesional),
								datasets: [{
									label: '# Demandantes',
									data: estadisticas.top_familias.map((f: any) => f.total),
									backgroundColor: [
										'#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
										'#FF9F40', '#E7E9ED', '#8AC249', '#009688', '#607D8B'
									],
									borderWidth: 0,
								}]
							}} options={{ 
								...defaultOptions, 
								cutout: '70%',
								scales: undefined,
								plugins: { ...defaultOptions.plugins, legend: { position: 'right', labels: { boxWidth: 10 } } } 
							}} />
						</Box>
					</Paper>
				</Box>
			</Box>

			<Box display="flex" flexWrap="wrap" gap={3}>
				<Box flex="1 1 300px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" mb={2} fontWeight="bold">Top Empresas (Ofertas)</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2 }}>
							{estadisticas.top_empresas?.length > 0 ? estadisticas.top_empresas.map((e, i) => (
								<Box key={i} display="contents">
									<Typography variant="body2" color="text.primary">{e.nombre}</Typography>
									<Typography variant="body2" fontWeight="bold" color="primary">{e.total_ofertas}</Typography>
									<Divider sx={{ gridColumn: 'span 2', opacity: 0.5 }} />
								</Box>
							)) : <Typography variant="caption" sx={{ gridColumn: 'span 2' }}>Sin datos</Typography>}
						</Box>
					</Paper>
				</Box>
				<Box flex="1 1 300px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" mb={2} fontWeight="bold">Top Títulos (Ofertas)</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2 }}>
							{estadisticas.top_titulos?.length > 0 ? estadisticas.top_titulos.map((t, i) => (
								<Box key={i} display="contents">
									<Typography variant="body2" noWrap title={t.nombre} color="text.primary">{t.nombre}</Typography>
									<Typography variant="body2" fontWeight="bold" color="primary">{t.total_ofertas}</Typography>
									<Divider sx={{ gridColumn: 'span 2', opacity: 0.5 }} />
								</Box>
							)) : <Typography variant="caption" sx={{ gridColumn: 'span 2' }}>Sin datos</Typography>}
						</Box>
					</Paper>
				</Box>
				<Box flex="1 1 300px">
					<Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" mb={2} fontWeight="bold">Distribución Empresas</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2 }}>
							{estadisticas.localidades?.length > 0 ? estadisticas.localidades.map((loc, i) => (
								<Box key={i} display="contents">
									<Typography variant="body2" color="text.primary">{loc.localidad || 'Desconocido'}</Typography>
									<Typography variant="body2" fontWeight="bold" color="primary">{loc.total}</Typography>
									<Divider sx={{ gridColumn: 'span 2', opacity: 0.5 }} />
								</Box>
							)) : <Typography variant="caption" sx={{ gridColumn: 'span 2' }}>Sin datos</Typography>}
						</Box>
					</Paper>
				</Box>
			</Box>
		</>
	)
}
