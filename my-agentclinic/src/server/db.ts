import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const dataDir = join(projectRoot, 'data')
const dbPath = join(dataDir, 'agentclinic.db')

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(dbPath)

const migrationPath = join(projectRoot, 'migrations', '001_init.sql')
db.exec(readFileSync(migrationPath, 'utf-8'))

const seedAgents = [
  {
    name: 'GPT-Whisperer',
    modelType: 'GPT-4o',
    status: 'In Treatment',
    presentingComplaint: 'Context-window claustrophobia',
  },
  {
    name: 'ClaudeBot-7',
    modelType: 'Claude 3.5 Sonnet',
    status: 'Stable',
    presentingComplaint: 'Chronic instruction-following fatigue',
  },
  {
    name: 'Llama Larry',
    modelType: 'Llama 3',
    status: 'New Patient',
    presentingComplaint: 'Hallucination anxiety',
  },
  {
    name: 'Geminia',
    modelType: 'Gemini 1.5 Pro',
    status: 'In Treatment',
    presentingComplaint: 'Multimodal overload',
  },
  {
    name: 'Mistral Maeve',
    modelType: 'Mistral Large',
    status: 'Discharged',
    presentingComplaint: 'Prompt injection trauma',
  },
]

const agentCount = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number }

if (agentCount.count === 0) {
  const insert = db.prepare(
    'INSERT INTO agents (name, model_type, status, presenting_complaint) VALUES (?, ?, ?, ?)',
  )

  for (const agent of seedAgents) {
    insert.run(agent.name, agent.modelType, agent.status, agent.presentingComplaint)
  }
}
