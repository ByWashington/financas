import { create } from 'zustand'

type OpenExpenseState = {
	id: string
	isOpen: boolean
	onOpen: (id: string) => void
	onClose: () => void
}

export const useOpenExpense = create<OpenExpenseState>((set) => ({
	id: '',
	isOpen: false,
	onOpen: (id: string) => set({ isOpen: true, id }),
	onClose: () => set({ isOpen: false, id: '' }),
}))
