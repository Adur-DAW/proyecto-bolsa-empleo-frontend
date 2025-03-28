import { Button, Tooltip } from '@mui/material'
import { IconClipboard, IconClipboardOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { Oferta } from '@/shared/models'
import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

export default function InscribirseComponent({
	oferta,
	filtro,
}: {
	oferta: Oferta
	filtro: any
}) {
	const queryClient = useQueryClient()
	const { mismoRol } = useRol()

	const ofertasDemandanteRepository = OfertasDemandanteRepositoryHttp

	const mutateInscribir = useMutation({
		mutationFn: ofertasDemandanteRepository.registrarJWT,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['ofertas', filtro] })
			queryClient.refetchQueries({ queryKey: ['oferta', oferta.id] })
		},
	})

	const mutateDesinscribir = useMutation({
		mutationFn: ofertasDemandanteRepository.eliminarJWT,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['ofertas', filtro] })
			queryClient.refetchQueries({ queryKey: ['oferta', oferta.id] })
		},
	})

	if (mismoRol('sinRol'))
		return (
			<Tooltip title="Debes iniciar sesión para inscribirte">
				<Button
					variant="outlined"
					color="primary"
					sx={{ marginTop: 2 }}
					component={Link}
					startIcon={<IconClipboard />}
					to="/login"
				>
					Inscribirme
				</Button>
			</Tooltip>
		)

	return mismoRol('demandante') && oferta.abierta ? (
		oferta.inscrito ? (
			<Button
				variant="outlined"
				color="secondary"
				sx={{ marginTop: 2 }}
				startIcon={<IconClipboardOff />}
				onClick={() => mutateDesinscribir.mutate(oferta.id)}
			>
				Desinscribirme
			</Button>
		) : (
			<Button
				variant="outlined"
				color="secondary"
				sx={{ marginTop: 2 }}
				startIcon={<IconClipboard />}
				onClick={() => mutateInscribir.mutate(oferta.id)}
			>
				Inscribirme
			</Button>
		)
	) : (
		<></>
	)
}
