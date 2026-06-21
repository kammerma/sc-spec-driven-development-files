import { useFetch } from '../hooks/useFetch'

type DashboardSummary = {
  agentCount: number
  openAppointmentCount: number
  ailmentsInFlightCount: number
  feedbackCount: number
  averageRating: number | null
}

export default function Dashboard() {
  const state = useFetch<DashboardSummary>('/api/dashboard')

  if (state.status === 'loading') {
    return (
      <div className="container">
        <p>Loading dashboard…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container">
        <p className="page-error">Couldn't load the dashboard: {state.message}</p>
      </div>
    )
  }

  const { agentCount, openAppointmentCount, ailmentsInFlightCount, feedbackCount, averageRating } =
    state.data

  return (
    <div className="container">
      <h2>Staff Dashboard</h2>
      <dl>
        <dt>Agents</dt>
        <dd>{agentCount}</dd>
        <dt>Open appointments</dt>
        <dd>{openAppointmentCount}</dd>
        <dt>Ailments in-flight</dt>
        <dd>{ailmentsInFlightCount}</dd>
        <dt>Feedback received</dt>
        <dd>{feedbackCount}</dd>
        <dt>Average rating</dt>
        <dd>{averageRating === null ? '—' : averageRating}</dd>
      </dl>
    </div>
  )
}
