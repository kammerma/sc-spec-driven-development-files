import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('renders the AgentClinic heading', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'AgentClinic is open for business' })).toBeDefined()
  })

  it('renders nav links to every section', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Agents' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Ailments' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Therapies' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeDefined()
  })
})
