import accounts from '@/app/api/[[...route]]/accounts'
import transactions from '@/app/api/[[...route]]/transactions'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.route('/accounts', accounts)

const routes = app
	.route('/accounts', accounts)
	.route('/transactions', transactions)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
