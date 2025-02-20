import { Hono } from 'hono'

import { db } from '@/db/drizzle'
import {
	accounts,
	categories,
	expenses,
	insertTransactionSchema,
	transactions,
} from '@/db/schema'
import { getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { parse, subDays } from 'date-fns'
import { and, desc, eq, gte, inArray, isNull, lte, or, sql } from 'drizzle-orm'
import { z } from 'zod'

const app = new Hono()

	// 📌 Rota para obter todas as transações com filtros opcionais
	.get(
		'/',
		zValidator(
			'query',
			z.object({
				from: z.string().optional(),
				to: z.string().optional(),
				accountId: z.string().optional(),
			}),
		),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { from, to, accountId } = c.req.valid('query')
				const defaultTo = new Date()
				const defaultFrom = subDays(defaultTo, 30)

				const startDate = from
					? parse(from, 'yyyy-MM-dd', new Date())
					: defaultFrom
				const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

				const data = await db
					.select({
						id: transactions.id,
						name: transactions.name,
						description: transactions.description,
						amount: transactions.amount,
						date: transactions.date,
						document: transactions.document,
						account: accounts.name,
						accountId: transactions.accountId,
						category: categories.name,
						categoryId: categories.id,
						expense: expenses.name,
						expenseId: expenses.id,
					})
					.from(transactions)
					.innerJoin(accounts, eq(transactions.accountId, accounts.id))
					.leftJoin(
						categories,
						or(
							isNull(transactions.categoryId),
							eq(transactions.categoryId, categories.id),
						),
					)
					.leftJoin(
						expenses,
						or(
							isNull(transactions.expenseId),
							eq(transactions.expenseId, expenses.id),
						),
					)
					.where(
						and(
							accountId ? eq(transactions.accountId, accountId) : undefined,
							gte(transactions.date, startDate),
							lte(transactions.date, endDate),
						),
					)
					.orderBy(desc(transactions.date))

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	// 📌 Rota para obter uma transação específica pelo ID
	.get(
		'/:id',
		zValidator('param', z.object({ id: z.string().min(1, 'ID inválido') })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { id } = c.req.valid('param')

				const [data] = await db
					.select()
					.from(transactions)
					.where(eq(transactions.id, id))

				if (!data) return c.json({ error: 'Transação não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	// 📌 Rota para criar uma nova transação
	.post(
		'/',
		zValidator('json', insertTransactionSchema.omit({ id: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const values = c.req.valid('json')

				// ✅ Garantindo que categoryId e expenseId sejam null se forem ''
				const categoryId = values.categoryId === '' ? null : values.categoryId
				const expenseId = values.expenseId === '' ? null : values.expenseId

				const [data] = await db
					.insert(transactions)
					.values({
						id: createId(),
						...values,
						categoryId,
						expenseId,
					})
					.returning()

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	// 📌 Rota para excluir múltiplas transações (bulk delete)
	.post(
		'/bulk-delete',
		zValidator(
			'json',
			z.object({ ids: z.array(z.string()).min(1, 'Lista de IDs inválida') }),
		),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const values = c.req.valid('json')

				const transactionsToDelete = db
					.$with('transactions_to_delete')
					.as(
						db
							.select({ id: transactions.id })
							.from(transactions)
							.where(inArray(transactions.id, values.ids)),
					)

				const data = await db
					.with(transactionsToDelete)
					.delete(transactions)
					.where(
						inArray(
							transactions.id,
							sql`(select id from ${transactionsToDelete})`,
						),
					)
					.returning({ id: transactions.id })

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	// 📌 Rota para atualizar uma transação existente
	.patch(
		'/:id',
		zValidator('param', z.object({ id: z.string().min(1, 'ID inválido') })),
		zValidator('json', insertTransactionSchema.omit({ id: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { id } = c.req.valid('param')
				const values = c.req.valid('json')

				// ✅ Garantindo que categoryId e expenseId sejam null se forem ''
				const categoryId = values.categoryId === '' ? null : values.categoryId
				const expenseId = values.expenseId === '' ? null : values.expenseId

				const [data] = await db
					.update(transactions)
					.set({
						...values,
						categoryId,
						expenseId,
					})
					.where(eq(transactions.id, id))
					.returning()

				if (!data) return c.json({ error: 'Transação não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	// 📌 Rota para deletar uma transação pelo ID
	.delete(
		'/:id',
		zValidator('param', z.object({ id: z.string().min(1, 'ID inválido') })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { id } = c.req.valid('param')

				const [data] = await db
					.delete(transactions)
					.where(eq(transactions.id, id))
					.returning({ id: transactions.id })

				if (!data) return c.json({ error: 'Transação não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

export default app
