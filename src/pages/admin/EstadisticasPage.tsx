import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import EmptyState from '@/shared/components/feedback/EmptyState'
import LoadingSkeleton from '@/shared/components/feedback/LoadingSkeleton'
import {
	FamiliaProfesional,
	MaestrosRepository,
} from '@/shared/repositories/MaestrosRepository'

import EstadisticasFiltros from './components/EstadisticasFiltros'
import EstadisticasGraficos from './components/EstadisticasGraficos'
import TarjetaEstadistica from './components/TarjetaEstadistica'
import { useEstadisticasAdministracion } from './hooks/useEstadisticasAdministracion'

export default function EstadisticasPage() {
	const [filtros, setFiltros] = useState({
		fechaInicio: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
		fechaFin: dayjs().format('YYYY-MM-DD'),
		familia: '',
		agrupacion: 'diario',
	})
	const [familias, setFamilias] = useState<FamiliaProfesional[]>([])

	useEffect(() => {
		MaestrosRepository.obtenerFamilias().then(setFamilias)
	}, [])

	const manejarCambioFiltro = (campo: string, valor: string) => {
		setFiltros((prev) => ({ ...prev, [campo]: valor }))
	}

	const { estadisticas, isLoading, error, refetch, conversionRate } =
		useEstadisticasAdministracion(filtros)

	if (isLoading)
		return (
			<Box p={4}>
				<LoadingSkeleton type="dashboard" />
			</Box>
		)
	if (error)
		return <Typography color="error">Error al cargar estadísticas</Typography>
	if (!estadisticas) return <EmptyState title="No hay datos disponibles" />

	const exportarCSV = () => {
		const rows = [
			['Métrica', 'Valor'],
			['Ofertas', estadisticas.totales.ofertas],
			['Adjudicadas', estadisticas.totales.ofertas_adjudicadas],
			['Demandantes', estadisticas.totales.demandantes],
			[],
			['Periodo', 'Demandantes', 'Empresas'],
			...estadisticas.registros.map((r: any) => [
				r.periodo,
				r.demandantes,
				r.empresas,
			]),
		]

		const csvContent =
			'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
		const encodedUri = encodeURI(csvContent)
		const link = document.createElement('a')
		link.setAttribute('href', encodedUri)
		link.setAttribute('download', 'estadisticas_bolsa.csv')
		document.body.appendChild(link)
		link.click()
	}

	const COLORES = {
		ofertas: '#4caf50',
		demandantes: '#2196f3',
		empresas: '#ff9800',
		adjudicadas: '#9c27b0',
	}

	return (
		<Box p={3}>
			<EstadisticasFiltros
				filtros={filtros}
				familias={familias}
				onCambioFiltro={manejarCambioFiltro}
				onExportar={exportarCSV}
				onActualizar={refetch}
			/>

			<Box display="flex" flexWrap="wrap" gap={3} mb={4}>
				<Box flex="1 1 150px">
					<TarjetaEstadistica
						titulo="Ofertas Publicadas"
						valor={estadisticas.totales.ofertas}
						color={COLORES.ofertas}
						variacion={estadisticas.totales.variacion?.ofertas}
					/>
				</Box>
				<Box flex="1 1 150px">
					<TarjetaEstadistica
						titulo="Adjudicadas"
						valor={estadisticas.totales.ofertas_adjudicadas}
						color={COLORES.adjudicadas}
						variacion={estadisticas.totales.variacion?.ofertas_adjudicadas}
					/>
				</Box>
				<Box flex="1 1 150px">
					<TarjetaEstadistica
						titulo="Demandantes Nuevos"
						valor={estadisticas.totales.demandantes}
						color={COLORES.demandantes}
						variacion={estadisticas.totales.variacion?.demandantes}
					/>
				</Box>
				<Box flex="1 1 150px">
					<TarjetaEstadistica
						titulo="Tasa de Conversión"
						valor={`${conversionRate}%`}
						color="#9c27b0"
						subtext={`${estadisticas.funnel.adjudicados} de ${estadisticas.funnel.inscritos} inscripciones`}
					/>
				</Box>
			</Box>

			<EstadisticasGraficos estadisticas={estadisticas} colores={COLORES} />
		</Box>
	)
}
