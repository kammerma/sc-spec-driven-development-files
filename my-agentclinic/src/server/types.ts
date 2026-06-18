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
