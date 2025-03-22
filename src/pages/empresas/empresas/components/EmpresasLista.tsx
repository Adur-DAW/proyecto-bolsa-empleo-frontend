import { EmpresasRepositoryHttp } from "@/shared/repositories/empresas/empresas.repository.http";
import { Card, CardContent, Box, Typography, Button, Stack } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

export default function EmpresasLista() {
	return <Stack spacing={3}>
		<Suspense
			fallback={<div>Cargando...</div>}
		>
			<EmpresasListaSuspense />
		</Suspense>
	</Stack>
}

const EmpresasListaSuspense = () => {
	const empresasRepository = EmpresasRepositoryHttp

	const { data: empresas = [] } = useSuspenseQuery(
		{
			queryKey: ["empresas"],
			queryFn: () => empresasRepository.obtener(),
		}
	)

	return empresas.map((empresa) => {
		return (
			<Card key={empresa.id} sx={{ padding: 2, boxShadow: 2 }}>
				<CardContent>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
						<Box sx={{ textAlign: "left" }}>
							<Typography variant="h6" sx={{ marginBottom: 2 }}>
								{empresa.nombre}
							</Typography>
							<Box sx={{ marginBottom: 1 }}>
								<Typography variant="subtitle2" color="text.secondary" component="span">
									CIF:{" "}
								</Typography>
								<Typography variant="body2" component="span">
									{empresa.cif}
								</Typography>
							</Box>
							<Box sx={{ marginBottom: 1 }}>
								<Typography variant="subtitle2" color="text.secondary" component="span">
									Localidad:{" "}
								</Typography>
								<Typography variant="body2" component="span">
									{empresa.localidad}
								</Typography>
							</Box>
							<Box sx={{ marginBottom: 1 }}>
								<Typography variant="subtitle2" color="text.secondary" component="span">
									Teléfono:{" "}
								</Typography>
								<Typography variant="body2" component="span">
									{empresa.telefono}
								</Typography>
							</Box>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
							<Typography variant="caption" color="text.secondary">
								Validado: {empresa.validado ? "Si" : "No"}
							</Typography>
							<Button variant="outlined" color="primary" sx={{ marginTop: 2 }}>
								Inscribirse
							</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>
		)
	})
}
