import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FeedbackForm from './FeedbackForm'

function stubFetch(response: { ok: boolean; status?: number; body?: unknown }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status,
      json: () => Promise.resolve(response.body),
    }),
  )
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('Rating'), { target: { value: '5' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Great session.' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit feedback' }))
}

describe('FeedbackForm', () => {
  it('shows a thank-you message after a successful submission', async () => {
    stubFetch({ ok: true, body: { id: 1, appointmentId: 10, rating: 5, message: 'Great session.' } })

    render(<FeedbackForm appointmentId={10} />)

    fillAndSubmit()

    expect(await screen.findByText('Thanks for the feedback!')).toBeDefined()
  })

  it('shows an error message when the submission fails', async () => {
    stubFetch({ ok: false, status: 400, body: { error: 'Feedback has already been submitted for this appointment' } })

    render(<FeedbackForm appointmentId={10} />)

    fillAndSubmit()

    expect(
      await screen.findByText('Feedback has already been submitted for this appointment'),
    ).toBeDefined()
  })
})
