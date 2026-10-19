import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../components/sections/ContactForm'
import { SUCCESS_MESSAGE } from '../data/form'

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name'), 'Jane Doe')
  await user.type(screen.getByLabelText('Work Email'), 'jane@example.com')
  await user.type(screen.getByLabelText('Company Name'), 'Acme')
  await user.selectOptions(screen.getByLabelText('Team Size'), '11-50')
  await user.type(screen.getByLabelText('Message'), 'This message is long enough to pass.')
  await user.click(screen.getByLabelText(/agree to the terms/i))
}

describe('ContactForm', () => {
  it('does not submit an empty form and shows errors', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Work email is required')).toBeInTheDocument()
    expect(screen.getByText('You must accept the terms to continue')).toBeInTheDocument()
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument()
  })

  it('shows and requires Preferred Demo Time only for 200+', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    expect(screen.queryByLabelText('Preferred Demo Time')).not.toBeInTheDocument()

    await fillValid(user)
    await user.selectOptions(screen.getByLabelText('Team Size'), '200+')
    expect(screen.getByLabelText('Preferred Demo Time')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Select a preferred demo time')).toBeInTheDocument()
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument()

    // Switching away removes the field and it no longer blocks submission.
    await user.selectOptions(screen.getByLabelText('Team Size'), '1-10')
    expect(screen.queryByLabelText('Preferred Demo Time')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText(SUCCESS_MESSAGE, {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('validates name length, email format and message length (20-300)', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText('Full Name'), 'ab')
    await user.type(screen.getByLabelText('Work Email'), 'a@b')
    await user.type(screen.getByLabelText('Message'), 'too short')
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Full name must be at least 3 characters')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Message must be at least 20 characters')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'x'.repeat(301) } })
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Message must be at most 300 characters')).toBeInTheDocument()
    expect(screen.getByText('301/300')).toBeInTheDocument()
  })

  it('rejects whitespace-only name and message', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: '     ' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: ' '.repeat(30) } })
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Message is required')).toBeInTheDocument()
  })

  it('ignores repeated submit events while a submission is pending', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillValid(user)
    const form = screen.getByRole('button', { name: 'Send Message' }).closest('form')!
    fireEvent.submit(form)
    const busy = await screen.findByRole('button', { name: /submitting/i })
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(busy).toBeDisabled()
    await waitFor(() => expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument(), { timeout: 3000 })
    expect(screen.getAllByText(SUCCESS_MESSAGE)).toHaveLength(1)
  })

  it('shows live character count', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText('Message'), 'hello')
    expect(screen.getByText('5/300')).toBeInTheDocument()
  })

  it('disables submit while processing, then shows success', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    const busy = await screen.findByRole('button', { name: /submitting/i })
    expect(busy).toBeDisabled()
    await waitFor(() => expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument(), { timeout: 3000 })
  })

  describe('mobile (375px design)', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('preselects Team Size and uses the mobile placeholders', () => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }))
      render(<ContactForm />)
      expect(screen.getByLabelText('Team Size')).toHaveValue('1-10')
      expect(screen.getByRole('option', { name: '1 - 10 members' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Sarah Connor')).toBeInTheDocument()
      expect(screen.getByText('Contact form reference')).toBeInTheDocument()
    })

    it('follows the viewport for the Team Size default until the user picks a size', async () => {
      let matches = false
      const listeners = new Set<() => void>()
      vi.stubGlobal('matchMedia', (query: string) => ({
        get matches() {
          return matches
        },
        media: query,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      }))
      const resizeTo = (mobile: boolean) =>
        act(() => {
          matches = mobile
          listeners.forEach((cb) => cb())
        })
      const user = userEvent.setup()
      render(<ContactForm />)
      expect(screen.getByLabelText('Team Size')).toHaveValue('')

      resizeTo(true) // resized below md after load
      await waitFor(() => expect(screen.getByLabelText('Team Size')).toHaveValue('1-10'))
      resizeTo(false)
      await waitFor(() => expect(screen.getByLabelText('Team Size')).toHaveValue(''))

      resizeTo(true)
      await waitFor(() => expect(screen.getByLabelText('Team Size')).toHaveValue('1-10'))
      await user.selectOptions(screen.getByLabelText('Team Size'), '51-200')
      resizeTo(false) // the user's own choice is kept
      expect(screen.getByLabelText('Team Size')).toHaveValue('51-200')
    })

    it('keeps Team Size empty on desktop', () => {
      render(<ContactForm />)
      expect(screen.getByLabelText('Team Size')).toHaveValue('')
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    })
  })
})
