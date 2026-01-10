import { Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import { FamiliaProfesional, MaestrosRepository } from '@/shared/repositories/MaestrosRepository'
import DashboardFilters from './components/DashboardFilters'
import TarjetaStat from './components/TarjetaStat'
import DashboardCharts from './components/DashboardCharts'
import { useAdminStats } from './hooks/useAdminStats'
import LoadingSkeleton from '@/shared/components/feedback/LoadingSkeleton'
import EmptyState from '@/shared/components/feedback/EmptyState'

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

    const { estadisticas, isLoading, error, refetch, conversionRate } = useAdminStats(filtros)

    if (isLoading) return <Box p={4}><LoadingSkeleton type="dashboard" /></Box>
    if (error) return <Typography color="error">Error al cargar estadísticas</Typography>
    if (!estadisticas) return <EmptyState title="No hay datos disponibles" />

    // Exportar CSV
    const exportarCSV = () => {
        const rows = [
            ['Métrica', 'Valor'],
            ['Ofertas', estadisticas.totales.ofertas],
            ['Adjudicadas', estadisticas.totales.ofertas_adjudicadas],
            ['Demandantes', estadisticas.totales.demandantes],
            [],
            ['Periodo', 'Demandantes', 'Empresas'],
            ...estadisticas.registros.map((r: any) => [r.periodo, r.demandantes, r.empresas])
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
            <DashboardFilters
                filtros={filtros}
                familias={familias}
                onFilterChange={manejarCambioFiltro}
                onExport={exportarCSV}
                onRefresh={refetch}
            />

            {/* KPI Cards */}
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

            {/* Charts */}
            <DashboardCharts estadisticas={estadisticas} colors={COLORS} />
        </Box>
    )
}

