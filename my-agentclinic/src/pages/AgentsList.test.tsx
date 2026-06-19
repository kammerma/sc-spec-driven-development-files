import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AgentsList from './AgentsList'

describe('AgentsList', () => {
  it('renders the fetched agents linked to their detail pages', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: 'ClaudeBot-7',
              modelType: 'Claude 3.5 Sonnet',
              status: 'Stable',
              presentingComplaint: 'Chronic instruction-following fatigue',
            },
          ]),
      }),
    )

    render(
      <MemoryRouter>
        <AgentsList />
      </MemoryRouter>,
    )

    const link = await screen.findByRole('link', { name: /ClaudeBot-7/ })
    expect(link.getAttribute('href')).toBe('/agents/1')
  })

  it('shows an error message when the fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    render(
      <MemoryRouter>
        <AgentsList />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Couldn't load agents/)).toBeDefined()
  })
})
