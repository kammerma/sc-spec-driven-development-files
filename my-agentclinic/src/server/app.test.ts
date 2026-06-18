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
