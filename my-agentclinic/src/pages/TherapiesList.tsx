import { useFetch } from '../hooks/useFetch'
import type { Therapy } from '../server/types'

export default function TherapiesList() {
  const state = useFetch<Therapy[]>('/api/therapies')

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading therapies…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load therapies: {state.message}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Therapies</h2>
      <ul className="page-list">
        {state.data.map((therapy) => (
          <li key={therapy.id} className="page-list-item">
            <strong>{therapy.name}</strong> — {therapy.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
