import { Hono } from 'hono'
import { db } from './db'
import {
  toAgent,
  toAilment,
  toAppointment,
  toTherapist,
  toTherapy,
  type AgentRow,
  type AilmentRow,
  type AppointmentRow,
  type TherapistRow,
  type TherapyRow,
} from './types'

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

app.get('/api/agents/:id', (c) => {
  const row = db
    .prepare('SELECT id, name, model_type, status, presenting_complaint FROM agents WHERE id = ?')
    .get(c.req.param('id')) as AgentRow | undefined

  if (!row) {
    return c.json({ error: 'Agent not found' }, 404)
  }

  const ailmentRows = db
    .prepare(
      `SELECT ailments.id, ailments.name, ailments.description
       FROM agent_ailments
       JOIN ailments ON ailments.id = agent_ailments.ailment_id
       WHERE agent_ailments.agent_id = ?`,
    )
    .all(row.id) as AilmentRow[]

  return c.json({ ...toAgent(row), ailments: ailmentRows.map(toAilment) })
})

app.get('/api/ailments', (c) => {
  const rows = db.prepare('SELECT id, name, description FROM ailments').all() as AilmentRow[]

  return c.json(rows.map(toAilment))
})

app.get('/api/ailments/:id', (c) => {
  const row = db
    .prepare('SELECT id, name, description FROM ailments WHERE id = ?')
    .get(c.req.param('id')) as AilmentRow | undefined

  if (!row) {
    return c.json({ error: 'Ailment not found' }, 404)
  }

  const therapyRows = db
    .prepare(
      `SELECT therapies.id, therapies.name, therapies.description
       FROM ailment_therapies
       JOIN therapies ON therapies.id = ailment_therapies.therapy_id
       WHERE ailment_therapies.ailment_id = ?`,
    )
    .all(row.id) as TherapyRow[]

  return c.json({ ...toAilment(row), therapies: therapyRows.map(toTherapy) })
})

app.get('/api/therapies', (c) => {
  const rows = db.prepare('SELECT id, name, description FROM therapies').all() as TherapyRow[]

  return c.json(rows.map(toTherapy))
})

app.get('/api/therapists', (c) => {
  const rows = db.prepare('SELECT id, name, specialty FROM therapists').all() as TherapistRow[]

  return c.json(rows.map(toTherapist))
})

app.post('/api/appointments', async (c) => {
  const body = await c.req.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return c.json({ error: 'Request body must be a JSON object' }, 400)
  }

  const { agentId, therapistId, datetime } = body as Record<string, unknown>

  if (typeof agentId !== 'number' || typeof therapistId !== 'number' || typeof datetime !== 'string') {
    return c.json(
      { error: 'agentId (number), therapistId (number), and datetime (string) are required' },
      400,
    )
  }

  if (Number.isNaN(Date.parse(datetime))) {
    return c.json({ error: 'datetime must be a valid date' }, 400)
  }

  const agent = db.prepare('SELECT id FROM agents WHERE id = ?').get(agentId)
  if (!agent) {
    return c.json({ error: 'No agent with that id' }, 400)
  }

  const therapist = db.prepare('SELECT id FROM therapists WHERE id = ?').get(therapistId)
  if (!therapist) {
    return c.json({ error: 'No therapist with that id' }, 400)
  }

  const result = db
    .prepare(
      'INSERT INTO appointments (agent_id, therapist_id, datetime, status) VALUES (?, ?, ?, ?)',
    )
    .run(agentId, therapistId, datetime, 'requested')

  const row = db
    .prepare('SELECT id, agent_id, therapist_id, datetime, status FROM appointments WHERE id = ?')
    .get(result.lastInsertRowid) as AppointmentRow

  return c.json(toAppointment(row), 201)
})

app.get('/api/dashboard', (c) => {
  const agentCount = (db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number })
    .count

  const openAppointmentCount = (
    db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'requested'").get() as {
      count: number
    }
  ).count

  const ailmentsInFlightCount = (
    db
      .prepare('SELECT COUNT(DISTINCT ailment_id) as count FROM agent_ailments')
      .get() as { count: number }
  ).count

  return c.json({ agentCount, openAppointmentCount, ailmentsInFlightCount })
})
