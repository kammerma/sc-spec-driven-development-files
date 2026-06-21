import { useParams } from 'react-router-dom'
import FeedbackForm from '../components/FeedbackForm'

export default function FeedbackPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>()

  return (
    <div className="container">
      <h2>Leave Feedback</h2>
      <FeedbackForm appointmentId={Number(appointmentId)} />
    </div>
  )
}
