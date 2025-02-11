import { insertTransactionSchema } from '@/db/schema'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string(),
	description: z.string().nullable().optional(),
	amount: z.string(),
	date: z.coerce.date(),
	document: z.string().nullable().optional(),
	categoryId: z.string().nullable().optional(),
	accountId: z.string(),
})

const apiSchema = insertTransactionSchema.omit({
	id: true,
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

export { type ApiFormValues, type FormValues, formSchema }
