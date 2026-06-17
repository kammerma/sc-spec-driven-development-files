import { describe, expect, it } from 'vitest'
import { app } from './app'

describe('GET /api', () => {
  it('returns a 200 JSON status response', async () => {
    const res = await app.request('/api')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })
})
