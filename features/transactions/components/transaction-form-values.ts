import { insertTransactionSchema } from '@/db/schema'
import type { z } from 'zod'

const formSchema = insertTransactionSchema.pick({
	name: true,
	description: true,
	price: true,
	date: true,
	category: true,
	document: true,
})

type FormValues = z.input<typeof formSchema>

export { type FormValues, formSchema }
