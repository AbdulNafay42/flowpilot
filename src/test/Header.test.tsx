import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../components/layout/Header'

describe('Header mobile menu', () => {
  it('opens, closes on link click, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    const nav = screen.getByRole('navigation', { name: 'Mobile' })
    expect(nav).toBeInTheDocument()

    await user.click(screen.getAllByRole('link', { name: 'Pricing' }).at(-1)!)
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })

  it('behaves as a modal dialog: focus moves in, the page behind is inert, scroll is locked', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Header />
        <main>content</main>
        <footer>foot</footer>
      </>,
    )
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
    expect(document.querySelector('main')).toHaveAttribute('inert')
    expect(document.querySelector('footer')).toHaveAttribute('inert')
    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
    expect(document.querySelector('main')).not.toHaveAttribute('inert')
    expect(document.body.style.overflow).toBe('')
  })
})
