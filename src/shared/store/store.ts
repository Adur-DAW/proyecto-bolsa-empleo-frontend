import { create } from 'zustand'

import {
	GeneralActions,
	GeneralState,
	createGeneralSlice,
	defaultGeneralState,
} from './general.slice'

type State = GeneralState

type Actions = GeneralActions

export const defaultState: State = {
	...defaultGeneralState,
}

const useAppStore = create<State & Actions>((...a) => ({
	...defaultState,
	...createGeneralSlice(...a),
}))

export { useAppStore }
