import accounts from '@/app/api/[[...route]]/accounts'
import categories from '@/app/api/[[...route]]/categories'
import expenses from '@/app/api/[[...route]]/expenses'
import transactions from '@/app/api/[[...route]]/transactions'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/expenses', expenses)

export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)
export const DELETE = handle(routes)

export type AppType = typeof routes
