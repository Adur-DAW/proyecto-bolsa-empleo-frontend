import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
	GeneralActions,
	GeneralState,
	createGeneralSlice,
	defaultGeneralState,
} from './general.slice'

type State = GeneralState
type Actions = GeneralActions

export const useAppStore = create<State & Actions>()(
	persist(
		(...a) => ({
			...defaultGeneralState,
			...createGeneralSlice(...a),
		}),
		{
			name: 'app-storage',
			partialize: (state) => ({
				token: state.token,
				usuario: state.usuario,
			}),
		}
	)
)
