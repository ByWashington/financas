import { db } from '@/db/drizzle'
import { categories, insertCategorySchema } from '@/db/schema'
import { getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { createId } from '@paralleldrive/cuid2'
import { eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
	.get('/', async (c) => {
		try {
			const auth = getAuth(c)
			if (!auth?.userId)
				return c.json({ error: 'Usuário não autenticado' }, 401)

			const data = await db
				.select({
					id: categories.id,
					name: categories.name,
				})
				.from(categories)

			return c.json({ data })
		} catch (error) {
			return c.json({ error }, 500)
		}
	})

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
					.select({
						id: categories.id,
						name: categories.name,
					})
					.from(categories)
					.where(eq(categories.id, id))

				if (!data) return c.json({ error: 'Categoria não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	.post(
		'/',
		zValidator('json', insertCategorySchema.pick({ name: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const values = c.req.valid('json')

				const [data] = await db
					.insert(categories)
					.values({
						id: createId(),
						...values,
					})
					.returning()

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

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

				// 🚀 Transaction para segurança
				const data = await db.transaction(async (tx) => {
					return await tx
						.delete(categories)
						.where(inArray(categories.id, values.ids))
						.returning({ id: categories.id })
				})

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	.patch(
		'/:id',
		zValidator('param', z.object({ id: z.string().min(1, 'ID inválido') })),
		zValidator('json', insertCategorySchema.pick({ name: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { id } = c.req.valid('param')
				const values = c.req.valid('json')

				const [data] = await db
					.update(categories)
					.set(values)
					.where(eq(categories.id, id))
					.returning()

				if (!data) return c.json({ error: 'Categoria não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

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
					.delete(categories)
					.where(eq(categories.id, id))
					.returning({ id: categories.id })

				if (!data) return c.json({ error: 'Categoria não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

export default app
