import { insertCategorySchema } from '@/db/schema'
import type { z } from 'zod'

const formSchema = insertCategorySchema.pick({
	name: true,
})

type FormValues = z.input<typeof formSchema>

export { type FormValues, formSchema }
