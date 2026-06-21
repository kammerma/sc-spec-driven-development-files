import { useState, type FormEvent } from 'react'

type FeedbackFormProps = {
  appointmentId: number
}

export default function FeedbackForm({ appointmentId }: FeedbackFormProps) {
  const [rating, setRating] = useState('')
  const [message, setMessage] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId,
        rating: Number(rating),
        message,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setSubmitError(body?.error ?? `Submitting feedback failed with status ${res.status}`)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return <p role="status">Thanks for the feedback!</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="rating">Rating</label>
        <select id="rating" required value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="" disabled>
            Select a rating
          </option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} star{value === 1 ? '' : 's'}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      {submitError && <p className="page-error">{submitError}</p>}
      <button type="submit">Submit feedback</button>
    </form>
  )
}
