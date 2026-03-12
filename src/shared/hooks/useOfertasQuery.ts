import { useQuery } from '@tanstack/react-query'

import { OfertasRepositoryHttp as ofertasRepository } from '@/shared/repositories/ofertas/ofertas.repository.http'

export const useOfertasQuery = (params: {
	filtro?: string
	search?: string
	idEmpresa?: string
	idFamilia?: string
	estado?: string
	ordenarPor?: string
	pagina?: number
	inscrito?: string
}) => {
	const {
		filtro,
		search,
		idEmpresa,
		estado,
		ordenarPor,
		idFamilia,
		pagina = 1,
		inscrito,
	} = params

	return useQuery({
		queryKey: [
			'ofertas',
			{ filtro, search, idEmpresa, estado, ordenarPor, idFamilia, pagina, inscrito },
		],
		queryFn: async () => {
			if (filtro === 'demandante') {
				const res = await ofertasRepository.obtenerPorDemandante({
					search,
					estado,
					ordenarPor,
					idFamilia: idFamilia ? Number(idFamilia) : undefined,
					pagina,
					inscrito: inscrito,
					limite: 10,
				})
				return res
			} else if (filtro === 'empresa') {
				const res = await ofertasRepository.obtenerPorEmpresa({
					search,
					estado,
					ordenarPor,
					idFamilia: idFamilia ? Number(idFamilia) : undefined,
					pagina,
					limite: 10,
				})
				return res
			} else {
				return ofertasRepository.obtener({
					pagina,
					limite: 10,
					search: search,
					idEmpresa: idEmpresa ? Number(idEmpresa) : undefined,
					idFamilia: idFamilia ? Number(idFamilia) : undefined,
					estado: estado,
					ordenarPor: ordenarPor,
				})
			}
		},
	})
}
