import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Layout from './Layout'

describe('Layout', () => {
  it('renders the header, children, and footer together', () => {
    render(
      <Layout>
        <p>page content</p>
      </Layout>,
    )

    expect(screen.getByRole('heading', { name: 'AgentClinic' })).toBeDefined()
    expect(screen.getByText('page content')).toBeDefined()
    expect(screen.getByText(/AgentClinic/, { selector: 'footer p' })).toBeDefined()
  })
})
