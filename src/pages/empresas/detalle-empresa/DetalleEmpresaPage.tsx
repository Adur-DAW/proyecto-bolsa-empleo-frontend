import {
  Box,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { AvatarSeguro } from '@/shared/components/media/AvatarSeguro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

import OfertasLista from '@/pages/ofertas/ofertas/components/OfertasLista'
import { EmpresasRepositoryHttp } from '@/shared/repositories/empresas/empresas.repository.http'

import PageDataContainer from '@/shared/components/containers/PageDataContainer'
import { getImagenUrl } from '@/shared/utils/get-imagen-url'

export default function DetalleEmpresaPage() {
  const { id } = useParams()
  const idEmpresa = Number(id)

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <PageDataContainer skeletonType="detail">
        <DetalleEmpresaHeader idEmpresa={idEmpresa} />
      </PageDataContainer>

      <DetalleEmpresaOfertas idEmpresa={idEmpresa} />
    </Stack>
  )
}

const DetalleEmpresaHeader = ({ idEmpresa }: { idEmpresa: number }) => {
  const { data: empresa } = useSuspenseQuery({
    queryKey: ['empresa', idEmpresa],
    queryFn: () => EmpresasRepositoryHttp.obtenerPorId(idEmpresa),
  })

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <AvatarSeguro
          src={getImagenUrl(empresa.imagenUrl)}
          sx={{ width: 80, height: 80, fontSize: 32 }}
          variant="rounded"
        >
          {empresa.nombre?.charAt(0)}
        </AvatarSeguro>
        <Box>
          <Typography variant="h4" gutterBottom>
            {empresa.nombre}
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Localidad
              </Typography>
              <Typography variant="body1">{empresa.localidad}</Typography>
            </Box>
            {empresa.familiaProfesional && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Familia Profesional
                </Typography>
                <Typography variant="body1">{empresa.familiaProfesional.nombre}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}

const DetalleEmpresaOfertas = ({ idEmpresa }: { idEmpresa: number }) => {
  const [tab, setTab] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Ofertas Activas" />
          <Tab label="Historial (Finalizadas)" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <OfertasLista idEmpresa={idEmpresa} estado="activas" />
      )}

      {tab === 1 && (
        <OfertasLista idEmpresa={idEmpresa} estado="finalizadas" />
      )}
    </Box>
  )
}
