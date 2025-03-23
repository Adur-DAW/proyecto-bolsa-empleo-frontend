import {
	Box,
	Container,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material'
import { useState } from 'react'

import { TiposUsuario } from '@/shared/enums/tipos-usuario.enum'

import RegistrarDemandante from './components/RegistrarDemandante'
import RegistrarEmpresa from './components/RegistrarEmpresa'
import { Link } from 'react-router'
import { getAbsolutePath } from '@/shared/routes'

export default function RegistroPage() {
	const [tipoRegistro, setTipoRegistro] = useState<TiposUsuario>('demandante')

	return (
		<Container maxWidth="xs">
			<Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
				<Typography variant="h5" gutterBottom>
					Registro
				</Typography>
				<FormControl component="fieldset" sx={{ mt: 2 }}>
					<RadioGroup
						row
						value={tipoRegistro}
						onChange={(e) =>
							setTipoRegistro(e.target.value as 'demandante' | 'empresa')
						}
					>
						<FormControlLabel
							value="demandante"
							control={<Radio />}
							label="Demandante"
						/>
						<FormControlLabel
							value="empresa"
							control={<Radio />}
							label="Empresa"
						/>
					</RadioGroup>
				</FormControl>

				{tipoRegistro === 'demandante' && <RegistrarDemandante />}
				{tipoRegistro === 'empresa' && <RegistrarEmpresa />}
			</Box>

			<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
				¿Ya tienes cuenta? &nbsp;
				<Link
					to={getAbsolutePath('login')}
					style={{ color: 'black', fontWeight: 'bold' }}
				>
					Inicia sesión
				</Link>
			</Box>
		</Container>
	)
}
