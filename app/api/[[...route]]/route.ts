import accounts from '@/app/api/[[...route]]/accounts'
import categories from '@/app/api/[[...route]]/categories'
import expenses from '@/app/api/[[...route]]/expenses'
import incomes from '@/app/api/[[...route]]/incomes'
import transactions from '@/app/api/[[...route]]/transactions'
import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())

const routes = app
	.route('/accounts', accounts)
	.route('/categories', categories)
	.route('/transactions', transactions)
	.route('/expenses', expenses)
	.route('/incomes', incomes)

export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)
export const DELETE = handle(routes)

export type AppType = typeof routes
