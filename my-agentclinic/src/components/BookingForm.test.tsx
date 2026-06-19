import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BookingForm from './BookingForm'

function stubFetchByUrl(responses: Record<string, { ok: boolean; status?: number; body?: unknown }>) {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const matchedUrl = Object.keys(responses).find((key) => url.startsWith(key))
      if (!matchedUrl) {
        return Promise.resolve({ ok: false, status: 404 })
      }
      const { ok, status, body } = responses[matchedUrl]
      return Promise.resolve({ ok, status, json: () => Promise.resolve(body) })
    }),
  )
}

async function fillAndSubmit() {
  const select = await screen.findByLabelText('Therapist')
  fireEvent.change(select, { target: { value: '1' } })
  const datetimeInput = screen.getByLabelText('Date and time')
  fireEvent.change(datetimeInput, { target: { value: '2026-07-01T10:00' } })
  fireEvent.click(screen.getByRole('button', { name: 'Book appointment' }))
}

describe('BookingForm', () => {
  it('shows a confirmation message after a successful booking', async () => {
    stubFetchByUrl({
      '/api/therapists': { ok: true, body: [{ id: 1, name: 'Dr. Rae Lu', specialty: 'Fatigue' }] },
      '/api/appointments': {
        ok: true,
        body: { id: 1, agentId: 1, therapistId: 1, datetime: '2026-07-01T10:00', status: 'requested' },
      },
    })

    render(<BookingForm agentId={1} />)

    await fillAndSubmit()

    expect(await screen.findByText(/Appointment requested/)).toBeDefined()
  })

  it('shows an error message when the booking request fails', async () => {
    stubFetchByUrl({
      '/api/therapists': { ok: true, body: [{ id: 1, name: 'Dr. Rae Lu', specialty: 'Fatigue' }] },
      '/api/appointments': { ok: false, status: 400, body: { error: 'datetime must be a valid date' } },
    })

    render(<BookingForm agentId={1} />)

    await fillAndSubmit()

    expect(await screen.findByText('datetime must be a valid date')).toBeDefined()
  })
})
