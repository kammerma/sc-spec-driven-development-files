import { Hono } from 'hono'
import { db } from './db'
import {
  toAgent,
  toAilment,
  toAppointment,
  toAppointmentWithTherapist,
  toFeedback,
  toTherapist,
  toTherapy,
  type AgentRow,
  type AilmentRow,
  type AppointmentRow,
  type AppointmentWithTherapistRow,
  type FeedbackRow,
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

  const appointmentRows = db
    .prepare(
      `SELECT
         appointments.id,
         therapists.name AS therapist_name,
         appointments.datetime,
         appointments.status,
         CASE WHEN feedback.id IS NULL THEN 0 ELSE 1 END AS has_feedback
       FROM appointments
       JOIN therapists ON therapists.id = appointments.therapist_id
       LEFT JOIN feedback ON feedback.appointment_id = appointments.id
       WHERE appointments.agent_id = ?
       ORDER BY appointments.datetime DESC`,
    )
    .all(row.id) as AppointmentWithTherapistRow[]

  return c.json({
    ...toAgent(row),
    ailments: ailmentRows.map(toAilment),
    appointments: appointmentRows.map(toAppointmentWithTherapist),
  })
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

app.post('/api/feedback', async (c) => {
  const body = await c.req.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return c.json({ error: 'Request body must be a JSON object' }, 400)
  }

  const { appointmentId, rating, message } = body as Record<string, unknown>

  if (typeof appointmentId !== 'number' || typeof rating !== 'number' || typeof message !== 'string') {
    return c.json(
      { error: 'appointmentId (number), rating (number), and message (string) are required' },
      400,
    )
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return c.json({ error: 'rating must be an integer from 1 to 5' }, 400)
  }

  if (message.trim().length === 0) {
    return c.json({ error: 'message must not be empty' }, 400)
  }

  const appointment = db.prepare('SELECT id FROM appointments WHERE id = ?').get(appointmentId)
  if (!appointment) {
    return c.json({ error: 'No appointment with that id' }, 400)
  }

  const existingFeedback = db
    .prepare('SELECT id FROM feedback WHERE appointment_id = ?')
    .get(appointmentId)
  if (existingFeedback) {
    return c.json({ error: 'Feedback has already been submitted for this appointment' }, 400)
  }

  const result = db
    .prepare('INSERT INTO feedback (appointment_id, rating, message) VALUES (?, ?, ?)')
    .run(appointmentId, rating, message)

  const row = db
    .prepare('SELECT id, appointment_id, rating, message, created_at FROM feedback WHERE id = ?')
    .get(result.lastInsertRowid) as FeedbackRow

  return c.json(toFeedback(row), 201)
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

  const feedbackSummary = db
    .prepare('SELECT COUNT(*) as count, AVG(rating) as average FROM feedback')
    .get() as { count: number; average: number | null }

  const feedbackCount = feedbackSummary.count
  const averageRating =
    feedbackCount === 0 ? null : Math.round(feedbackSummary.average! * 10) / 10

  return c.json({
    agentCount,
    openAppointmentCount,
    ailmentsInFlightCount,
    feedbackCount,
    averageRating,
  })
})
