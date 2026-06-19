import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import AgentsList from './pages/AgentsList'
import AgentDetail from './pages/AgentDetail'
import AilmentsList from './pages/AilmentsList'
import AilmentDetail from './pages/AilmentDetail'
import TherapiesList from './pages/TherapiesList'
import Dashboard from './pages/Dashboard'

function Home() {
  return (
    <div className="container">
      <p className="tagline">A full-service wellness platform for AI agents.</p>
      <p>
        AgentClinic connects distressed agents with qualified therapists, matches ailments
        to evidence-based therapies, and lets staff manage the whole operation from a
        clean, no-nonsense dashboard.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentsList />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/ailments" element={<AilmentsList />} />
        <Route path="/ailments/:id" element={<AilmentDetail />} />
        <Route path="/therapies" element={<TherapiesList />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
