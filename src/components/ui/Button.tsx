import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-[0.625rem] font-semibold transition-[opacity,background-color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-brand-contrast shadow-btn hover:opacity-90',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-alt',
  ghost: 'text-ink hover:text-brand',
}

// Heights/type sizes from Figma: header 42/13, hero 44 (mobile) and 48 (desktop), pricing 40/13.
const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.8125rem]',
  md: 'h-[2.625rem] px-5 text-[0.8125rem]',
  lg: 'h-11 px-3 text-[0.8125rem] md:h-12 md:px-5 md:text-sm',
}

interface Common {
  variant?: Variant
  size?: Size
}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Common
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & Common

const cls = (variant: Variant, size: Size, extra: string) =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim()

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return <button className={cls(variant, size, className)} {...props} />
}

/** Anchor styled as a button, for CTAs that scroll to a section. */
export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: LinkProps) {
  return <a className={cls(variant, size, className)} {...props} />
}
