import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Testing Setup', () => {
  it('verifies 1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2)
  })

  it('can render a simple component', () => {
    render(<div>Hello Vitest</div>)
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument()
  })
})
