import { useRef, useState, type KeyboardEvent } from 'react'
import { tabs as defaultTabs, tabsHeading } from '../../data/tabs'
import type { TabItem } from '../../types'
import { Container } from '../ui/Container'

export function FeatureTabs({ items = defaultTabs }: { items?: TabItem[] }) {
  const [activeId, setActiveId] = useState(items[0].id)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const active = items.find((t) => t.id === activeId) ?? items[0]

  // Roving arrow-key navigation (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % items.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else return
    e.preventDefault()
    setActiveId(items[next].id)
    refs.current[items[next].id]?.focus()
  }

  return (
    <section id="how-it-works" aria-labelledby="tabs-heading" className="mx-[0.90625rem] bg-surface py-6 md:mx-0 md:py-14">
      <Container className="px-[0.65625rem]! md:px-8! lg:px-16!">
        <div className="bg-soft-gradient flex flex-col gap-[1.8125rem] rounded-3xl pb-14 pt-10 md:gap-8 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-x-[1.5625rem]">
          <div className="min-w-0 pl-[1.8125rem] pr-6 md:px-0 lg:flex-1">
            <h2 id="tabs-heading" className="text-[1.875rem] font-extrabold leading-[2.34375rem] text-ink">{tabsHeading.title}</h2>
            <p className="mt-[0.53125rem] text-sm leading-[1.3125rem] text-muted">{tabsHeading.subtitle}</p>

            <div
              role="tablist"
              aria-label="Workflow stages"
              className="no-scrollbar -ml-[1.8125rem] -mr-6 mt-6 flex gap-3 overflow-x-auto pb-0 pl-[1.8125rem] pr-6 md:mx-0 md:px-0 md:pb-1"
            >
              {items.map((t, i) => {
                const selected = t.id === active.id
                return (
                  <button
                    key={t.id}
                    ref={(el) => { refs.current[t.id] = el }}
                    role="tab"
                    id={`tab-${t.id}`}
                    type="button"
                    aria-selected={selected}
                    aria-controls="tab-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(t.id)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`h-10 w-[6.75rem] shrink-0 rounded-[0.625rem] text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      selected ? 'bg-brand-gradient text-brand-contrast' : 'bg-surface text-ink hover:text-brand'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id="tab-panel"
              aria-labelledby={`tab-${active.id}`}
              tabIndex={0}
              className="mt-8 flex min-h-20 max-w-[35rem] flex-col justify-center rounded-[0.875rem] border border-line bg-surface px-6 py-[1.1875rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <h3 className="text-base font-bold leading-[1.375rem] text-ink">{active.title}</h3>
              <p className="text-xs leading-[1.125rem] text-muted">{active.description}</p>
            </div>
          </div>

          <div className="mx-[0.65625rem] flex min-h-[11.1875rem] flex-col justify-center rounded-2xl border border-line bg-surface p-8 md:mx-0 lg:h-[13.125rem] lg:w-[30.4375rem] lg:shrink-0">
            <p className="text-[2.5rem] font-extrabold leading-10 text-ink">{active.metric.value}</p>
            <p className="mt-1 text-[0.8125rem] font-medium leading-[1.21875rem] text-muted">{active.metric.label}</p>
            <div className="mt-6 h-4 w-full max-w-[26.25rem] overflow-hidden rounded-lg bg-track" aria-hidden>
              <div className="bg-brand-gradient h-full rounded-lg transition-[width] duration-300" style={{ width: `${active.metric.percent}%` }} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
