import type { ReactNode } from 'react'

/** Page width from Figma: max 1440px, 64px side padding on desktop, 20px on mobile. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-5 md:px-8 lg:px-16 ${className}`}>{children}</div>
}
