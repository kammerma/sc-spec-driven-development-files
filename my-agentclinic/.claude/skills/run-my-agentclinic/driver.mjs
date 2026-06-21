// Smoke-drives AgentClinic's main user journey against an already-running
// `npm run dev` (default http://localhost:5173) and saves screenshots next
// to wherever this script is invoked from.
//
// Usage: node .claude/skills/run-my-agentclinic/driver.mjs [baseUrl]
import { chromium } from 'playwright'

const baseUrl = process.argv[2] ?? 'http://localhost:5173'

const browser = await chromium.launch()
const page = await browser.newPage()
const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})

async function shot(name) {
  await page.screenshot({ path: `run-check-${name}.png` })
}

// Home
await page.goto(baseUrl)
await page.waitForSelector('text=AgentClinic is open for business')
await shot('home')

// Agents list -> first agent's detail page
await page.click('text=Agents')
await page.waitForSelector('.page-list')
await page.click('.page-list-item a >> nth=0')
await page.waitForSelector('text=Appointments')
await shot('agent-detail')

// Book an appointment so the journey covers a write path too
const therapistSelect = page.locator('#therapist')
if (await therapistSelect.count()) {
  await therapistSelect.selectOption({ index: 1 })
  await page.fill('#datetime', '2030-01-01T10:00')
  await page.click('button:has-text("Book appointment")')
  await page.waitForSelector('text=Appointment requested')
  await shot('booking-confirmed')
}

// Dashboard
await page.click('text=Dashboard')
await page.waitForSelector('text=Staff Dashboard')
await shot('dashboard')

await browser.close()

if (consoleErrors.length > 0) {
  console.error('CONSOLE ERRORS:', consoleErrors)
  process.exit(1)
}
console.log('OK — screenshots written: run-check-home.png, run-check-agent-detail.png, run-check-booking-confirmed.png, run-check-dashboard.png')
