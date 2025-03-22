import { Suspense } from "react";

export default function ConfiguracionUsuarioDatos() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<ConfiguracionUsuarioDatosInterno />
		</Suspense>
	)
}

const ConfiguracionUsuarioDatosInterno = () => {
	return <div>ConfiguracionUsuarioDatos</div>;
}
