import { useRef, useState, type TouchEvent } from 'react'
import { testimonials as defaultItems } from '../../data/testimonials'
import type { Testimonial } from '../../types'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const SWIPE_THRESHOLD = 40
const SLIDE_GAP = 1 // rem, matches gap-4 on the track

const arrowClass =
  'hidden size-[2.625rem] shrink-0 items-center justify-center md:flex rounded-[0.625rem] border border-line bg-surface text-lg font-semibold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function TestimonialSlider({ items = defaultItems }: { items?: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setIndex((i) => (i + 1) % items.length)

  // Mobile has no arrows or dots (per design): the track follows the finger and
  // slides to the next/previous card on release.
  const [dragX, setDragX] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const atStart = index === 0
  const atEnd = index === items.length - 1

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    // Resist dragging past the first/last card.
    setDragX((dx > 0 && atStart) || (dx < 0 && atEnd) ? dx * 0.3 : dx)
  }
  // The browser can take over a touch (e.g. a vertical scroll): drop the drag and snap back.
  const onTouchCancel = () => {
    touchStartX.current = null
    setDragX(0)
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    setDragX(0)
    if (dx <= -SWIPE_THRESHOLD && !atEnd) setIndex(index + 1)
    else if (dx >= SWIPE_THRESHOLD && !atStart) setIndex(index - 1)
  }
  const dragging = dragX !== 0

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="mx-[1.09375rem] bg-surface pb-[1.5625rem] pt-7 md:mx-0 md:py-20">
      <Container className="flex flex-col gap-[1.125rem] md:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-[0.875rem]">
        <div className="lg:w-[29.25rem] lg:shrink-0">
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Testimonials"
            title="Loved by modern teams"
            subtitle="See how FlowPilot helps teams work smarter and save time."
            align="left"
            subtitleClassName="mt-0! pt-[1.7875rem] md:pt-[0.6875rem]"
          />
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-6 lg:flex-1 lg:grid-cols-[auto_minmax(0,34.8125rem)_auto] lg:justify-end lg:gap-x-[0.875rem]">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className={`${arrowClass} row-start-2 justify-self-start lg:row-start-1`}
          >
            <span aria-hidden>‹</span>
          </button>

          {/* Slides sit side by side on a track that slides with the index. Flex stretch
              keeps every card as tall as the tallest, so height never changes. */}
          <div
            aria-live="polite"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            className="col-span-3 row-start-1 touch-pan-y overflow-x-clip lg:col-span-1 lg:col-start-2"
          >
            <div
              className={`flex gap-4 ease-out motion-reduce:transition-none ${dragging ? '' : 'transition-transform duration-300'}`}
              style={{ transform: `translateX(calc(${-index} * (100% + ${SLIDE_GAP}rem) + ${dragX}px))` }}
            >
              {items.map((t, i) => (
                <figure
                  key={t.id}
                  inert={i !== index}
                  className="bg-soft-gradient relative flex min-h-[13.75rem] w-full shrink-0 flex-col justify-between rounded-[1.125rem] p-5 md:border md:border-line md:bg-none md:min-h-[15.9375rem] md:bg-surface md:p-8 md:shadow-soft"
                >
                  <div>
                    <span aria-hidden className="block h-10 text-[2.75rem] font-bold leading-[2.75rem] text-brand-end md:absolute md:left-6 md:top-4 md:h-auto md:text-[3.375rem] md:leading-[3.375rem]">
                      “
                    </span>
                    <blockquote className="text-sm font-medium leading-[1.1875rem] text-ink md:pl-7 md:pt-2 md:text-lg md:leading-[1.51875rem]">
                      {t.desktopLines
                        ? t.desktopLines.map((line) => (
                            <span key={line} className="lg:block">{line}{' '}</span>
                          ))
                        : t.quote}
                    </blockquote>
                  </div>
                  <figcaption className="mt-4 flex items-center justify-between md:pl-7">
                    <span>
                      <span className="block text-xs font-bold leading-[1.125rem] text-ink md:text-[0.8125rem] md:leading-[1.21875rem]">{t.author}</span>
                      <span className="block text-[0.625rem] leading-[0.9375rem] text-muted md:text-[0.6875rem] md:leading-[1.03125rem]">{t.role}</span>
                    </span>
                    <span role="img" aria-label="5 out of 5 stars" className="hidden text-sm tracking-[0.0875rem] text-gold md:block">
                      ★★★★★
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <ul className="col-start-2 row-start-2 hidden justify-center gap-2 md:flex" aria-label="Testimonial indicator">
            {items.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1} of ${items.length}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    i === index ? 'w-6 bg-brand-gradient' : 'w-2.5 bg-line hover:bg-subtle'
                  }`}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className={`${arrowClass} col-start-3 row-start-2 justify-self-end lg:row-start-1`}
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </Container>
    </section>
  )
}
