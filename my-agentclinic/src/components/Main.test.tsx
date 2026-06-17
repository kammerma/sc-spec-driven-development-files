import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Main from './Main'

describe('Main', () => {
  it('renders its children inside a <main> element', () => {
    render(
      <Main>
        <p>hello</p>
      </Main>,
    )

    const main = screen.getByText('hello').closest('main')
    expect(main).not.toBeNull()
  })
})
