import { Link, useParams } from 'react-router-dom'
import BookingForm from '../components/BookingForm'
import { useFetch } from '../hooks/useFetch'
import type { AgentWithAilments } from '../server/types'

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>()
  const state = useFetch<AgentWithAilments>(`/api/agents/${id}`)

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading agent…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load this agent: {state.message}</p>
      </div>
    )
  }

  const agent = state.data

  return (
    <div className="container">
      <h2>{agent.name}</h2>
      <dl>
        <dt>Model type</dt>
        <dd>{agent.modelType}</dd>
        <dt>Status</dt>
        <dd>{agent.status}</dd>
        <dt>Presenting complaint</dt>
        <dd>{agent.presentingComplaint}</dd>
      </dl>
      <h3>Ailments</h3>
      {agent.ailments.length === 0 ? (
        <p>No ailments on file.</p>
      ) : (
        <ul className="page-list">
          {agent.ailments.map((ailment) => (
            <li key={ailment.id} className="page-list-item">
              <strong>{ailment.name}</strong> — {ailment.description}
            </li>
          ))}
        </ul>
      )}
      <h3>Appointments</h3>
      {agent.appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul className="page-list">
          {agent.appointments.map((appointment) => (
            <li key={appointment.id} className="page-list-item">
              <strong>{appointment.therapistName}</strong> — {appointment.datetime} (
              {appointment.status}){' '}
              {appointment.hasFeedback ? (
                <span>Feedback submitted</span>
              ) : (
                <Link to={`/agents/${agent.id}/appointments/${appointment.id}/feedback`}>
                  Leave feedback
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
      <h3>Book an Appointment</h3>
      <BookingForm agentId={agent.id} />
    </div>
  )
}
