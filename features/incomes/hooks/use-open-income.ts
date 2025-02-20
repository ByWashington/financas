import { create } from 'zustand'

type OpenIncomeState = {
	id?: string
	isOpen: boolean
	onOpen: (id: string) => void
	onClose: () => void
}

export const useOpenIncome = create<OpenIncomeState>((set) => ({
	id: undefined,
	isOpen: false,
	onOpen: (id: string) => set({ isOpen: true, id }),
	onClose: () => set({ isOpen: false, id: undefined }),
}))
