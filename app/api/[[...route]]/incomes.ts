import { Hono } from 'hono'

import { db } from '@/db/drizzle'
import { categories, incomes, insertIncomeSchema } from '@/db/schema'
import { getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { and, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'

const app = new Hono()
	.get(
		'/',
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
				? eq(incomes.isActive, Boolean(isActive === '1'))
				: undefined

			const searchNameTerm = name ? ilike(incomes.name, `%${name}%`) : undefined

			const filters = [isActiveFilter, searchNameTerm].filter(Boolean)

			const data = await db
				.select({
					id: incomes.id,
					name: incomes.name,
					description: incomes.description,
					amount: incomes.amount,
					date: incomes.date,
					category: categories.name,
					categoryId: incomes.categoryId,
					currentInstallment: incomes.currentInstallment,
					numberInstallments: incomes.numberInstallments,
					isEternal: incomes.isEternal,
					isActive: incomes.isActive,
				})
				.from(incomes)
				.leftJoin(categories, eq(incomes.categoryId, categories.id))
				.where(filters.length > 0 ? and(...filters) : undefined)
				.orderBy(desc(incomes.date))

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
					id: incomes.id,
					name: incomes.name,
					description: incomes.description,
					amount: incomes.amount,
					date: incomes.date,
					categoryId: incomes.categoryId,
					currentInstallment: incomes.currentInstallment,
					numberInstallments: incomes.numberInstallments,
					isEternal: incomes.isEternal,
					isActive: incomes.isActive,
				})
				.from(incomes)
				.where(eq(incomes.id, id))

			if (!data) {
				return c.json({ error: 'Not found' }, 404)
			}

			return c.json({ data })
		},
	)
	.post(
		'/',
		zValidator(
			'json',
			insertIncomeSchema.omit({
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
				.insert(incomes)
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
			const incomesToDelete = db
				.$with('incomes_to_delete')
				.as(
					db
						.select({ id: incomes.id })
						.from(incomes)
						.where(inArray(incomes.id, values.ids)),
				)

			const data = await db
				.with(incomesToDelete)
				.delete(incomes)
				.where(inArray(incomes.id, sql`(select id from ${incomesToDelete})`))
				.returning({
					id: incomes.id,
				})

			return c.json({ data })
		},
	)
	.patch(
		'/:id',
		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			}),
		),
		zValidator(
			'json',
			insertIncomeSchema.omit({
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

				const incomesToUpdate = db
					.$with('incomes_to_update')
					.as(
						db
							.select({ id: incomes.id })
							.from(incomes)
							.where(eq(incomes.id, id)),
					)

				const [data] = await db
					.with(incomesToUpdate)
					.update(incomes)
					.set(values)
					.where(inArray(incomes.id, sql`(select id from ${incomesToUpdate})`))
					.returning()

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch (error) {
				return c.json({ error: `Internal server error - ${error}` }, 500)
			}
		},
	)
	.delete(
		'/:id',
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

				const incomesToDelete = db
					.$with('incomes_to_delete')
					.as(
						db
							.select({ id: incomes.id })
							.from(incomes)
							.where(eq(incomes.id, id)),
					)

				const [data] = await db
					.with(incomesToDelete)
					.delete(incomes)
					.where(inArray(incomes.id, sql`(select id from ${incomesToDelete})`))
					.returning({
						id: incomes.id,
					})

				if (!data) {
					return c.json({ error: 'Not found' }, 404)
				}

				return c.json({ data })
			} catch (error) {
				return c.json({ error: `Internal server error - ${error}` }, 500)
			}
		},
	)

export default app
