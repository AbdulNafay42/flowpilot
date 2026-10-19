import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardMockup } from '../components/sections/DashboardMockup'

describe('DashboardMockup sidebar tabs', () => {
  it('starts on Overview and switches the panel when another tab is clicked', async () => {
    const user = userEvent.setup()
    render(<DashboardMockup />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Good morning, Sarah!')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Tasks' }))
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.queryByText('Good morning, Sarah!')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'dash-tab-tasks')

    await user.click(screen.getByRole('tab', { name: 'Team' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Team')
    expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1)
  })

  it('supports arrow-key navigation between tabs', async () => {
    const user = userEvent.setup()
    render(<DashboardMockup />)
    screen.getByRole('tab', { name: 'Overview' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true')
  })
})
