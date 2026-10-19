import type { ReactNode } from 'react'

interface Props {
  id?: string
  title: ReactNode
  subtitle?: string
  /** Eyebrow label above the title (e.g. "Testimonials"). */
  eyebrow?: string
  align?: 'center' | 'left'
  size?: 'md' | 'lg'
  /** Figma's 375px Features section has no subtitle. */
  subtitleFromMd?: boolean
  /** Extra classes for the subtitle (e.g. a different top margin). */
  subtitleClassName?: string
}

/** Section title (h2). The page's single h1 lives in the Hero. */
export function SectionHeading({ id, title, subtitle, eyebrow, align = 'center', size = 'md', subtitleFromMd = false, subtitleClassName = '' }: Props) {
  const titleSize = size === 'lg' ? 'text-[1.625rem] leading-7 md:text-4xl md:leading-[3.375rem]' : 'text-[1.625rem] leading-7 md:text-[2.125rem] md:leading-[3.1875rem]'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl md:text-center' : ''}>
      {eyebrow && <p className="mb-[0.53125rem] text-[0.8125rem] font-bold uppercase tracking-[0.02031rem] text-brand">{eyebrow}</p>}
      <h2 id={id} className={`font-extrabold tracking-[-0.025em] text-ink ${titleSize}`}>{title}</h2>
      {subtitle && <p className={`mt-2 text-xs text-muted md:text-[0.9375rem] md:leading-[1.40625rem] ${subtitleFromMd ? 'hidden md:block' : ''} ${subtitleClassName}`}>{subtitle}</p>}
    </div>
  )
}
