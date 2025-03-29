import {
	Card,
	CardContent,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import { IconBook } from '@tabler/icons-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { TitulosOfertaRepositoryHttp } from '@/shared/repositories/titulos-oferta/titulos-oferta.repository.http'

export default function TitulosOferta({ oferta }) {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<TitulosOfertaInterno oferta={oferta} />
		</Suspense>
	)
}

const TitulosOfertaInterno = ({ oferta }) => {
	const titulosOfertaRepository = TitulosOfertaRepositoryHttp

	const { data: titulos } = useSuspenseQuery({
		queryKey: ['titulos', oferta.id],
		queryFn: () => titulosOfertaRepository.obtenerPorIdOferta(oferta.id),
	})

	return (
		<Card sx={{ padding: 2, boxShadow: 2 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Títulos requeridos para esta oferta
				</Typography>
				<List>
					{titulos.map(({ titulo }) => (
						<ListItem key={titulo.id}>
							<ListItemIcon>
								<IconBook />
							</ListItemIcon>
							<ListItemText primary={titulo.nombre} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	)
}
