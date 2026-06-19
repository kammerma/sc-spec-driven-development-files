import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import type { Ailment } from '../server/types'

export default function AilmentsList() {
  const state = useFetch<Ailment[]>('/api/ailments')

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading ailments…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load ailments: {state.message}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Ailments</h2>
      <ul className="page-list">
        {state.data.map((ailment) => (
          <li key={ailment.id} className="page-list-item">
            <Link to={`/ailments/${ailment.id}`}>
              <strong>{ailment.name}</strong> — {ailment.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
