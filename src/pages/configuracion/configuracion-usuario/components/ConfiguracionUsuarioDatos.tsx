import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TitulosRepositoryHttp } from "@/shared/repositories/titulos/titulos.repository.http";
import { TitulosDemandanteRepositoryHttp } from "@/shared/repositories/titulos-demandante/titulos-demandante.repository.http";

export default function ConfiguracionUsuarioDatos() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<ConfiguracionUsuarioDatosInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioDatosInterno = () => {
	const titulosRepository = TitulosRepositoryHttp
	const titulosDemandanteRepository = TitulosDemandanteRepositoryHttp

	const { data: titulos } = useSuspenseQuery({
		queryKey: ['titulos'],
		queryFn: () => titulosRepository.obtener()
	})

	const { data: titulosDemandante } = useSuspenseQuery({
		queryKey: ['titulos-demandante'],
		queryFn: () => titulosDemandanteRepository.obtenerJWT()
	})

	return (
		<div>
			<h1>ConfiguracionUsuarioDatos</h1>
			{titulos?.map(titulo => (
				<div key={titulo.id}>{titulo.nombre}</div>
			))}

			{titulosDemandante?.map(({ idTitulo, idDemandante, titulo, centro,  }) => (
				<div key={idTitulo + idDemandante}>
					{centro}
					{titulo.nombre}
				</div>
			))}
		</div>
	)
}
