import { date, numeric, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
})

export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	price: numeric('price').notNull(),
	date: date('date').notNull(),
	category: text('category').notNull(),
	document: text('document').notNull(),
	userId: text('user_id').notNull(),
})

export const insertAccountSchema = createInsertSchema(accounts)
export const insertTransactionSchema = createInsertSchema(transactions)
