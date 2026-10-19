import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeatureTabs } from '../components/sections/FeatureTabs'
import type { TabItem } from '../types'

const items: TabItem[] = [
  { id: 'plan', label: 'Plan', title: 'Plan title', description: 'd1', metric: { value: '1', label: 'm', percent: 10 } },
  { id: 'automate', label: 'Automate', title: 'Automate title', description: 'd2', metric: { value: '2', label: 'm', percent: 20 } },
  { id: 'collaborate', label: 'Collaborate', title: 'Collaborate title', description: 'd3', metric: { value: '3', label: 'm', percent: 30 } },
]

describe('FeatureTabs', () => {
  it('changes displayed content and keeps one active tab', async () => {
    const user = userEvent.setup()
    render(<FeatureTabs items={items} />)
    expect(screen.getByText('Plan title')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Automate' }))
    expect(screen.getByText('Automate title')).toBeInTheDocument()
    expect(screen.queryByText('Plan title')).not.toBeInTheDocument()
    expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1)
  })

  it('supports arrow-key navigation', async () => {
    const user = userEvent.setup()
    render(<FeatureTabs items={items} />)
    screen.getByRole('tab', { name: 'Plan' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Automate' })).toHaveAttribute('aria-selected', 'true')
  })
})
