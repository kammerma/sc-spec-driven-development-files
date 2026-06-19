import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Layout from './Layout'

describe('Layout', () => {
  it('renders the header, children, and footer together', () => {
    render(
      <MemoryRouter>
        <Layout>
          <p>page content</p>
        </Layout>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'AgentClinic is open for business' })).toBeDefined()
    expect(screen.getByText('page content')).toBeDefined()
    expect(screen.getByText(/AgentClinic/, { selector: 'footer p' })).toBeDefined()
  })
})
