import { describe, expect, it } from 'vitest'
import { app } from './app'

describe('GET /api', () => {
  it('returns a 200 JSON status response', async () => {
    const res = await app.request('/api')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })
})

describe('GET /api/health', () => {
  it('confirms the database is reachable', async () => {
    const res = await app.request('/api/health')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', db: 'reachable' })
  })
})

describe('GET /api/agents', () => {
  it('returns the seeded agents as a JSON array', async () => {
    const res = await app.request('/api/agents')

    expect(res.status).toBe(200)
    const agents = await res.json()
    expect(Array.isArray(agents)).toBe(true)
    expect(agents.length).toBeGreaterThan(0)
    expect(agents[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      modelType: expect.any(String),
      status: expect.any(String),
      presentingComplaint: expect.any(String),
    })
  })
})

describe('GET /api/agents/:id', () => {
  it('returns the matching agent with its linked ailments', async () => {
    const res = await app.request('/api/agents/1')

    expect(res.status).toBe(200)
    const agent = await res.json()
    expect(agent).toMatchObject({
      id: 1,
      name: expect.any(String),
      modelType: expect.any(String),
      status: expect.any(String),
      presentingComplaint: expect.any(String),
    })
    expect(Array.isArray(agent.ailments)).toBe(true)
    expect(agent.ailments.length).toBeGreaterThan(0)
    expect(agent.ailments[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
    })
  })

  it('returns 404 for a non-existent agent', async () => {
    const res = await app.request('/api/agents/999999')

    expect(res.status).toBe(404)
  })
})

describe('GET /api/ailments', () => {
  it('returns the seeded ailments as a JSON array', async () => {
    const res = await app.request('/api/ailments')

    expect(res.status).toBe(200)
    const ailments = await res.json()
    expect(Array.isArray(ailments)).toBe(true)
    expect(ailments.length).toBeGreaterThan(0)
    expect(ailments[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
    })
  })
})

describe('GET /api/ailments/:id', () => {
  it('returns the matching ailment with its recommended therapies', async () => {
    const res = await app.request('/api/ailments/1')

    expect(res.status).toBe(200)
    const ailment = await res.json()
    expect(ailment).toMatchObject({
      id: 1,
      name: expect.any(String),
      description: expect.any(String),
    })
    expect(Array.isArray(ailment.therapies)).toBe(true)
    expect(ailment.therapies.length).toBeGreaterThan(0)
    expect(ailment.therapies[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
    })
  })

  it('returns 404 for a non-existent ailment', async () => {
    const res = await app.request('/api/ailments/999999')

    expect(res.status).toBe(404)
  })
})

describe('GET /api/therapies', () => {
  it('returns the seeded therapies as a JSON array', async () => {
    const res = await app.request('/api/therapies')

    expect(res.status).toBe(200)
    const therapies = await res.json()
    expect(Array.isArray(therapies)).toBe(true)
    expect(therapies.length).toBeGreaterThan(0)
    expect(therapies[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
    })
  })
})

describe('GET /api/therapists', () => {
  it('returns the seeded therapists as a JSON array', async () => {
    const res = await app.request('/api/therapists')

    expect(res.status).toBe(200)
    const therapists = await res.json()
    expect(Array.isArray(therapists)).toBe(true)
    expect(therapists.length).toBeGreaterThan(0)
    expect(therapists[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      specialty: expect.any(String),
    })
  })
})

describe('POST /api/appointments', () => {
  it('creates an appointment with status "requested"', async () => {
    const res = await app.request('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 1, therapistId: 1, datetime: '2026-07-01T10:00:00Z' }),
    })

    expect(res.status).toBe(201)
    const appointment = await res.json()
    expect(appointment).toMatchObject({
      id: expect.any(Number),
      agentId: 1,
      therapistId: 1,
      datetime: '2026-07-01T10:00:00Z',
      status: 'requested',
    })
  })

  it('rejects a request with an invalid datetime', async () => {
    const res = await app.request('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 1, therapistId: 1, datetime: 'not-a-date' }),
    })

    expect(res.status).toBe(400)
  })

  it('rejects a request with a non-existent agent', async () => {
    const res = await app.request('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 999999, therapistId: 1, datetime: '2026-07-01T10:00:00Z' }),
    })

    expect(res.status).toBe(400)
  })
})

describe('GET /api/dashboard', () => {
  it('returns summary counts derived from the seed data', async () => {
    const res = await app.request('/api/dashboard')

    expect(res.status).toBe(200)
    const dashboard = await res.json()
    expect(dashboard).toMatchObject({
      agentCount: expect.any(Number),
      openAppointmentCount: expect.any(Number),
      ailmentsInFlightCount: expect.any(Number),
    })
    expect(dashboard.agentCount).toBeGreaterThan(0)
    expect(dashboard.ailmentsInFlightCount).toBeGreaterThan(0)
  })
})
