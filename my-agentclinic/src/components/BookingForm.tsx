import { useState, type FormEvent } from 'react'
import { useFetch } from '../hooks/useFetch'
import type { Therapist } from '../server/types'

type BookingFormProps = {
  agentId: number
}

export default function BookingForm({ agentId }: BookingFormProps) {
  const therapistsState = useFetch<Therapist[]>('/api/therapists')
  const [therapistId, setTherapistId] = useState('')
  const [datetime, setDatetime] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        therapistId: Number(therapistId),
        datetime,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setSubmitError(body?.error ?? `Booking failed with status ${res.status}`)
      return
    }

    setConfirmed(true)
  }

  if (confirmed) {
    return <p role="status">Appointment requested. We'll be in touch to confirm.</p>
  }

  if (therapistsState.status === 'loading') {
    return <p>Loading booking form…</p>
  }

  if (therapistsState.status === 'error') {
    return <p className="page-error">Couldn't load the booking form: {therapistsState.message}</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="therapist">Therapist</label>
        <select
          id="therapist"
          required
          value={therapistId}
          onChange={(event) => setTherapistId(event.target.value)}
        >
          <option value="" disabled>
            Select a therapist
          </option>
          {therapistsState.data.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.name} — {therapist.specialty}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="datetime">Date and time</label>
        <input
          id="datetime"
          type="datetime-local"
          required
          value={datetime}
          onChange={(event) => setDatetime(event.target.value)}
        />
      </div>
      {submitError && <p className="page-error">{submitError}</p>}
      <button type="submit">Book appointment</button>
    </form>
  )
}
