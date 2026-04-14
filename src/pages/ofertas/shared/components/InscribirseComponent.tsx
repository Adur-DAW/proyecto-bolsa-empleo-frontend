import { Button, Tooltip } from '@mui/material'
import { IconClipboard, IconClipboardOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

import useRol from '@/shared/hooks/rol.hook'
import { Oferta } from '@/shared/models'
import { OfertasDemandanteRepositoryHttp } from '@/shared/repositories/ofertas-demandante/ofertas-demandante.repository.http'

const validacionesInscribir = (oferta: Oferta) => oferta.abierta;

export default function InscribirseComponent({
	oferta,
}: {
	oferta: Oferta
}) {
	const queryClient = useQueryClient()
	const { mismoRol } = useRol()

	const ofertasDemandanteRepository = OfertasDemandanteRepositoryHttp

	const {
		mutate: inscribir,
		isPending: inscribiendo,
	} = useMutation({
		mutationFn: ofertasDemandanteRepository.registrarJWT,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['ofertas'], refetchType: 'all' })
			queryClient.invalidateQueries({ queryKey: ['oferta', oferta.id], refetchType: 'all' })
		},
	})

	const {
		mutate: desinscribir,
		isPending: desinscribiendo,
	} = useMutation({
		mutationFn: ofertasDemandanteRepository.eliminarJWT,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['ofertas'], refetchType: 'all' })
			queryClient.invalidateQueries({ queryKey: ['oferta', oferta.id], refetchType: 'all' })
		},
	})

	if (mismoRol('sinRol') && validacionesInscribir(oferta))
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

	return mismoRol('demandante') && validacionesInscribir(oferta) ? (
		oferta.inscrito ? (
			<Button
				variant="outlined"
				color="secondary"
				sx={{ marginTop: 2 }}
				startIcon={<IconClipboardOff />}
				onClick={() => desinscribir(oferta.id)}
				disabled={desinscribiendo}
			>
				{desinscribiendo ? 'Desinscribiendo…' : 'Desinscribirme'}
			</Button>
		) : (
			<Button
				variant="outlined"
				color="secondary"
				sx={{ marginTop: 2 }}
				startIcon={<IconClipboard />}
				onClick={() => inscribir(oferta.id)}
				disabled={inscribiendo}
			>
				{inscribiendo ? 'Inscribiendo…' : 'Inscribirme'}
			</Button>
		)
	) : (
		<></>
	)
}
