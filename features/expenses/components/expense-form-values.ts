import { insertExpenseSchema } from '@/db/schema'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string(),
	description: z.string().nullable().optional(),
	amount: z.string(),
	date: z.coerce.date(),
	currentInstallment: z.string().nullable().optional(),
	numberInstallments: z.string().nullable().optional(),
	isEternal: z.string().nullable().optional(),
	isActive: z.string().nullable().optional(),
	categoryId: z.string().nullable().optional(),
})

const apiSchema = insertExpenseSchema.omit({
	id: true,
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

export { type ApiFormValues, type FormValues, formSchema }
