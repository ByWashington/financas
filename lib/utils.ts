import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
	return Math.round(amount / 1000)
}

export function convertAmountToMiliunits(amount: number) {
	return Math.round(amount * 1000)
}

export function formatCurrency(value: number) {
	return Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
	}).format(value)
}

export function convertStringToBoolean(value: string) {
	const booleanValue = value === '1' || value.toLowerCase() === 'true'
	return booleanValue
}
