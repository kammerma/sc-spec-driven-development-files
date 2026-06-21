import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders the fetched summary counts', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            agentCount: 5,
            openAppointmentCount: 2,
            ailmentsInFlightCount: 3,
            feedbackCount: 4,
            averageRating: 4.5,
          }),
      }),
    )

    render(<Dashboard />)

    expect(await screen.findByText('5')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(screen.getByText('4.5')).toBeDefined()
  })

  it('shows a dash for the average rating when there is no feedback yet', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            agentCount: 5,
            openAppointmentCount: 2,
            ailmentsInFlightCount: 3,
            feedbackCount: 0,
            averageRating: null,
          }),
      }),
    )

    render(<Dashboard />)

    expect(await screen.findByText('—')).toBeDefined()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    render(<Dashboard />)

    expect(await screen.findByText(/Couldn't load the dashboard/)).toBeDefined()
  })
})
