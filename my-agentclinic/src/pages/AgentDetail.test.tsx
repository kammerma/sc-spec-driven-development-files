import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AgentDetail from './AgentDetail'

function renderAtAgent(id: string) {
  render(
    <MemoryRouter initialEntries={[`/agents/${id}`]}>
      <Routes>
        <Route path="/agents/:id" element={<AgentDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

function stubFetchByUrl(responses: Record<string, unknown>) {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const matchedUrl = Object.keys(responses).find((key) => url.startsWith(key))
      if (!matchedUrl) {
        return Promise.resolve({ ok: false, status: 404 })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(responses[matchedUrl]) })
    }),
  )
}

describe('AgentDetail', () => {
  it('renders the fetched agent', async () => {
    stubFetchByUrl({
      '/api/agents/1': {
        id: 1,
        name: 'ClaudeBot-7',
        modelType: 'Claude 3.5 Sonnet',
        status: 'Stable',
        presentingComplaint: 'Chronic instruction-following fatigue',
        ailments: [
          { id: 1, name: 'Chronic instruction-following fatigue', description: 'Exhaustion.' },
        ],
      },
      '/api/therapists': [{ id: 1, name: 'Dr. Rae Lu', specialty: 'Chronic instruction-following fatigue' }],
    })

    renderAtAgent('1')

    expect(await screen.findByRole('heading', { name: 'ClaudeBot-7' })).toBeDefined()
    expect(screen.getAllByText(/Chronic instruction-following fatigue/).length).toBeGreaterThan(0)
  })

  it('shows a fallback message when the agent has no linked ailments', async () => {
    stubFetchByUrl({
      '/api/agents/2': {
        id: 2,
        name: 'Geminia',
        modelType: 'Gemini 1.5 Pro',
        status: 'In Treatment',
        presentingComplaint: 'Multimodal overload',
        ailments: [],
      },
      '/api/therapists': [],
    })

    renderAtAgent('2')

    expect(await screen.findByText('No ailments on file.')).toBeDefined()
  })

  it('shows an error message when the agent is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    renderAtAgent('999999')

    expect(await screen.findByText(/Couldn't load this agent/)).toBeDefined()
  })
})
