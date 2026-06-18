import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the AgentClinic home page', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'AgentClinic is open for business' })).toBeDefined()
    expect(screen.getByText(/wellness platform for AI agents/)).toBeDefined()
  })
})
