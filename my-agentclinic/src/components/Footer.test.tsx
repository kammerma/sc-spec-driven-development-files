import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders a copyright line with the current year', () => {
    render(<Footer />)

    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeDefined()
    expect(screen.getByText(/AgentClinic/)).toBeDefined()
  })
})
