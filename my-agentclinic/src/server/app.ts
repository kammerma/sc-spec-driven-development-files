import { Hono } from 'hono'

export const app = new Hono()

app.get('/api', (c) => c.json({ status: 'ok' }))
