import { useParams } from 'react-router-dom'
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
      <h3>Book an Appointment</h3>
      <BookingForm agentId={agent.id} />
    </div>
  )
}
