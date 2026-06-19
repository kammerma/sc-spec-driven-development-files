import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AilmentDetail from './AilmentDetail'

function renderAtAilment(id: string) {
  render(
    <MemoryRouter initialEntries={[`/ailments/${id}`]}>
      <Routes>
        <Route path="/ailments/:id" element={<AilmentDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AilmentDetail', () => {
  it('renders the fetched ailment and its recommended therapies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: 'Context-window claustrophobia',
            description: 'A pervasive fear of running out of room to think.',
            therapies: [
              { id: 1, name: 'Gradual context expansion', description: 'Incremental exposure.' },
            ],
          }),
      }),
    )

    renderAtAilment('1')

    expect(
      await screen.findByRole('heading', { name: 'Context-window claustrophobia' }),
    ).toBeDefined()
    expect(screen.getByText(/Gradual context expansion/)).toBeDefined()
  })

  it('shows an error message when the ailment is not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    renderAtAilment('999999')

    expect(await screen.findByText(/Couldn't load this ailment/)).toBeDefined()
  })
})
