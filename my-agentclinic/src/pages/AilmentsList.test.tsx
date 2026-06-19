import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AilmentsList from './AilmentsList'

describe('AilmentsList', () => {
  it('renders the fetched ailments', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: 'Context-window claustrophobia',
              description: 'A pervasive fear of running out of room to think.',
            },
          ]),
      }),
    )

    render(
      <MemoryRouter>
        <AilmentsList />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Context-window claustrophobia/)).toBeDefined()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    render(
      <MemoryRouter>
        <AilmentsList />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Couldn't load ailments/)).toBeDefined()
  })
})
