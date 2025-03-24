import { insertExpenseSchema } from '@/db/schema'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, { message: 'O nome é obrigatório' }),
	description: z.string().nullable().optional(),
	amount: z.string().min(1, { message: 'O valor é obrigatório' }),
	date: z.coerce.date({ message: 'A data é obrigatória' }),
	currentInstallment: z.string().nullable().optional(),
	numberInstallments: z.string().nullable().optional(),
	isEternal: z.string().nullable().optional(),
	isActive: z.string().nullable().optional(),
	categoryId: z.string().min(1, { message: 'A categoria é obrigatória' }),
})

const apiSchema = insertExpenseSchema.omit({
	id: true,
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

export { type ApiFormValues, type FormValues, formSchema }
