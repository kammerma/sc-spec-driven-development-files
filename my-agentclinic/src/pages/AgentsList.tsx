import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import type { Agent } from '../server/types'

export default function AgentsList() {
  const state = useFetch<Agent[]>('/api/agents')

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading agents…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load agents: {state.message}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Agents</h2>
      <ul className="page-list">
        {state.data.map((agent) => (
          <li key={agent.id} className="page-list-item">
            <Link to={`/agents/${agent.id}`}>
              <strong>{agent.name}</strong> — {agent.modelType} ({agent.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
