import { useEffect, useRef, useState } from 'react'
import closeIcon from '../../assets/icons/close.svg'
import chevronIcon from '../../assets/icons/chevron-right.svg'
import menuIcon from '../../assets/icons/menu.svg'
import { navLinks } from '../../data/nav'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`whitespace-nowrap text-[1.0625rem] font-bold tracking-[-0.025em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}>
      <span aria-hidden>▰ </span>FlowPilot
    </a>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const headerRef = useRef<HTMLElement>(null)

  // Escape closes the menu; focus moves into the menu on open and back to the toggle on close.
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      closeRef.current?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('keydown', onKey)
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // Make the page behind the menu inert so Tab and screen readers stay inside it.
      const behind = [
        document.querySelector('main'),
        document.querySelector('footer'),
        headerRef.current?.firstElementChild,
      ].filter((el): el is HTMLElement => el instanceof HTMLElement)
      behind.forEach((el) => el.setAttribute('inert', ''))
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = prevOverflow
        behind.forEach((el) => el.removeAttribute('inert'))
      }
    }
    if (wasOpen.current) {
      wasOpen.current = false
      toggleRef.current?.focus()
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-line-soft bg-surface">
      <Container className="flex h-16 items-center justify-between lg:h-[4.6875rem]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((l) => (
              <li key={l.href + l.label}>
                <a href={l.href} className="text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="#contact" className="text-[0.8125rem] font-semibold text-ink transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Log In</a>
          <ButtonLink href="#contact" className="w-[9.375rem]">Get Started</ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-1 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <img src={menuIcon} alt="" width={26} height={24} />
        </button>
      </Container>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-surface font-menu lg:hidden">
          <div className="flex items-center justify-between px-6 pb-[1.3125rem] pt-7">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand"
            >
              <img src={closeIcon} alt="" width={20} height={20} />
            </button>
          </div>
          <nav id="mobile-nav" aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <li key={l.href + l.label}>
                  <a
                    href={l.href}
                    onClick={close}
                    className="flex items-center justify-between rounded-xl p-3.5 text-[1.05rem] font-semibold leading-[1.575rem] text-menu-ink transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-brand"
                  >
                    {l.mobileLabel ?? l.label}
                    <img src={chevronIcon} alt="" width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3 px-6 pb-9 pt-4">
            <a
              href="#contact"
              onClick={close}
              className="rounded-xl border border-menu-line px-4 py-[0.9375rem] text-center text-[0.98125rem] font-semibold leading-[1.46875rem] text-menu-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Log In
            </a>
            <a
              href="#contact"
              onClick={close}
              className="rounded-xl bg-linear-to-r from-menu-from to-menu-to px-4 py-3.5 text-center text-[0.98125rem] font-semibold leading-[1.46875rem] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Start Free
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
