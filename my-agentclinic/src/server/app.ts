import { Hono } from 'hono'
import { db } from './db'
import { toAgent, type AgentRow } from './types'

export const app = new Hono()

app.get('/api', (c) => c.json({ status: 'ok' }))

app.get('/api/health', (c) => {
  db.prepare('SELECT 1').get()
  return c.json({ status: 'ok', db: 'reachable' })
})

app.get('/api/agents', (c) => {
  const rows = db
    .prepare('SELECT id, name, model_type, status, presenting_complaint FROM agents')
    .all() as AgentRow[]

  return c.json(rows.map(toAgent))
})
