import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/api', (c) => c.json({ status: 'ok' }))

serve({ fetch: app.fetch, port: 3001 })
