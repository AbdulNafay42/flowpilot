import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestimonialSlider } from '../components/sections/TestimonialSlider'
import type { Testimonial } from '../types'

const items: Testimonial[] = [
  { id: '1', quote: 'First quote', author: 'A', role: 'r' },
  { id: '2', quote: 'Second quote', author: 'B', role: 'r' },
]

describe('TestimonialSlider', () => {
  it('moves with next/previous and updates the indicator', async () => {
    const user = userEvent.setup()
    render(<TestimonialSlider items={items} />)
    const slide = (text: RegExp) => screen.getByText(text).closest('figure')!
    expect(slide(/First quote/)).not.toHaveAttribute('inert')
    expect(slide(/Second quote/)).toHaveAttribute('inert')

    await user.click(screen.getByRole('button', { name: 'Next testimonial' }))
    expect(slide(/Second quote/)).not.toHaveAttribute('inert')
    expect(slide(/First quote/)).toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: /testimonial 2 of 2/ })).toHaveAttribute('aria-current', 'true')

    await user.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    expect(slide(/First quote/)).not.toHaveAttribute('inert')
  })

  it('changes slide on a horizontal swipe (mobile has no arrows)', () => {
    render(<TestimonialSlider items={items} />)
    const live = screen.getByText(/First quote/).closest('[aria-live]')!
    const indicator = () => screen.getByRole('button', { name: /testimonial 2 of 2/ })

    fireEvent.touchStart(live, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(live, { changedTouches: [{ clientX: 80 }] }) // swipe left: next
    expect(indicator()).toHaveAttribute('aria-current', 'true')

    fireEvent.touchStart(live, { touches: [{ clientX: 80 }] })
    fireEvent.touchEnd(live, { changedTouches: [{ clientX: 100 }] }) // too short: ignored
    expect(indicator()).toHaveAttribute('aria-current', 'true')

    fireEvent.touchStart(live, { touches: [{ clientX: 80 }] })
    fireEvent.touchEnd(live, { changedTouches: [{ clientX: 220 }] }) // swipe right: previous
    expect(screen.getByRole('button', { name: /testimonial 1 of 2/ })).toHaveAttribute('aria-current', 'true')
  })

  it('resets a drag that the browser cancels', () => {
    render(<TestimonialSlider items={items} />)
    const live = screen.getByText(/First quote/).closest('[aria-live]')!
    const track = live.firstElementChild as HTMLElement
    fireEvent.touchStart(live, { touches: [{ clientX: 200 }] })
    fireEvent.touchMove(live, { touches: [{ clientX: 150 }] })
    expect(track.style.transform).toContain('-50px')
    fireEvent.touchCancel(live)
    expect(track.style.transform).toContain('+ 0px')
  })
})
