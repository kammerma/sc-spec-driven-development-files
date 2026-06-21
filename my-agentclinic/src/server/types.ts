export interface Agent {
  id: number
  name: string
  modelType: string
  status: string
  presentingComplaint: string
}

export interface AgentRow {
  id: number
  name: string
  model_type: string
  status: string
  presenting_complaint: string
}

export function toAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    modelType: row.model_type,
    status: row.status,
    presentingComplaint: row.presenting_complaint,
  }
}

export interface Ailment {
  id: number
  name: string
  description: string
}

export interface AgentWithAilments extends Agent {
  ailments: Ailment[]
  appointments: AppointmentWithTherapist[]
}

export interface AilmentRow {
  id: number
  name: string
  description: string
}

export function toAilment(row: AilmentRow): Ailment {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  }
}

export interface Therapy {
  id: number
  name: string
  description: string
}

export interface TherapyRow {
  id: number
  name: string
  description: string
}

export function toTherapy(row: TherapyRow): Therapy {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  }
}

export interface AilmentWithTherapies extends Ailment {
  therapies: Therapy[]
}

export interface Therapist {
  id: number
  name: string
  specialty: string
}

export interface TherapistRow {
  id: number
  name: string
  specialty: string
}

export function toTherapist(row: TherapistRow): Therapist {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty,
  }
}

export interface Appointment {
  id: number
  agentId: number
  therapistId: number
  datetime: string
  status: string
}

export interface AppointmentRow {
  id: number
  agent_id: number
  therapist_id: number
  datetime: string
  status: string
}

export function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    agentId: row.agent_id,
    therapistId: row.therapist_id,
    datetime: row.datetime,
    status: row.status,
  }
}

export interface AppointmentWithTherapist {
  id: number
  therapistName: string
  datetime: string
  status: string
  hasFeedback: boolean
}

export interface AppointmentWithTherapistRow {
  id: number
  therapist_name: string
  datetime: string
  status: string
  has_feedback: number
}

export function toAppointmentWithTherapist(
  row: AppointmentWithTherapistRow,
): AppointmentWithTherapist {
  return {
    id: row.id,
    therapistName: row.therapist_name,
    datetime: row.datetime,
    status: row.status,
    hasFeedback: row.has_feedback === 1,
  }
}

export interface Feedback {
  id: number
  appointmentId: number
  rating: number
  message: string
  createdAt: string
}

export interface FeedbackRow {
  id: number
  appointment_id: number
  rating: number
  message: string
  created_at: string
}

export function toFeedback(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    rating: row.rating,
    message: row.message,
    createdAt: row.created_at,
  }
}
