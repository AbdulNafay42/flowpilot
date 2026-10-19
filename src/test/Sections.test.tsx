import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Features } from '../components/sections/Features'
import { Footer } from '../components/layout/Footer'
import { Pricing } from '../components/sections/Pricing'

describe('Pricing', () => {
  it('renders Starter, Pro and Business with monthly prices and one featured plan', () => {
    render(<Pricing />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(within(cards[0]).getByText('Starter')).toBeInTheDocument()
    expect(within(cards[0]).getByText('$0')).toBeInTheDocument()
    expect(within(cards[1]).getByText('$19')).toBeInTheDocument()
    expect(within(cards[1]).getByText('Most Popular')).toBeInTheDocument()
    expect(within(cards[2]).getByText('$49')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches to yearly prices and back with the Monthly/Yearly toggle', async () => {
    const user = userEvent.setup()
    render(<Pricing />)
    await user.click(screen.getByRole('button', { name: 'Yearly' }))
    expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'false')
    const cards = screen.getAllByRole('article')
    expect(within(cards[1]).getByText('$228')).toBeInTheDocument()
    expect(within(cards[1]).getByText('/year')).toBeInTheDocument()
    expect(within(cards[2]).getByText('$588')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Monthly' }))
    expect(within(screen.getAllByRole('article')[1]).getByText('$19')).toBeInTheDocument()
  })
})

describe('Features', () => {
  it('renders the four feature cards from data', () => {
    render(<Features />)
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getByRole('heading', { level: 3, name: 'Smart Task Planning' })).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('shows the copyright and legal links', () => {
    render(<Footer />)
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument()
    for (const name of ['Privacy', 'Terms', 'Security']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
  })
})
