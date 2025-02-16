import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'
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

export const expenses = pgTable('expenses', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	amount: integer('amount').notNull(),
	date: timestamp('date', { mode: 'date' }).notNull(),
	currentInstallment: integer('currentInstallment'),
	numberInstallments: integer('numberInstallments'),
	isEternal: boolean('isEternal').notNull(),
	isActive: boolean('isActive').notNull(),
	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
})

export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	amount: integer('amount').notNull(),
	date: timestamp('date', { mode: 'date' }).notNull(),
	document: text('document'),
	accountId: text('account_id')
		.references(() => accounts.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
	expenseId: text('expense_id').references(() => expenses.id, {
		onDelete: 'set null',
	}),
})

export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions),
	expenses: many(expenses),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
	}),
	categories: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id],
	}),
	expenses: one(expenses, {
		fields: [transactions.expenseId],
		references: [expenses.id],
	}),
}))

export const expensesRelations = relations(expenses, ({ one, many }) => ({
	transactions: many(transactions),
	categories: one(categories, {
		fields: [expenses.categoryId],
		references: [categories.id],
	}),
}))

export const insertAccountSchema = createInsertSchema(accounts)
export const insertCategorySchema = createInsertSchema(categories)
export const insertTransactionSchema = createInsertSchema(transactions, {
	date: z.coerce.date(),
})
export const insertExpenseSchema = createInsertSchema(expenses, {
	date: z.coerce.date(),
})
