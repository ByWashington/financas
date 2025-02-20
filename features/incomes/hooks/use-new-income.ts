import { create } from 'zustand'

type NewIncomeState = {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

export const useNewIncome = create<NewIncomeState>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))
