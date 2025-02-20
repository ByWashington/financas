import { db } from '@/db/drizzle'
import { accounts, insertAccountSchema } from '@/db/schema'
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
					id: accounts.id,
					name: accounts.name,
				})
				.from(accounts)

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
						id: accounts.id,
						name: accounts.name,
					})
					.from(accounts)
					.where(eq(accounts.id, id))

				if (!data) return c.json({ error: 'Conta não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

	.post(
		'/',
		zValidator('json', insertAccountSchema.pick({ name: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const values = c.req.valid('json')

				const [data] = await db
					.insert(accounts)
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
						.delete(accounts)
						.where(inArray(accounts.id, values.ids))
						.returning({ id: accounts.id })
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
		zValidator('json', insertAccountSchema.pick({ name: true })),
		async (c) => {
			try {
				const auth = getAuth(c)
				if (!auth?.userId)
					return c.json({ error: 'Usuário não autenticado' }, 401)

				const { id } = c.req.valid('param')
				const values = c.req.valid('json')

				const [data] = await db
					.update(accounts)
					.set(values)
					.where(eq(accounts.id, id))
					.returning()

				if (!data) return c.json({ error: 'Conta não encontrada' }, 404)

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
					.delete(accounts)
					.where(eq(accounts.id, id))
					.returning({ id: accounts.id })

				if (!data) return c.json({ error: 'Conta não encontrada' }, 404)

				return c.json({ data })
			} catch (error) {
				return c.json({ error }, 500)
			}
		},
	)

export default app
