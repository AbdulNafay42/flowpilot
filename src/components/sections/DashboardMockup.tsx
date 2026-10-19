import { useRef, useState, type KeyboardEvent } from 'react'
import { dashboard, type TaskStatus } from '../../data/hero'

const statusColor: Record<TaskStatus, string> = {
  'In Progress': 'text-warning',
  Completed: 'text-success',
  Upcoming: 'text-subtle',
}

function TaskList() {
  return (
    <ul className="mt-[0.2875rem] md:mt-0 md:border-t md:border-line-soft">
      {dashboard.tasks.map((t) => (
        <li
          key={t.name}
          className="flex items-center justify-between border-t border-line-soft pb-1 pt-[0.25rem] md:border-b md:border-t-0 md:py-2 md:last:border-b-0"
        >
          <span className="flex items-center gap-1.5 text-[0.59375rem] font-medium text-ink md:gap-3 md:text-xs">
            <span className="size-3.5 shrink-0 rounded bg-task-box md:size-[1.125rem] md:rounded-md" />
            <span className="md:hidden">{t.short}</span>
            <span className="hidden md:inline">{t.name}</span>
          </span>
          <span className={`text-[0.53125rem] font-semibold md:text-[0.6875rem] ${statusColor[t.status]}`}>{t.status}</span>
        </li>
      ))}
    </ul>
  )
}

function OverviewPanel() {
  return (
    <>
      <p className="text-sm font-bold leading-[1.3125rem] text-ink md:text-xl md:leading-[1.5625rem]">{dashboard.greeting}</p>
      <p className="text-[0.59375rem] leading-[0.7425rem] text-muted md:mt-1 md:text-[0.6875rem] md:leading-[1.03125rem]">{dashboard.intro}</p>

      <ul className="mt-[0.5375rem] grid grid-cols-3 gap-1.5 md:mt-3 md:gap-2.5">
        {dashboard.stats.map((s) => (
          <li
            key={s.label}
            className="flex flex-col items-center rounded-lg border border-line bg-stat p-[0.3125rem] text-center md:h-[5.125rem] md:items-start md:justify-center md:rounded-xl md:px-[0.8125rem] md:text-left"
          >
            <span className="text-sm font-bold leading-[0.875rem] text-ink md:text-[1.3125rem] md:leading-[1.625rem]">{s.value}</span>
            <span className="mt-0.5 text-[0.5rem] font-medium leading-[0.625rem] text-muted md:mt-1 md:text-[0.6875rem] md:leading-[1.03125rem]">
              <span className="md:hidden">{s.short}</span>
              <span className="hidden md:inline">{s.label}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-[0.6625rem] text-[0.6875rem] font-bold leading-[1.03125rem] text-ink md:mt-5 md:pb-2 md:text-sm md:leading-[1.3125rem]">
        {dashboard.tasksHeading}
      </p>
      <TaskList />
    </>
  )
}

function TasksPanel() {
  return (
    <>
      <p className="text-sm font-bold leading-[1.3125rem] text-ink md:text-xl md:leading-[1.5625rem]">Tasks</p>
      <p className="mb-2 text-[0.59375rem] leading-3 text-muted md:mb-4 md:mt-1 md:text-[0.6875rem] md:leading-[1.03125rem]">{dashboard.tasksIntro}</p>
      <TaskList />
    </>
  )
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <>
      <p className="text-sm font-bold leading-[1.3125rem] text-ink md:text-xl md:leading-[1.5625rem]">{title}</p>
      <p className="text-[0.59375rem] leading-3 text-muted md:mt-1 md:text-[0.6875rem] md:leading-[1.03125rem]">{dashboard.emptyPanelText}</p>
    </>
  )
}

/** Coded product visual for the Hero. The sidebar is a working vertical tab list. */
export function DashboardMockup() {
  const [activeId, setActiveId] = useState(dashboard.sidebar[0].id)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const tabs = dashboard.sidebar
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

  // Roving arrow-key navigation (WAI-ARIA tabs pattern, vertical).
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index
    if (e.key === 'ArrowDown') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    setActiveId(tabs[next].id)
    refs.current[tabs[next].id]?.focus()
  }

  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-[1.125rem] border border-line bg-surface p-[0.875rem] max-[22.5rem]:p-2.5 shadow-card md:gap-4 md:p-[1.0625rem] lg:h-[26.875rem] lg:max-w-[39.3125rem]">
      <div className="w-[6.875rem] max-[22.5rem]:w-[5.5rem] shrink-0 rounded-[0.875rem] border border-line-soft bg-surface-alt p-[0.625rem] max-[22.5rem]:p-1.5 md:w-[9.375rem] md:border-0 md:p-4">
        <p className="mb-2.5 p-1 text-[0.8125rem] font-bold text-ink md:mb-[1.375rem] md:p-0 md:text-[1.0625rem]">FlowPilot</p>
        <div role="tablist" aria-label="Dashboard sections" aria-orientation="vertical" className="flex flex-col gap-1.5 md:gap-1">
          {tabs.map((t, i) => {
            const selected = t.id === active.id
            return (
              <button
                key={t.id}
                ref={(el) => { refs.current[t.id] = el }}
                role="tab"
                id={`dash-tab-${t.id}`}
                type="button"
                aria-selected={selected}
                aria-controls="dash-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`rounded-lg px-2 py-1 text-left text-[0.6875rem] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand md:px-3 md:py-[0.3125rem] md:text-[0.8125rem] ${
                  selected
                    ? 'flex h-[1.625rem] items-center bg-tint-strong font-semibold text-brand md:block md:h-auto'
                    : 'font-medium text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id="dash-panel"
        aria-labelledby={`dash-tab-${active.id}`}
        className="min-w-0 flex-1 pl-3 max-[22.5rem]:pl-2 md:p-2 md:pl-0"
      >
        {active.id === 'overview' ? (
          <OverviewPanel />
        ) : active.id === 'tasks' ? (
          <TasksPanel />
        ) : (
          <EmptyPanel title={active.label} />
        )}
      </div>
    </div>
  )
}
