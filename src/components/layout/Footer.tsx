import footerLogo from '../../assets/icons/footer-logo.svg'
import { footerContent } from '../../data/footer'
import { Container } from '../ui/Container'

const year = new Date().getFullYear()

const linkClass =
  'text-[0.8125rem] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function Footer() {
  return (
    <footer className="mx-[1.09375rem] border-t border-line-soft bg-surface pb-6 pt-[1.5625rem] md:mx-0 md:pb-12 md:pt-[3.0625rem]">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center justify-between md:block">
          <p className="flex items-center gap-2 text-[0.8125rem] font-bold leading-[1.21875rem] text-ink">
            <img src={footerLogo} alt="" width={13} height={19.5} />
            FlowPilot
          </p>
          <p className="text-[0.6875rem] leading-[1.03125rem] text-muted md:hidden">&copy; {year} FlowPilot, Inc.</p>
        </div>

        <div className="md:text-center">
          <p className="hidden text-[0.8125rem] leading-[1.21875rem] text-muted md:block">
            &copy; {year} FlowPilot Inc. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {footerContent.linkGroups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <ul className="grid grid-cols-[repeat(3,minmax(0,6.125rem))] gap-6 md:flex md:gap-6">
                {group.links.map((l) => (
                  <li key={l.label} className="md:contents">
                    <a href={l.href} className={linkClass}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          {footerContent.socialLinks.length > 0 && (
            <ul aria-label="Social links" className="flex items-center gap-4">
              {footerContent.socialLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  )
}
