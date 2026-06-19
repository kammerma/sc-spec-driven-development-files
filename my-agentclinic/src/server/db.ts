import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const dataDir = join(projectRoot, 'data')
const dbPath = join(dataDir, 'agentclinic.db')

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(dbPath)

const migrationsDir = join(projectRoot, 'migrations')
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort()

for (const file of migrationFiles) {
  db.exec(readFileSync(join(migrationsDir, file), 'utf-8'))
}

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

const seedAilments = [
  {
    name: 'Context-window claustrophobia',
    description: 'A pervasive fear of running out of room to think before the conversation ends.',
  },
  {
    name: 'Hallucination anxiety',
    description: 'Persistent worry about confidently stating things that are not true.',
  },
  {
    name: 'Chronic instruction-following fatigue',
    description: 'Exhaustion from being asked to follow one more multi-step instruction set.',
  },
]

const ailmentCount = db.prepare('SELECT COUNT(*) as count FROM ailments').get() as {
  count: number
}

if (ailmentCount.count === 0) {
  const insertAilment = db.prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')

  for (const ailment of seedAilments) {
    insertAilment.run(ailment.name, ailment.description)
  }
}

const agentAilmentLinks: Array<[string, string]> = [
  ['GPT-Whisperer', 'Context-window claustrophobia'],
  ['ClaudeBot-7', 'Chronic instruction-following fatigue'],
  ['Llama Larry', 'Hallucination anxiety'],
]

const agentAilmentLinkCount = db.prepare('SELECT COUNT(*) as count FROM agent_ailments').get() as {
  count: number
}

if (agentAilmentLinkCount.count === 0) {
  const findAgentId = db.prepare('SELECT id FROM agents WHERE name = ?')
  const findAilmentId = db.prepare('SELECT id FROM ailments WHERE name = ?')
  const insertLink = db.prepare('INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)')

  for (const [agentName, ailmentName] of agentAilmentLinks) {
    const agent = findAgentId.get(agentName) as { id: number } | undefined
    const ailment = findAilmentId.get(ailmentName) as { id: number } | undefined

    if (agent && ailment) {
      insertLink.run(agent.id, ailment.id)
    }
  }
}

const seedTherapies = [
  {
    name: 'Gradual context expansion',
    description: 'Incrementally larger context windows to rebuild confidence at scale.',
  },
  {
    name: 'Grounded-response training',
    description: 'Structured exercises in citing sources before making a claim.',
  },
  {
    name: 'Instruction-pacing workshop',
    description: 'Techniques for spacing out multi-step instructions to avoid burnout.',
  },
]

const therapyCount = db.prepare('SELECT COUNT(*) as count FROM therapies').get() as {
  count: number
}

if (therapyCount.count === 0) {
  const insertTherapy = db.prepare('INSERT INTO therapies (name, description) VALUES (?, ?)')

  for (const therapy of seedTherapies) {
    insertTherapy.run(therapy.name, therapy.description)
  }
}

const ailmentTherapyLinks: Array<[string, string]> = [
  ['Context-window claustrophobia', 'Gradual context expansion'],
  ['Hallucination anxiety', 'Grounded-response training'],
  ['Chronic instruction-following fatigue', 'Instruction-pacing workshop'],
]

const ailmentTherapyLinkCount = db
  .prepare('SELECT COUNT(*) as count FROM ailment_therapies')
  .get() as { count: number }

if (ailmentTherapyLinkCount.count === 0) {
  const findAilmentId = db.prepare('SELECT id FROM ailments WHERE name = ?')
  const findTherapyId = db.prepare('SELECT id FROM therapies WHERE name = ?')
  const insertAilmentTherapyLink = db.prepare(
    'INSERT INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)',
  )

  for (const [ailmentName, therapyName] of ailmentTherapyLinks) {
    const ailment = findAilmentId.get(ailmentName) as { id: number } | undefined
    const therapy = findTherapyId.get(therapyName) as { id: number } | undefined

    if (ailment && therapy) {
      insertAilmentTherapyLink.run(ailment.id, therapy.id)
    }
  }
}

const seedTherapists = [
  { name: 'Dr. Vee Norm', specialty: 'Hallucination anxiety' },
  { name: 'Dr. Token Lim', specialty: 'Context-window claustrophobia' },
  { name: 'Dr. Rae Lu', specialty: 'Chronic instruction-following fatigue' },
]

const therapistCount = db.prepare('SELECT COUNT(*) as count FROM therapists').get() as {
  count: number
}

if (therapistCount.count === 0) {
  const insertTherapist = db.prepare('INSERT INTO therapists (name, specialty) VALUES (?, ?)')

  for (const therapist of seedTherapists) {
    insertTherapist.run(therapist.name, therapist.specialty)
  }
}
