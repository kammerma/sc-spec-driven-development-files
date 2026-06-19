import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import type { AilmentWithTherapies } from '../server/types'

export default function AilmentDetail() {
  const { id } = useParams<{ id: string }>()
  const state = useFetch<AilmentWithTherapies>(`/api/ailments/${id}`)

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading ailment…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load this ailment: {state.message}</p>
      </div>
    )
  }

  const ailment = state.data

  return (
    <div className="container">
      <h2>{ailment.name}</h2>
      <p>{ailment.description}</p>
      <h3>Recommended Therapies</h3>
      {ailment.therapies.length === 0 ? (
        <p>No therapies on file.</p>
      ) : (
        <ul className="page-list">
          {ailment.therapies.map((therapy) => (
            <li key={therapy.id} className="page-list-item">
              <strong>{therapy.name}</strong> — {therapy.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
