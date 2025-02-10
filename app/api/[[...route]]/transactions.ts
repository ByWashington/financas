import { Hono } from 'hono'

import { db } from '@/db/drizzle'
import { insertTransactionSchema, transactions } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'

const app = new Hono()
	.get('/', clerkMiddleware(), async (c) => {
		const auth = getAuth(c)

		if (!auth?.userId) {
			return c.json({ error: 'Unauthorized' }, 401)
		}

		const data = await db
			.select({
				id: transactions.id,
				name: transactions.name,
				description: transactions.description,
				price: transactions.price,
				date: transactions.date,
				document: transactions.document,
			})
			.from(transactions)
			.where(eq(transactions.userId, auth.userId))

		return c.json({ data })
	})
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
					id: transactions.id,
					name: transactions.name,
					description: transactions.description,
					price: transactions.price,
					date: transactions.date,
					category: transactions.category,
					document: transactions.document,
				})
				.from(transactions)
				.where(
					and(eq(transactions.userId, auth.userId), eq(transactions.id, id)),
				)

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
			insertTransactionSchema.pick({
				name: true,
				description: true,
				price: true,
				date: true,
				category: true,
				document: true,
			}),
		),
		async (c) => {
			const auth = getAuth(c)

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401)
			}

			const values = c.req.valid('json')

			const [data] = await db
				.insert(transactions)
				.values({
					id: createId(),
					userId: auth.userId,
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

			const data = await db
				.delete(transactions)
				.where(
					and(
						eq(transactions.userId, auth.userId),
						inArray(transactions.id, values.ids),
					),
				)
				.returning({
					id: transactions.id,
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
			insertTransactionSchema.pick({
				name: true,
				description: true,
				price: true,
				date: true,
				category: true,
				document: true,
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

				const [data] = await db
					.update(transactions)
					.set(values)
					.where(
						and(eq(transactions.userId, auth.userId), eq(transactions.id, id)),
					)
					.returning()

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch (error) {
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

				const [data] = await db
					.delete(transactions)
					.where(
						and(eq(transactions.userId, auth.userId), eq(transactions.id, id)),
					)
					.returning({
						id: transactions.id,
					})

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch (error) {
				return c.json({ error: 'Internal server error' }, 500)
			}
		},
	)

export default app
