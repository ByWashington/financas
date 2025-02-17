import { Hono } from 'hono'

import { db } from '@/db/drizzle'
import { categories, expenses, insertExpenseSchema } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { and, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'

const app = new Hono()
	.get(
		'/',
		clerkMiddleware(),
		zValidator(
			'query',
			z.object({
				isActive: z.string().optional(),
				name: z.string().optional(),
			}),
		),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { isActive, name } = c.req.valid('query')

			const isActiveFilter = isActive
				? eq(expenses.isActive, Boolean(isActive === '1'))
				: undefined

			const searchNameTerm = name
				? ilike(expenses.name, `%${name}%`)
				: undefined

			const filters = [isActiveFilter, searchNameTerm].filter(Boolean)

			const data = await db
				.select({
					id: expenses.id,
					name: expenses.name,
					description: expenses.description,
					amount: expenses.amount,
					date: expenses.date,
					category: categories.name,
					categoryId: expenses.categoryId,
					currentInstallment: expenses.currentInstallment,
					numberInstallments: expenses.numberInstallments,
					isEternal: expenses.isEternal,
					isActive: expenses.isActive,
				})
				.from(expenses)
				.leftJoin(categories, eq(expenses.categoryId, categories.id))
				.where(filters.length > 0 ? and(...filters) : undefined)
				.orderBy(desc(expenses.date))

			return c.json({ data })
		},
	)
	.get(
		'/:id',
		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			}),
		),
		clerkMiddleware(),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const { id } = c.req.valid('param')

			if (!id) {
				return c.json({ error: 'Not found' }, 400)
			}

			const [data] = await db
				.select({
					id: expenses.id,
					name: expenses.name,
					description: expenses.description,
					amount: expenses.amount,
					date: expenses.date,
					categoryId: expenses.categoryId,
					currentInstallment: expenses.currentInstallment,
					numberInstallments: expenses.numberInstallments,
					isEternal: expenses.isEternal,
					isActive: expenses.isActive,
				})
				.from(expenses)
				.where(eq(expenses.id, id))

			if (!data) {
				return c.json({ error: 'Not found' }, 404)
			}

			return c.json({ data })
		},
	)
	.post(
		'/',
		clerkMiddleware(),
		zValidator(
			'json',
			insertExpenseSchema.omit({
				id: true,
			}),
		),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const [data] = await db
				.insert(expenses)
				.values({
					id: createId(),
					...values,
				})
				.returning()

			return c.json({ data })
		},
	)
	.post(
		'/bulk-delete',
		clerkMiddleware(),
		zValidator(
			'json',
			z.object({
				ids: z.array(z.string()),
			}),
		),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')
			const expensesToDelete = db
				.$with('expenses_to_delete')
				.as(
					db
						.select({ id: expenses.id })
						.from(expenses)
						.where(inArray(expenses.id, values.ids)),
				)

			const data = await db
				.with(expensesToDelete)
				.delete(expenses)
				.where(inArray(expenses.id, sql`(select id from ${expensesToDelete})`))
				.returning({
					id: expenses.id,
				})

			return c.json({ data })
		},
	)
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			}),
		),
		zValidator(
			'json',
			insertExpenseSchema.omit({
				id: true,
			}),
		),
		async (c) => {
			try {
				const auth = getAuth(c)

				if (!auth?.userId) {
					return c.json({ error: 'Unauthorized' }, 401)
				}

				const { id } = c.req.valid('param')
				const values = c.req.valid('json')

				if (!id) {
					return c.json({ error: 'Not found' }, 404)
				}

				const expensesToUpdate = db
					.$with('expenses_to_update')
					.as(
						db
							.select({ id: expenses.id })
							.from(expenses)
							.where(eq(expenses.id, id)),
					)

				const [data] = await db
					.with(expensesToUpdate)
					.update(expenses)
					.set(values)
					.where(
						inArray(expenses.id, sql`(select id from ${expensesToUpdate})`),
					)
					.returning()

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch {
				return c.json({ error: 'Internal server error' }, 500)
			}
		},
	)
	.delete(
		'/:id',
		clerkMiddleware(),
		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			}),
		),
		async (c) => {
			try {
				const auth = getAuth(c)

				if (!auth?.userId) {
					return c.json({ error: 'Unauthorized' }, 401)
				}

				const { id } = c.req.valid('param')

				if (!id) {
					return c.json({ error: 'Not found' }, 404)
				}

				const expensesToDelete = db
					.$with('expenses_to_delete')
					.as(
						db
							.select({ id: expenses.id })
							.from(expenses)
							.where(eq(expenses.id, id)),
					)

				const [data] = await db
					.with(expensesToDelete)
					.delete(expenses)
					.where(
						inArray(expenses.id, sql`(select id from ${expensesToDelete})`),
					)
					.returning({
						id: expenses.id,
					})

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch {
				return c.json({ error: 'Internal server error' }, 500)
			}
		},
	)

export default app
