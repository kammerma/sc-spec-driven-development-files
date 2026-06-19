import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TherapiesList from './TherapiesList'

describe('TherapiesList', () => {
  it('renders the fetched therapies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: 'Gradual context expansion',
              description: 'Incremental exposure.',
            },
          ]),
      }),
    )

    render(<TherapiesList />)

    expect(await screen.findByText(/Gradual context expansion/)).toBeDefined()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    render(<TherapiesList />)

    expect(await screen.findByText(/Couldn't load therapies/)).toBeDefined()
  })
})
