import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
})

export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
})

export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	amount: integer('amount').notNull(),
	date: timestamp('date', { mode: 'date' }).notNull(),
	category: text('category'),
	document: text('document').notNull(),
	accountId: text('account_id')
		.references(() => accounts.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
})

export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
	}),
	categories: one(categories, {
		fields: [transactions.accountId],
		references: [categories.id],
	}),
}))

export const insertAccountSchema = createInsertSchema(accounts)
export const insertCategorySchema = createInsertSchema(categories)
export const insertTransactionSchema = createInsertSchema(transactions, {
	date: z.coerce.date(),
})
